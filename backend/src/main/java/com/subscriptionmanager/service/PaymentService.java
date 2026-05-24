package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.FrontendPaymentRequest;
import com.subscriptionmanager.dto.PaymentDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface PaymentService {
    List<PaymentDTO> getAll();
    PaymentDTO create(PaymentDTO dto);
    PaymentDTO createFromFrontend(FrontendPaymentRequest request);
    PaymentDTO updateStatus(String transactionId, String status);
    Map<String, Object> getRevenueAnalytics();
    List<PaymentDTO> getFailedPayments();
}
