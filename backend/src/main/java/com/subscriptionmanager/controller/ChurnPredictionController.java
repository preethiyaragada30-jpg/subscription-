package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.ChurnPredictRequest;
import com.subscriptionmanager.dto.ChurnPredictionDTO;
import com.subscriptionmanager.service.ChurnPredictionService;
import com.subscriptionmanager.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/churn")
@RequiredArgsConstructor
@Tag(name = "Churn Prediction")
public class ChurnPredictionController {

    private final ChurnPredictionService churnPredictionService;

    @PostMapping("/predict")
    public ResponseEntity<ApiResponse<ChurnPredictionDTO>> predict(@Valid @RequestBody ChurnPredictRequest request) {
        return ResponseEntity.ok(ApiResponse.success(churnPredictionService.predict(request)));
    }

    @GetMapping("/high-risk")
    public ResponseEntity<ApiResponse<List<ChurnPredictionDTO>>> highRisk() {
        return ResponseEntity.ok(ApiResponse.success(churnPredictionService.getHighRisk()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChurnPredictionDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(churnPredictionService.getAll()));
    }

    @PostMapping("/recalculate")
    public ResponseEntity<ApiResponse<Void>> recalculate() {
        churnPredictionService.recalculateAll();
        return ResponseEntity.ok(ApiResponse.success("Recalculated", null));
    }
}
