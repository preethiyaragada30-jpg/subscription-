package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.DashboardDTO;
import com.subscriptionmanager.service.DashboardService;
import com.subscriptionmanager.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardDTO>> stats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }
}
