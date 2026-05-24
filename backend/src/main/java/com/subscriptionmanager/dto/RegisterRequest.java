package com.subscriptionmanager.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    private String firstName;
    private String lastName;

    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    private String phoneNumber;
    private String phone;

    @Min(1) @Max(120)
    private Integer age;
}
