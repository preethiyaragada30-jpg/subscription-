package com.subscriptionmanager.dto;

import com.subscriptionmanager.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDTO {
    private Long id;
    private Long userId;
    private String subscriptionName;
    private String customerName;
    private String customerEmail;
    private BigDecimal amount;
    private BillingCycle billingCycle;
    private LocalDate startDate;
    private LocalDate endDate;
    private SubscriptionStatus status;
    private String paymentMethod;
    private Boolean autoRenew;
    private String category;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SubscriptionDTO fromEntity(Subscription s) {
        return SubscriptionDTO.builder()
                .id(s.getId())
                .userId(s.getUser() != null ? s.getUser().getId() : null)
                .subscriptionName(s.getSubscriptionName())
                .customerName(s.getCustomerName())
                .customerEmail(s.getCustomerEmail())
                .amount(s.getAmount())
                .billingCycle(s.getBillingCycle())
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .status(s.getStatus())
                .paymentMethod(s.getPaymentMethod())
                .autoRenew(s.getAutoRenew())
                .category(s.getCategory())
                .notes(s.getNotes())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
