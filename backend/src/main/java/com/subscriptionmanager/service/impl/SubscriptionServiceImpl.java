package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.SubscriptionDTO;
import com.subscriptionmanager.entity.Subscription;
import com.subscriptionmanager.entity.SubscriptionStatus;
import com.subscriptionmanager.entity.User;
import com.subscriptionmanager.exception.ResourceNotFoundException;
import com.subscriptionmanager.repository.SubscriptionRepository;
import com.subscriptionmanager.repository.UserRepository;
import com.subscriptionmanager.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public SubscriptionDTO create(SubscriptionDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Deactivate any existing active subscriptions for this user
        if (user.getSubscriptions() != null) {
            for (Subscription existingSub : user.getSubscriptions()) {
                if (existingSub.getStatus() == SubscriptionStatus.ACTIVE) {
                    existingSub.setStatus(SubscriptionStatus.CANCELLED);
                    subscriptionRepository.save(existingSub);
                }
            }
        }

        Subscription sub = mapToEntity(new Subscription(), dto);
        sub.setUser(user);
        Subscription saved = subscriptionRepository.saveAndFlush(sub);
        
        // Ensure consistency in the user entity's list
        if (user.getSubscriptions() != null) {
            user.getSubscriptions().add(saved);
        }
        
        return SubscriptionDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public SubscriptionDTO update(Long id, SubscriptionDTO dto) {
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found: " + id));
        mapToEntity(sub, dto);
        return SubscriptionDTO.fromEntity(subscriptionRepository.save(sub));
    }

    @Override
    public SubscriptionDTO getById(Long id) {
        return SubscriptionDTO.fromEntity(find(id));
    }

    @Override
    public Page<SubscriptionDTO> getAll(String search, SubscriptionStatus status, Long userId, Pageable pageable) {
        return subscriptionRepository.search(
                (search == null || search.isBlank()) ? null : search,
                status,
                userId,
                pageable
        ).map(SubscriptionDTO::fromEntity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subscription not found: " + id);
        }
        subscriptionRepository.deleteById(id);
    }

    private Subscription find(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found: " + id));
    }

    private Subscription mapToEntity(Subscription sub, SubscriptionDTO dto) {
        if (dto.getSubscriptionName() != null) sub.setSubscriptionName(dto.getSubscriptionName());
        if (dto.getCustomerName() != null) sub.setCustomerName(dto.getCustomerName());
        if (dto.getCustomerEmail() != null) sub.setCustomerEmail(dto.getCustomerEmail());
        if (dto.getAmount() != null) sub.setAmount(dto.getAmount());
        if (dto.getBillingCycle() != null) sub.setBillingCycle(dto.getBillingCycle());
        if (dto.getStartDate() != null) sub.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) sub.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) sub.setStatus(dto.getStatus());
        if (dto.getPaymentMethod() != null) sub.setPaymentMethod(dto.getPaymentMethod());
        if (dto.getAutoRenew() != null) sub.setAutoRenew(dto.getAutoRenew());
        if (dto.getCategory() != null) sub.setCategory(dto.getCategory());
        if (dto.getNotes() != null) sub.setNotes(dto.getNotes());
        return sub;
    }
}
