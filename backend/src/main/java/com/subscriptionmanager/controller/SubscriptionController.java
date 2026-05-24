package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.SubscriptionDTO;
import com.subscriptionmanager.entity.SubscriptionStatus;
import com.subscriptionmanager.service.SubscriptionService;
import com.subscriptionmanager.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<ApiResponse<SubscriptionDTO>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubscriptionDTO dto,
            @RequestParam(required = false) Long userId) {
        Long ownerId = userId != null ? userId : 1L;
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.create(dto, ownerId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SubscriptionDTO>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) SubscriptionStatus status,
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort sort = direction.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<SubscriptionDTO> result = subscriptionService.getAll(search, status, userId, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubscriptionDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubscriptionDTO>> update(@PathVariable Long id, @RequestBody SubscriptionDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        subscriptionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
