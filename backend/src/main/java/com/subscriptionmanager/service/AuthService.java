package com.subscriptionmanager.service;

import com.subscriptionmanager.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void changePassword(String email, ChangePasswordRequest request);
}
