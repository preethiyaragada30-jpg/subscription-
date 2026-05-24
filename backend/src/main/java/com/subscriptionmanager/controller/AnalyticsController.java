package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.AnalyticsDTO;
import com.subscriptionmanager.service.AnalyticsService;
import com.subscriptionmanager.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> revenue() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRevenueAnalytics()));
    }

    @GetMapping("/churn")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> churn() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getChurnAnalytics()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> dashboard() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getDashboardAnalytics()));
    }
}
