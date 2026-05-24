package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.NotificationDTO;
import com.subscriptionmanager.entity.NotificationType;

import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getByUser(Long userId);
    NotificationDTO create(Long userId, String title, String message, NotificationType type);
    NotificationDTO markRead(Long id);
    void sendEmailNotification(Long userId, String subject, String body);
    void sendRenewalReminders();
}
