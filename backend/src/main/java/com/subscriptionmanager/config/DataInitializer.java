package com.subscriptionmanager.config;

import com.subscriptionmanager.entity.*;
import com.subscriptionmanager.repository.*;
import com.subscriptionmanager.service.ChurnPredictionService;
import com.subscriptionmanager.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;
    private final ChurnPredictionService churnPredictionService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping initialization");
            return;
        }
        log.info("Seeding database with sample data...");

        User admin = saveUser("Deepika", "Admin", Constants.DEFAULT_ADMIN_EMAIL, "7569138706", 25, Role.ADMIN, Constants.DEFAULT_ADMIN_PASSWORD);
        User u1 = saveUser("Rahul", "Sharma", "rahul@example.com", "9876500001", 28, Role.USER, "password123");
        User u2 = saveUser("Neha", "Sharma", "neha@example.com", "9876500002", 26, Role.USER, "password123");
        User u3 = saveUser("Kiran", "Verma", "kiran@example.com", "9876500003", 32, Role.USER, "password123");
        User u4 = saveUser("Amit", "Patel", "amit@example.com", "9876500004", 30, Role.USER, "password123");

        createSubscription(admin, "Enterprise", "Acme Co", "billing@acme.co", new BigDecimal("99.99"));
        createSubscription(u1, "Professional", "Beta LLC", "ops@beta.com", new BigDecimal("29.99"));
        createSubscription(u3, "Basic", "DesignCo", "hello@designco.io", new BigDecimal("9.99"));

        seedPayment("TXN-001", "Rahul Sharma", new BigDecimal("29.99"), "Credit/Debit Card", LocalDate.of(2025, 1, 1), PaymentStatus.COMPLETED);
        seedPayment("TXN-002", "Neha Sharma", new BigDecimal("9.99"), "PayPal", LocalDate.of(2025, 1, 10), PaymentStatus.PENDING);
        seedPayment("TXN-003", "Kiran Verma", new BigDecimal("19.99"), "Credit/Debit Card", LocalDate.of(2025, 1, 12), PaymentStatus.FAILED);
        seedPayment("TXN-004", "Amit Patel", new BigDecimal("49.99"), "UPI", LocalDate.of(2025, 1, 15), PaymentStatus.COMPLETED);

        notificationRepository.save(Notification.builder()
                .user(u3)
                .title("High Churn Risk")
                .message("Kiran Verma is at high churn risk. Take action now.")
                .notificationType(NotificationType.CHURN_RISK)
                .isRead(false)
                .build());

        churnPredictionService.recalculateAll();
        log.info("Seed data loaded. Admin login: {} / {}", Constants.DEFAULT_ADMIN_EMAIL, Constants.DEFAULT_ADMIN_PASSWORD);
    }

    private User saveUser(String first, String last, String email, String phone, int age, Role role, String rawPassword) {
        User user = User.builder()
                .firstName(first)
                .lastName(last)
                .fullName(first + " " + last)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .phoneNumber(phone)
                .age(age)
                .role(role)
                .build();
        user = userRepository.save(user);
        settingsRepository.save(UserSettings.builder().user(user).build());
        return user;
    }

    private void createSubscription(User user, String plan, String customer, String email, BigDecimal amount) {
        LocalDate start = LocalDate.now().minusMonths(2);
        subscriptionRepository.save(Subscription.builder()
                .user(user)
                .subscriptionName(plan)
                .customerName(customer)
                .customerEmail(email)
                .amount(amount)
                .billingCycle(BillingCycle.MONTHLY)
                .startDate(start)
                .endDate(start.plusMonths(1))
                .status(SubscriptionStatus.ACTIVE)
                .paymentMethod("Credit Card")
                .autoRenew(true)
                .category("SaaS")
                .build());
    }

    private void seedPayment(String txnId, String userName, BigDecimal amount, String method, LocalDate date, PaymentStatus status) {
        paymentRepository.save(Payment.builder()
                .transactionId(txnId)
                .userName(userName)
                .amount(amount)
                .paymentMethod(method)
                .paymentDate(date)
                .paymentStatus(status)
                .build());
    }
}
