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
public class AnalyticsDTO {
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private long activeSubscriptions;
    private long inactiveSubscriptions;
    private long activeUsers;
    private long inactiveUsers;
    private BigDecimal churnRate;
    private List<Map<String, Object>> monthlyGrowth;
    private List<Map<String, Object>> churnByRisk;
    private Map<String, Object> revenueAnalytics;
    private Map<String, Object> customerAnalytics;
    private Map<String, Object> subscriptionAnalytics;
}
