package com.subscriptionmanager.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChurnPredictRequest {
    @NotNull
    private Long customerId;
    private String customerName;
    private Integer subscriptionDuration;
    private Integer missedPayments;
    private Integer usageFrequency;
    private Integer lastLoginDays;
    private Integer supportTickets;
}
