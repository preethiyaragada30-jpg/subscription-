package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.NotificationDTO;
import com.subscriptionmanager.entity.Notification;
import com.subscriptionmanager.entity.NotificationType;
import com.subscriptionmanager.entity.User;
import com.subscriptionmanager.exception.ResourceNotFoundException;
import com.subscriptionmanager.repository.NotificationRepository;
import com.subscriptionmanager.repository.SubscriptionRepository;
import com.subscriptionmanager.repository.UserRepository;
import com.subscriptionmanager.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                     UserRepository userRepository,
                                     SubscriptionRepository subscriptionRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Value("${app.mail.from:noreply@subscriptionmanager.com}")
    private String mailFrom;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Override
    public List<NotificationDTO> getByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationDTO::fromEntity).toList();
    }

    @Override
    @Transactional
    public NotificationDTO create(Long userId, String title, String message, NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .notificationType(type)
                .isRead(false)
                .build();
        return NotificationDTO.fromEntity(notificationRepository.save(n));
    }

    @Override
    @Transactional
    public NotificationDTO markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        n.setIsRead(true);
        return NotificationDTO.fromEntity(notificationRepository.save(n));
    }

    @Override
    public void sendEmailNotification(Long userId, String subject, String body) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (mailEnabled && mailSender != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(user.getEmail());
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}", user.getEmail());
        } else {
            log.info("Mail disabled. Would send to {}: {} - {}", user.getEmail(), subject, body);
        }
    }

    @Override
    @Transactional
    public void sendRenewalReminders() {
        LocalDate today = LocalDate.now();
        subscriptionRepository.findByStatusAndEndDateBetween(
                com.subscriptionmanager.entity.SubscriptionStatus.ACTIVE,
                today,
                today.plusDays(7)
        ).forEach(sub -> {
            Long userId = sub.getUser().getId();
            create(userId, "Renewal Reminder",
                    "Subscription " + sub.getSubscriptionName() + " renews on " + sub.getEndDate(),
                    NotificationType.RENEWAL_REMINDER);
        });
    }
}
