package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getById(Long id);
    List<UserResponse> getAll();
    UserResponse update(Long id, UserResponse request);
    void delete(Long id);
    UserResponse registerLegacy(UserResponse request, String password);
    UserResponse loginLegacy(String email, String password);
}
