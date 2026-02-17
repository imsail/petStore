package com.petstore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderCreateDto(
    @NotNull Long customerId,
    @NotEmpty @Valid List<OrderItemCreateDto> items
) {}
