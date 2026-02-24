package com.petstore.dto;

public record AuthResponse(
    Long id,
    String email,
    String role,
    Long customerId,
    String customerName
) {}
