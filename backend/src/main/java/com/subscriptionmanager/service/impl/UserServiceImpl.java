package com.subscriptionmanager.service.impl;

import com.subscriptionmanager.dto.UserResponse;
import com.subscriptionmanager.entity.Role;
import com.subscriptionmanager.entity.User;
import com.subscriptionmanager.entity.UserSettings;
import com.subscriptionmanager.exception.BadRequestException;
import com.subscriptionmanager.exception.ResourceNotFoundException;
import com.subscriptionmanager.exception.UnauthorizedException;
import com.subscriptionmanager.repository.UserRepository;
import com.subscriptionmanager.repository.UserSettingsRepository;
import com.subscriptionmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return UserResponse.fromEntity(findUser(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(UserResponse::fromEntity).toList();
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UserResponse request) {
        User user = findUser(id);
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getFirstName() != null || request.getLastName() != null) {
            user.setFullName((user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "")).trim());
        }
        if (request.getPhone() != null) user.setPhoneNumber(request.getPhone());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email address already registered");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    /** Frontend: POST /api/users/register */
    @Override
    @Transactional
    public UserResponse registerLegacy(UserResponse request, String password) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address already registered");
        }
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .fullName(buildFullName(request.getFirstName(), request.getLastName()))
                .email(request.getEmail())
                .password(passwordEncoder.encode(password))
                .phoneNumber(request.getPhone())
                .age(request.getAge())
                .role(Role.USER)
                .build();
        user = userRepository.save(user);
        settingsRepository.save(UserSettings.builder().user(user).build());
        return UserResponse.fromEntity(user);
    }

    /** Frontend: POST /api/users/login - returns user object directly */
    @Override
    @Transactional(readOnly = true)
    public UserResponse loginLegacy(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return UserResponse.fromEntity(user);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    private String buildFullName(String first, String last) {
        return ((first != null ? first : "") + " " + (last != null ? last : "")).trim();
    }
}
