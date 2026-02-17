package com.petstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerCreateDto(
    @NotBlank @Size(max = 150) String name,
    @NotBlank @Email @Size(max = 255) String email,
    @Size(max = 20) String phone,
    String address
) {}
