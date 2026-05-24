package com.subscriptionmanager.repository;

import com.subscriptionmanager.entity.Payment;
import com.subscriptionmanager.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findAllByOrderByPaymentDateDesc();

    List<Payment> findByPaymentStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = :status")
    BigDecimal sumAmountByStatus(@Param("status") PaymentStatus status);

    @Query("""
            SELECT COALESCE(SUM(p.amount), 0) FROM Payment p
            WHERE p.paymentStatus = 'COMPLETED'
            AND p.paymentDate >= :start AND p.paymentDate <= :end
            """)
    BigDecimal sumCompletedBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query(value = """
            SELECT TO_CHAR(payment_date, 'YYYY-MM') AS month, COALESCE(SUM(amount), 0) AS total
            FROM payments
            WHERE payment_status = 'COMPLETED'
            GROUP BY TO_CHAR(payment_date, 'YYYY-MM')
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> monthlyRevenueAggregates();
}
