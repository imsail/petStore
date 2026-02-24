package com.petstore.controller;

import com.petstore.dto.CustomerCreateDto;
import com.petstore.dto.CustomerDto;
import com.petstore.dto.OrderDto;
import com.petstore.security.PetStoreUserPrincipal;
import com.petstore.service.CustomerService;
import com.petstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final CustomerService customerService;
    private final OrderService orderService;

    public MeController(CustomerService customerService, OrderService orderService) {
        this.customerService = customerService;
        this.orderService = orderService;
    }

    @GetMapping("/profile")
    public ResponseEntity<CustomerDto> getProfile(@AuthenticationPrincipal PetStoreUserPrincipal principal) {
        if (principal.getCustomerId() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customerService.findById(principal.getCustomerId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<CustomerDto> updateProfile(@AuthenticationPrincipal PetStoreUserPrincipal principal,
                                                     @Valid @RequestBody CustomerCreateDto dto) {
        if (principal.getCustomerId() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customerService.update(principal.getCustomerId(), dto));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getOrders(@AuthenticationPrincipal PetStoreUserPrincipal principal) {
        if (principal.getCustomerId() == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(orderService.findByCustomerId(principal.getCustomerId()));
    }
}
