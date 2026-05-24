package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.ChurnPredictRequest;
import com.subscriptionmanager.dto.ChurnPredictionDTO;
import com.subscriptionmanager.entity.ChurnPrediction;
import com.subscriptionmanager.entity.ChurnRisk;
import com.subscriptionmanager.entity.User;
import com.subscriptionmanager.exception.ResourceNotFoundException;
import com.subscriptionmanager.repository.ChurnPredictionRepository;
import com.subscriptionmanager.repository.UserRepository;
import com.subscriptionmanager.service.ChurnPredictionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChurnPredictionServiceImpl implements ChurnPredictionService {

    private final ChurnPredictionRepository churnRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ChurnPredictionDTO predict(ChurnPredictRequest request) {
        String customerName = request.getCustomerName();
        if (customerName == null) {
            customerName = userRepository.findById(request.getCustomerId())
                    .map(User::getFullName)
                    .orElse("Customer " + request.getCustomerId());
        }

        int missed = defaultInt(request.getMissedPayments(), 0);
        int usage = defaultInt(request.getUsageFrequency(), 50);
        int lastLogin = defaultInt(request.getLastLoginDays(), 0);
        int tickets = defaultInt(request.getSupportTickets(), 0);
        int duration = defaultInt(request.getSubscriptionDuration(), 12);

        BigDecimal probability = calculateProbability(missed, usage, lastLogin, tickets, duration);
        ChurnRisk risk = mapRisk(probability);

        ChurnPrediction entity = churnRepository.findByCustomerId(request.getCustomerId())
                .orElse(ChurnPrediction.builder().customerId(request.getCustomerId()).build());

        entity.setCustomerName(customerName);
        entity.setSubscriptionDuration(duration);
        entity.setMissedPayments(missed);
        entity.setUsageFrequency(usage);
        entity.setLastLoginDays(lastLogin);
        entity.setSupportTickets(tickets);
        entity.setChurnProbability(probability);
        entity.setChurnRisk(risk);

        entity = churnRepository.save(entity);
        ChurnPredictionDTO dto = ChurnPredictionDTO.fromEntity(entity);
        dto.setReason(buildReason(missed, usage, lastLogin, tickets, duration));
        return dto;
    }

    @Override
    public List<ChurnPredictionDTO> getHighRisk() {
        return churnRepository.findByChurnRiskOrderByChurnProbabilityDesc(ChurnRisk.HIGH)
                .stream()
                .map(c -> {
                    ChurnPredictionDTO dto = ChurnPredictionDTO.fromEntity(c);
                    dto.setReason(buildReason(c.getMissedPayments(), c.getUsageFrequency(),
                            c.getLastLoginDays(), c.getSupportTickets(), c.getSubscriptionDuration()));
                    return dto;
                })
                .toList();
    }

    @Override
    public List<ChurnPredictionDTO> getAll() {
        return churnRepository.findAll().stream().map(ChurnPredictionDTO::fromEntity).toList();
    }

    @Override
    @Transactional
    public void recalculateAll() {
        for (User user : userRepository.findAll()) {
            ChurnPredictRequest req = new ChurnPredictRequest();
            req.setCustomerId(user.getId());
            req.setCustomerName(user.getFullName());
            req.setMissedPayments((int) (user.getId() % 4));
            req.setUsageFrequency(30 + (int) (user.getId() % 50));
            req.setLastLoginDays((int) (user.getId() % 45));
            req.setSupportTickets((int) (user.getId() % 5));
            req.setSubscriptionDuration(6 + (int) (user.getId() % 18));
            predict(req);
        }
        log.info("Recalculated churn predictions for all users");
    }

    /**
     * Business-logic churn score (0–100).
     */
    BigDecimal calculateProbability(int missedPayments, int usageFrequency,
                                    int lastLoginDays, int supportTickets, int subscriptionDuration) {
        double score = 0;
        score += Math.min(missedPayments * 15, 45);
        score += usageFrequency < 30 ? 25 : usageFrequency < 50 ? 12 : 0;
        score += lastLoginDays > 30 ? 25 : lastLoginDays > 14 ? 12 : 0;
        score += supportTickets > 3 ? 10 : supportTickets * 2;
        score += subscriptionDuration < 3 ? 15 : 0;
        score = Math.min(score, 100);
        return BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP);
    }

    ChurnRisk mapRisk(BigDecimal probability) {
        double p = probability.doubleValue();
        if (p >= 70) return ChurnRisk.HIGH;
        if (p >= 40) return ChurnRisk.MEDIUM;
        return ChurnRisk.LOW;
    }

    private String buildReason(int missed, int usage, int lastLogin, int tickets, int duration) {
        StringBuilder sb = new StringBuilder();
        if (missed >= 2) sb.append("High missed payments; ");
        if (usage < 30) sb.append("Low usage frequency; ");
        if (lastLogin > 14) sb.append("Inactive login; ");
        if (tickets > 2) sb.append("Elevated support tickets; ");
        if (duration < 3) sb.append("Short subscription tenure; ");
        if (sb.isEmpty()) return "Healthy engagement profile";
        return sb.toString().trim();
    }

    private int defaultInt(Integer value, int defaultValue) {
        return value != null ? value : defaultValue;
    }
}
