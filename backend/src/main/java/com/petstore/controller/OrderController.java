package com.petstore.controller;

import com.petstore.dto.OrderCreateDto;
import com.petstore.dto.OrderDto;
import com.petstore.entity.OrderStatus;
import com.petstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderDto> findAll() {
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public OrderDto findById(@PathVariable Long id) {
        return orderService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto create(@Valid @RequestBody OrderCreateDto dto) {
        return orderService.createOrder(dto);
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        return orderService.updateStatus(id, status);
    }
}
