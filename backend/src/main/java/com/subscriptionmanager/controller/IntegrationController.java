package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.IntegrationStatusDTO;
import com.subscriptionmanager.service.IntegrationService;
import com.subscriptionmanager.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations")
@RequiredArgsConstructor
public class IntegrationController {

    private final IntegrationService integrationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IntegrationStatusDTO>>> status() {
        return ResponseEntity.ok(ApiResponse.success(integrationService.getStatus()));
    }

    @PostMapping("/stripe/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testStripe() {
        return ResponseEntity.ok(ApiResponse.success(integrationService.testStripe()));
    }

    @PostMapping("/razorpay/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testRazorpay() {
        return ResponseEntity.ok(ApiResponse.success(integrationService.testRazorpay()));
    }

    @PostMapping("/paypal/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testPayPal() {
        return ResponseEntity.ok(ApiResponse.success(integrationService.testPayPal()));
    }
}
