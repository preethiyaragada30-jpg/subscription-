package com.subscriptionmanager.repository;

import com.subscriptionmanager.entity.Subscription;
import com.subscriptionmanager.entity.SubscriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Page<Subscription> findByUserId(Long userId, Pageable pageable);

    @Query("""
            SELECT s FROM Subscription s WHERE
            (:search IS NULL OR LOWER(s.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(s.customerEmail) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(s.subscriptionName) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:status IS NULL OR s.status = :status)
            AND (:userId IS NULL OR s.user.id = :userId)
            """)
    Page<Subscription> search(
            @Param("search") String search,
            @Param("status") SubscriptionStatus status,
            @Param("userId") Long userId,
            Pageable pageable);

    long countByStatus(SubscriptionStatus status);

    List<Subscription> findByStatusAndEndDateBetween(
            SubscriptionStatus status, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Subscription s WHERE s.status = 'ACTIVE'")
    BigDecimal sumActiveSubscriptionAmount();
}
