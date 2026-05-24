package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.SettingsDTO;
import com.subscriptionmanager.entity.User;
import com.subscriptionmanager.entity.UserSettings;
import com.subscriptionmanager.exception.ResourceNotFoundException;
import com.subscriptionmanager.repository.UserRepository;
import com.subscriptionmanager.repository.UserSettingsRepository;
import com.subscriptionmanager.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private final UserSettingsRepository settingsRepository;
    private final UserRepository userRepository;

    @Override
    public SettingsDTO getByUserId(Long userId) {
        return SettingsDTO.fromEntity(findOrCreate(userId));
    }

    @Override
    @Transactional
    public SettingsDTO update(Long userId, SettingsDTO dto) {
        UserSettings settings = findOrCreate(userId);
        if (dto.getDarkMode() != null) settings.setDarkMode(dto.getDarkMode());
        if (dto.getEmailNotifications() != null) settings.setEmailNotifications(dto.getEmailNotifications());
        if (dto.getLanguage() != null) settings.setLanguage(dto.getLanguage());
        if (dto.getTimezone() != null) settings.setTimezone(dto.getTimezone());
        return SettingsDTO.fromEntity(settingsRepository.save(settings));
    }

    private UserSettings findOrCreate(Long userId) {
        return settingsRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
            return settingsRepository.save(UserSettings.builder().user(user).build());
        });
    }
}
