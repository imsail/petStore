package com.petstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryDto(
    Long id,
    @NotBlank @Size(max = 100) String name,
    String description
) {}
