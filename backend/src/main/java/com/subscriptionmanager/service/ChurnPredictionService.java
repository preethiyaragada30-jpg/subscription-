package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.ChurnPredictRequest;
import com.subscriptionmanager.dto.ChurnPredictionDTO;

import java.util.List;

public interface ChurnPredictionService {
    ChurnPredictionDTO predict(ChurnPredictRequest request);
    List<ChurnPredictionDTO> getHighRisk();
    List<ChurnPredictionDTO> getAll();
    void recalculateAll();
}
