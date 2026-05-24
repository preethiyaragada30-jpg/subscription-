package com.subscriptionmanager.dto;

import com.subscriptionmanager.entity.UserSettings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsDTO {
    private Long id;
    private Long userId;
    private Boolean darkMode;
    private Boolean emailNotifications;
    private String language;
    private String timezone;

    public static SettingsDTO fromEntity(UserSettings s) {
        return SettingsDTO.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .darkMode(s.getDarkMode())
                .emailNotifications(s.getEmailNotifications())
                .language(s.getLanguage())
                .timezone(s.getTimezone())
                .build();
    }
}
