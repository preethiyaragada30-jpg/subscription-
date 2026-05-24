package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.config.JwtService;
import com.subscriptionmanager.dto.*;
import com.subscriptionmanager.entity.Role;
import com.subscriptionmanager.entity.User;
import com.subscriptionmanager.entity.UserSettings;
import com.subscriptionmanager.exception.BadRequestException;
import com.subscriptionmanager.exception.ResourceNotFoundException;
import com.subscriptionmanager.repository.UserRepository;
import com.subscriptionmanager.repository.UserSettingsRepository;
import com.subscriptionmanager.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        normalizeRegisterRequest(request);
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(resolvePhone(request))
                .age(request.getAge())
                .role(Role.USER)
                .build();

        user = userRepository.save(user);
        createDefaultSettings(user);

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserResponse.fromEntity(user))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserResponse.fromEntity(user))
                .build();
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        user.setResetToken(UUID.randomUUID().toString());
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        log.info("Password reset token generated for {} (token logged in dev only): {}",
                user.getEmail(), user.getResetToken());
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private void createDefaultSettings(User user) {
        UserSettings settings = UserSettings.builder()
                .user(user)
                .darkMode(false)
                .emailNotifications(true)
                .language("en")
                .timezone("UTC")
                .build();
        settingsRepository.save(settings);
    }

    private void normalizeRegisterRequest(RegisterRequest request) {
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            String fn = request.getFirstName() != null ? request.getFirstName() : "";
            String ln = request.getLastName() != null ? request.getLastName() : "";
            request.setFullName((fn + " " + ln).trim());
        }
        if (request.getFirstName() == null && request.getFullName() != null) {
            String[] parts = request.getFullName().split(" ", 2);
            request.setFirstName(parts[0]);
            if (parts.length > 1) request.setLastName(parts[1]);
        }
    }

    private String resolvePhone(RegisterRequest request) {
        if (request.getPhoneNumber() != null) return request.getPhoneNumber();
        return request.getPhone();
    }
}
