package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.NotificationDTO;
import com.subscriptionmanager.entity.NotificationType;
import com.subscriptionmanager.service.NotificationService;
import com.subscriptionmanager.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> byUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getByUser(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationDTO>> create(@RequestBody Map<String, Object> body) {
        Long userId = ((Number) body.get("userId")).longValue();
        String title = (String) body.get("title");
        String message = (String) body.get("message");
        NotificationType type = NotificationType.valueOf((String) body.getOrDefault("type", "GENERAL"));
        return ResponseEntity.ok(ApiResponse.success(notificationService.create(userId, title, message, type)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.markRead(id)));
    }

    @PostMapping("/renewal-reminders")
    public ResponseEntity<ApiResponse<Void>> renewalReminders() {
        notificationService.sendRenewalReminders();
        return ResponseEntity.ok(ApiResponse.success("Reminders sent", null));
    }
}
