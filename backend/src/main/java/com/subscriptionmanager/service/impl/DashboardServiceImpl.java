package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.DashboardDTO;
import com.subscriptionmanager.entity.ChurnRisk;
import com.subscriptionmanager.entity.PaymentStatus;
import com.subscriptionmanager.entity.SubscriptionStatus;
import com.subscriptionmanager.repository.*;
import com.subscriptionmanager.service.DashboardService;
import com.subscriptionmanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ChurnPredictionRepository churnRepository;

    @Override
    public DashboardDTO getStats() {
        LocalDate today = LocalDate.now();
        long active = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
        long expired = subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRED);
        long upcoming = subscriptionRepository.findByStatusAndEndDateBetween(
                SubscriptionStatus.ACTIVE, today, today.plusDays(30)).size();

        BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(PaymentStatus.COMPLETED);
        BigDecimal monthlyRevenue = paymentRepository.sumCompletedBetween(
                DateUtil.startOfMonth(today), DateUtil.endOfMonth(today));

        long totalUsers = userRepository.count();
        long high = churnRepository.countByChurnRisk(ChurnRisk.HIGH);
        long medium = churnRepository.countByChurnRisk(ChurnRisk.MEDIUM);
        long low = churnRepository.countByChurnRisk(ChurnRisk.LOW);
        long atRisk = high + medium + low;
        BigDecimal churnRate = atRisk == 0 ? BigDecimal.ZERO :
                BigDecimal.valueOf(high).multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(Math.max(atRisk, 1)), 2, RoundingMode.HALF_UP);

        Map<String, Long> subStats = Map.of(
                "ACTIVE", subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE),
                "EXPIRED", expired,
                "CANCELLED", subscriptionRepository.countByStatus(SubscriptionStatus.CANCELLED),
                "PENDING", subscriptionRepository.countByStatus(SubscriptionStatus.PENDING)
        );

        List<Map<String, Object>> revenueChart = new ArrayList<>();
        for (Object[] row : paymentRepository.monthlyRevenueAggregates()) {
            revenueChart.add(Map.of("month", row[0], "revenue", row[1]));
        }

        List<Map<String, Object>> activities = List.of(
                Map.of("type", "PAYMENT", "message", "Payment processed", "time", today.toString()),
                Map.of("type", "CHURN", "message", "High risk customer flagged", "time", today.minusDays(1).toString()),
                Map.of("type", "SUBSCRIPTION", "message", "New subscription created", "time", today.minusDays(2).toString())
        );

        return DashboardDTO.builder()
                .totalActiveSubscriptions(active)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .expiredSubscriptions(expired)
                .upcomingRenewals(upcoming)
                .churnRate(churnRate)
                .customerGrowth(totalUsers)
                .totalUsers(totalUsers)
                .subscriptionStatistics(subStats)
                .revenueChart(revenueChart)
                .recentActivities(activities)
                .highRiskCustomers(high)
                .mediumRiskCustomers(medium)
                .lowRiskCustomers(low)
                .build();
    }
}
