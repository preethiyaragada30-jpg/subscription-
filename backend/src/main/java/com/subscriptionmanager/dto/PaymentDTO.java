package com.subscriptionmanager.dto;

import com.subscriptionmanager.entity.Payment;
import com.subscriptionmanager.entity.PaymentStatus;
import com.subscriptionmanager.util.DateUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Matches frontend Payment shape: transactionId, userName, amount, method, date, status */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Long subscriptionId;
    private String transactionId;
    private String userName;
    private BigDecimal amount;
    private String method;
    private String date;
    private String status;
    private String paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDate paymentDate;

    public static PaymentDTO fromEntity(Payment p) {
        return PaymentDTO.builder()
                .id(p.getId())
                .subscriptionId(p.getSubscription() != null ? p.getSubscription().getId() : null)
                .transactionId(p.getTransactionId())
                .userName(p.getUserName())
                .amount(p.getAmount())
                .method(p.getPaymentMethod())
                .paymentMethod(p.getPaymentMethod())
                .date(DateUtil.formatDate(p.getPaymentDate()))
                .paymentDate(p.getPaymentDate())
                .status(mapStatusToFrontend(p.getPaymentStatus()))
                .paymentStatus(p.getPaymentStatus())
                .build();
    }

    public static String mapStatusToFrontend(PaymentStatus status) {
        if (status == null) return "Pending";
        return switch (status) {
            case COMPLETED -> "Completed";
            case FAILED -> "Failed";
            case PENDING -> "Pending";
        };
    }

    public static PaymentStatus mapStatusFromFrontend(String status) {
        if (status == null) return PaymentStatus.PENDING;
        return switch (status.toUpperCase()) {
            case "COMPLETED" -> PaymentStatus.COMPLETED;
            case "FAILED" -> PaymentStatus.FAILED;
            default -> PaymentStatus.PENDING;
        };
    }
}
