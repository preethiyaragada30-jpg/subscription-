package com.subscriptionmanager.dto;

import com.subscriptionmanager.entity.ChurnPrediction;
import com.subscriptionmanager.entity.ChurnRisk;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChurnPredictionDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private Integer subscriptionDuration;
    private Integer missedPayments;
    private Integer usageFrequency;
    private Integer lastLoginDays;
    private Integer supportTickets;
    private BigDecimal churnProbability;
    private ChurnRisk churnRisk;
    private String reason;

    public static ChurnPredictionDTO fromEntity(ChurnPrediction c) {
        return ChurnPredictionDTO.builder()
                .id(c.getId())
                .customerId(c.getCustomerId())
                .customerName(c.getCustomerName())
                .subscriptionDuration(c.getSubscriptionDuration())
                .missedPayments(c.getMissedPayments())
                .usageFrequency(c.getUsageFrequency())
                .lastLoginDays(c.getLastLoginDays())
                .supportTickets(c.getSupportTickets())
                .churnProbability(c.getChurnProbability())
                .churnRisk(c.getChurnRisk())
                .build();
    }
}
