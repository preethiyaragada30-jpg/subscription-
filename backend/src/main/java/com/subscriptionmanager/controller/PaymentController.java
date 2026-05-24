package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.FrontendPaymentRequest;
import com.subscriptionmanager.dto.PaymentDTO;
import com.subscriptionmanager.service.PaymentService;
import com.subscriptionmanager.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments")
public class PaymentController {

    private final PaymentService paymentService;

    /** Frontend-compatible: returns array directly */
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAll() {
        return ResponseEntity.ok(paymentService.getAll());
    }

    /** Frontend-compatible: accepts userName, amount, method, date, status */
    @PostMapping
    public ResponseEntity<PaymentDTO> create(@RequestBody FrontendPaymentRequest request) {
        return ResponseEntity.ok(paymentService.createFromFrontend(request));
    }

    @PutMapping("/{transactionId}/status")
    public ResponseEntity<PaymentDTO> updateStatus(
            @PathVariable String transactionId,
            @RequestParam String status) {
        return ResponseEntity.ok(paymentService.updateStatus(transactionId, status));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<Map<String, Object>>> revenue() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getRevenueAnalytics()));
    }

    @GetMapping("/failed")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> failed() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getFailedPayments()));
    }
}
