package com.petstore.dto;

import com.petstore.entity.PetStatus;
import java.math.BigDecimal;

public record PetDto(
    Long id,
    String name,
    String type,
    String breed,
    Integer age,
    BigDecimal price,
    PetStatus status,
    String imageUrl,
    String description,
    Integer stock,
    CategoryDto category
) {}
