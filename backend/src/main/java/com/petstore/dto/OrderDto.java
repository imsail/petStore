package com.petstore.dto;

import com.petstore.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
    Long id,
    Long customerId,
    String customerName,
    BigDecimal total,
    OrderStatus status,
    LocalDateTime orderDate,
    List<OrderItemDto> items
) {}
