package com.petstore.dto;

public record CustomerDto(
    Long id,
    String name,
    String email,
    String phone,
    String address
) {}
