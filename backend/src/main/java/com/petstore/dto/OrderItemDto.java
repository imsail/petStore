package com.petstore.dto;

import java.math.BigDecimal;

public record OrderItemDto(
    Long id,
    Long petId,
    String petName,
    Integer quantity,
    BigDecimal price
) {}
