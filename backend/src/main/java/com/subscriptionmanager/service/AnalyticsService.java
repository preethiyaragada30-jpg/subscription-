package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.AnalyticsDTO;

public interface AnalyticsService {
    AnalyticsDTO getRevenueAnalytics();
    AnalyticsDTO getChurnAnalytics();
    AnalyticsDTO getDashboardAnalytics();
}
