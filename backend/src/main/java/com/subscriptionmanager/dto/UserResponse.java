package com.subscriptionmanager.dto;

import com.subscriptionmanager.entity.Role;
import com.subscriptionmanager.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String phoneNumber;
    private Integer age;
    private Role role;
    private String activePlan;
    private Long activeSubscriptionId;
    private String password;

    public static UserResponse fromEntity(User user) {
        String activePlan = null;
        Long activeSubscriptionId = null;
        if (user.getSubscriptions() != null) {
            com.subscriptionmanager.entity.Subscription activeSub = user.getSubscriptions().stream()
                    .filter(s -> s.getStatus() == com.subscriptionmanager.entity.SubscriptionStatus.ACTIVE)
                    .findFirst()
                    .orElse(null);
            if (activeSub != null) {
                activePlan = activeSub.getSubscriptionName();
                activeSubscriptionId = activeSub.getId();
            }
        }

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .phoneNumber(user.getPhoneNumber())
                .age(user.getAge())
                .role(user.getRole())
                .activePlan(activePlan)
                .activeSubscriptionId(activeSubscriptionId)
                .build();
    }
}
