package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.SettingsDTO;

public interface SettingsService {
    SettingsDTO getByUserId(Long userId);
    SettingsDTO update(Long userId, SettingsDTO dto);
}
