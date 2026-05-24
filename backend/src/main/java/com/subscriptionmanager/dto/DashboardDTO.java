package com.subscriptionmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long totalActiveSubscriptions;
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private long expiredSubscriptions;
    private long upcomingRenewals;
    private BigDecimal churnRate;
    private long customerGrowth;
    private long totalUsers;
    private Map<String, Long> subscriptionStatistics;
    private List<Map<String, Object>> revenueChart;
    private List<Map<String, Object>> recentActivities;
    private long highRiskCustomers;
    private long mediumRiskCustomers;
    private long lowRiskCustomers;
}
