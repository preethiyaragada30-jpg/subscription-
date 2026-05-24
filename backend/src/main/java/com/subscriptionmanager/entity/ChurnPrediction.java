package com.subscriptionmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "churn_predictions", indexes = {
        @Index(name = "idx_churn_customer", columnList = "customer_id"),
        @Index(name = "idx_churn_risk", columnList = "churn_risk")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChurnPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "subscription_duration")
    private Integer subscriptionDuration;

    @Column(name = "missed_payments")
    @Builder.Default
    private Integer missedPayments = 0;

    @Column(name = "usage_frequency")
    @Builder.Default
    private Integer usageFrequency = 50;

    @Column(name = "last_login_days")
    @Builder.Default
    private Integer lastLoginDays = 0;

    @Column(name = "support_tickets")
    @Builder.Default
    private Integer supportTickets = 0;

    @Column(name = "churn_probability", precision = 5, scale = 2)
    private BigDecimal churnProbability;

    @Enumerated(EnumType.STRING)
    @Column(name = "churn_risk", nullable = false)
    private ChurnRisk churnRisk;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
