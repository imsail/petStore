package com.petstore.dto;

import java.util.List;

public record InventoryDto(
    long totalPets,
    long availablePets,
    long pendingPets,
    long soldPets,
    long lowStockCount,
    List<PetDto> lowStockPets
) {}
