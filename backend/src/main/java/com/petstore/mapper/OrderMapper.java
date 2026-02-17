package com.petstore.mapper;

import com.petstore.dto.OrderDto;
import com.petstore.dto.OrderItemDto;
import com.petstore.entity.Order;
import com.petstore.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderDto toDto(Order entity) {
        List<OrderItemDto> items = entity.getItems().stream()
            .map(this::toItemDto)
            .toList();
        return new OrderDto(
            entity.getId(),
            entity.getCustomer().getId(),
            entity.getCustomer().getName(),
            entity.getTotal(),
            entity.getStatus(),
            entity.getOrderDate(),
            items
        );
    }

    public OrderItemDto toItemDto(OrderItem item) {
        return new OrderItemDto(
            item.getId(),
            item.getPet().getId(),
            item.getPet().getName(),
            item.getQuantity(),
            item.getPrice()
        );
    }
}
