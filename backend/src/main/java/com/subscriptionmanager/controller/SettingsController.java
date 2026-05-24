package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.SettingsDTO;
import com.subscriptionmanager.service.SettingsService;
import com.subscriptionmanager.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<SettingsDTO>> get(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getByUserId(userId)));
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<SettingsDTO>> update(@PathVariable Long userId, @RequestBody SettingsDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(settingsService.update(userId, dto)));
    }
}
