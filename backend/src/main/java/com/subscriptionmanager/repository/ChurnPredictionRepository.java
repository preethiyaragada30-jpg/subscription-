package com.subscriptionmanager.repository;

import com.subscriptionmanager.entity.ChurnPrediction;
import com.subscriptionmanager.entity.ChurnRisk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChurnPredictionRepository extends JpaRepository<ChurnPrediction, Long> {
    Optional<ChurnPrediction> findByCustomerId(Long customerId);
    List<ChurnPrediction> findByChurnRisk(ChurnRisk churnRisk);
    List<ChurnPrediction> findByChurnRiskOrderByChurnProbabilityDesc(ChurnRisk churnRisk);
    long countByChurnRisk(ChurnRisk churnRisk);
}
