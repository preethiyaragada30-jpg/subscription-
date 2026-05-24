package com.subscriptionmanager.controller;

import com.subscriptionmanager.dto.UserResponse;
import com.subscriptionmanager.service.UserService;
import com.subscriptionmanager.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final UserService userService;

    /** Frontend-compatible registration */
    @PostMapping("/register")
    @Operation(summary = "Legacy register (frontend)")
    public ResponseEntity<UserResponse> registerLegacy(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        if (email == null) {
            email = (String) body.get("username");
        }

        String firstName = (String) body.get("firstName");
        if (firstName == null) {
            firstName = (String) body.get("first_name");
        }

        String lastName = (String) body.get("lastName");
        if (lastName == null) {
            lastName = (String) body.get("last_name");
        }

        String fullName = (String) body.get("fullName");
        if (fullName == null) {
            fullName = (String) body.get("full_name");
        }

        if ((firstName == null || firstName.isBlank()) && fullName != null && !fullName.isBlank()) {
            String[] parts = fullName.split(" ", 2);
            firstName = parts[0];
            if (parts.length > 1) {
                lastName = parts[1];
            }
        }

        String phone = (String) body.get("phone");
        if (phone == null) {
            phone = (String) body.get("phoneNumber");
        }
        if (phone == null) {
            phone = (String) body.get("phone_number");
        }

        Integer age = null;
        Object ageObj = body.get("age");
        if (ageObj instanceof Number) {
            age = ((Number) ageObj).intValue();
        } else if (ageObj instanceof String) {
            try {
                age = Integer.parseInt((String) ageObj);
            } catch (NumberFormatException ignored) {}
        }

        UserResponse req = UserResponse.builder()
                .firstName(firstName)
                .lastName(lastName)
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .phoneNumber(phone)
                .age(age)
                .build();

        String password = (String) body.get("password");
        return ResponseEntity.ok(userService.registerLegacy(req, password));
    }

    /** Frontend-compatible login — returns user JSON directly */
    @PostMapping("/login")
    @Operation(summary = "Legacy login (frontend)")
    public ResponseEntity<UserResponse> loginLegacy(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            email = body.get("username");
        }
        return ResponseEntity.ok(userService.loginLegacy(email, body.get("password")));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody UserResponse request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }
}
