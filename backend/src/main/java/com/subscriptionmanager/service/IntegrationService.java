package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.IntegrationStatusDTO;

import java.util.List;
import java.util.Map;

public interface IntegrationService {
    List<IntegrationStatusDTO> getStatus();
    Map<String, Object> testStripe();
    Map<String, Object> testRazorpay();
    Map<String, Object> testPayPal();
}
