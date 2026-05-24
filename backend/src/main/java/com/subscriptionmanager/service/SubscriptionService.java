package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.SubscriptionDTO;
import com.subscriptionmanager.entity.SubscriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubscriptionService {
    SubscriptionDTO create(SubscriptionDTO dto, Long userId);
    SubscriptionDTO update(Long id, SubscriptionDTO dto);
    SubscriptionDTO getById(Long id);
    Page<SubscriptionDTO> getAll(String search, SubscriptionStatus status, Long userId, Pageable pageable);
    void delete(Long id);
}
