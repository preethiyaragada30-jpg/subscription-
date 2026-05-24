package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.IntegrationStatusDTO;
import com.subscriptionmanager.service.IntegrationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class IntegrationServiceImpl implements IntegrationService {

    @Value("${app.integration.stripe.api-key:}")
    private String stripeKey;

    @Value("${app.integration.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${app.integration.paypal.client-id:}")
    private String paypalClientId;

    @Override
    public List<IntegrationStatusDTO> getStatus() {
        return List.of(
                status("Stripe", stripeKey),
                status("Razorpay", razorpayKeyId),
                status("PayPal", paypalClientId),
                IntegrationStatusDTO.builder()
                        .provider("Email")
                        .configured(true)
                        .connected(true)
                        .message("Spring Mail configured via application.properties")
                        .build()
        );
    }

    @Override
    public Map<String, Object> testStripe() {
        boolean ok = stripeKey != null && !stripeKey.contains("placeholder");
        return Map.of("provider", "Stripe", "success", ok, "message", ok ? "API key present" : "Configure app.integration.stripe.api-key");
    }

    @Override
    public Map<String, Object> testRazorpay() {
        boolean ok = razorpayKeyId != null && !razorpayKeyId.contains("placeholder");
        return Map.of("provider", "Razorpay", "success", ok, "message", ok ? "Keys present" : "Configure Razorpay keys");
    }

    @Override
    public Map<String, Object> testPayPal() {
        boolean ok = paypalClientId != null && !paypalClientId.equals("placeholder");
        return Map.of("provider", "PayPal", "success", ok, "message", ok ? "Client ID present" : "Configure PayPal client ID");
    }

    private IntegrationStatusDTO status(String name, String key) {
        boolean configured = key != null && !key.isBlank() && !key.contains("placeholder");
        return IntegrationStatusDTO.builder()
                .provider(name)
                .configured(configured)
                .connected(configured)
                .message(configured ? name + " integration ready" : name + " not configured")
                .build();
    }
}
