package com.petstore.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record PetCreateDto(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Size(max = 50) String type,
    @Size(max = 100) String breed,
    @Min(0) Integer age,
    @NotNull @DecimalMin("0.01") BigDecimal price,
    @Size(max = 500) String imageUrl,
    String description,
    @NotNull @Min(0) Integer stock,
    Long categoryId
) {}
