package com.petstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemCreateDto(
    @NotNull Long petId,
    @NotNull @Min(1) Integer quantity
) {}
