package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.FrontendPaymentRequest;
import com.subscriptionmanager.dto.PaymentDTO;
import com.subscriptionmanager.entity.Payment;
import com.subscriptionmanager.entity.PaymentStatus;
import com.subscriptionmanager.exception.ResourceNotFoundException;
import com.subscriptionmanager.repository.PaymentRepository;
import com.subscriptionmanager.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private static final AtomicInteger TXN_SEQ = new AtomicInteger(100);

    @Override
    public List<PaymentDTO> getAll() {
        return paymentRepository.findAllByOrderByPaymentDateDesc().stream()
                .map(PaymentDTO::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public PaymentDTO create(PaymentDTO dto) {
        Payment payment = Payment.builder()
                .amount(dto.getAmount())
                .paymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDate.now())
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : dto.getMethod())
                .paymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() :
                        PaymentDTO.mapStatusFromFrontend(dto.getStatus()))
                .transactionId(dto.getTransactionId() != null ? dto.getTransactionId() : nextTxnId())
                .userName(dto.getUserName())
                .build();
        return PaymentDTO.fromEntity(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public PaymentDTO createFromFrontend(FrontendPaymentRequest request) {
        PaymentDTO dto = PaymentDTO.builder()
                .userName(request.getUserName())
                .amount(request.getAmount())
                .method(request.getMethod())
                .paymentMethod(request.getMethod())
                .paymentDate(request.getDate() != null ? LocalDate.parse(request.getDate()) : LocalDate.now())
                .status(request.getStatus() != null ? request.getStatus() : "Completed")
                .build();
        return create(dto);
    }

    @Override
    @Transactional
    public PaymentDTO updateStatus(String transactionId, String status) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + transactionId));
        payment.setPaymentStatus(PaymentDTO.mapStatusFromFrontend(status));
        return PaymentDTO.fromEntity(paymentRepository.save(payment));
    }

    @Override
    public Map<String, Object> getRevenueAnalytics() {
        BigDecimal total = paymentRepository.sumAmountByStatus(PaymentStatus.COMPLETED);
        LocalDate now = LocalDate.now();
        BigDecimal monthly = paymentRepository.sumCompletedBetween(
                now.withDayOfMonth(1), now.withDayOfMonth(now.lengthOfMonth()));

        Map<String, Object> map = new HashMap<>();
        map.put("totalRevenue", total);
        map.put("monthlyRevenue", monthly);
        map.put("failedCount", paymentRepository.findByPaymentStatus(PaymentStatus.FAILED).size());
        map.put("pendingCount", paymentRepository.findByPaymentStatus(PaymentStatus.PENDING).size());
        return map;
    }

    @Override
    public List<PaymentDTO> getFailedPayments() {
        return paymentRepository.findByPaymentStatus(PaymentStatus.FAILED).stream()
                .map(PaymentDTO::fromEntity)
                .toList();
    }

    private String nextTxnId() {
        return "TXN-" + String.format("%03d", TXN_SEQ.incrementAndGet());
    }
}
