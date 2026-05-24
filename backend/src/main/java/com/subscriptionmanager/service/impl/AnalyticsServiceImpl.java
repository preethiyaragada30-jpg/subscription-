package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.AnalyticsDTO;
import com.subscriptionmanager.entity.ChurnRisk;
import com.subscriptionmanager.entity.PaymentStatus;
import com.subscriptionmanager.entity.Role;
import com.subscriptionmanager.entity.SubscriptionStatus;
import com.subscriptionmanager.repository.*;
import com.subscriptionmanager.service.AnalyticsService;
import com.subscriptionmanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ChurnPredictionRepository churnRepository;

    @Override
    public AnalyticsDTO getRevenueAnalytics() {
        return buildBaseAnalytics();
    }

    @Override
    public AnalyticsDTO getChurnAnalytics() {
        AnalyticsDTO dto = buildBaseAnalytics();
        dto.setChurnByRisk(List.of(
                Map.of("risk", "HIGH", "count", churnRepository.countByChurnRisk(ChurnRisk.HIGH)),
                Map.of("risk", "MEDIUM", "count", churnRepository.countByChurnRisk(ChurnRisk.MEDIUM)),
                Map.of("risk", "LOW", "count", churnRepository.countByChurnRisk(ChurnRisk.LOW))
        ));
        return dto;
    }

    @Override
    public AnalyticsDTO getDashboardAnalytics() {
        return buildBaseAnalytics();
    }

    private AnalyticsDTO buildBaseAnalytics() {
        LocalDate today = LocalDate.now();
        BigDecimal total = paymentRepository.sumAmountByStatus(PaymentStatus.COMPLETED);
        BigDecimal monthly = paymentRepository.sumCompletedBetween(
                DateUtil.startOfMonth(today), DateUtil.endOfMonth(today));

        long activeSubs = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
        long inactiveSubs = subscriptionRepository.count() - activeSubs;
        long activeUsers = userRepository.count();
        long adminUsers = userRepository.countByRole(Role.ADMIN);
        long inactiveUsers = Math.max(0, activeUsers - adminUsers - activeSubs);

        long high = churnRepository.countByChurnRisk(ChurnRisk.HIGH);
        long totalChurn = churnRepository.count();
        BigDecimal churnRate = totalChurn == 0 ? BigDecimal.ZERO :
                BigDecimal.valueOf(high * 100.0 / totalChurn).setScale(2, RoundingMode.HALF_UP);

        return AnalyticsDTO.builder()
                .totalRevenue(total)
                .monthlyRevenue(monthly)
                .activeSubscriptions(activeSubs)
                .inactiveSubscriptions(inactiveSubs)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .churnRate(churnRate)
                .monthlyGrowth(paymentRepository.monthlyRevenueAggregates().stream()
                        .map(r -> Map.<String, Object>of("month", r[0], "value", r[1]))
                        .toList())
                .revenueAnalytics(Map.of("total", total, "monthly", monthly))
                .customerAnalytics(Map.of("totalUsers", activeUsers, "growth", activeUsers))
                .subscriptionAnalytics(Map.of("active", activeSubs, "inactive", inactiveSubs))
                .build();
    }
}
