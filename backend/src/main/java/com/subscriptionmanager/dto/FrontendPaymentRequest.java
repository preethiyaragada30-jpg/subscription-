package com.subscriptionmanager.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FrontendPaymentRequest {
    private String userName;
    private BigDecimal amount;
    private String method;
    private String date;
    private String status;
}
