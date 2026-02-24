package com.petstore.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.dto.OrderCreateDto;
import com.petstore.dto.OrderDto;
import com.petstore.dto.OrderItemCreateDto;
import com.petstore.entity.OrderStatus;
import com.petstore.exception.GlobalExceptionHandler;
import com.petstore.exception.InsufficientStockException;
import com.petstore.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private OrderService orderService;

    @Test
    void createOrder_returnsCreated() throws Exception {
        OrderCreateDto createDto = new OrderCreateDto(1L, List.of(new OrderItemCreateDto(1L, 1)));
        OrderDto orderDto = new OrderDto(1L, 1L, "John", BigDecimal.valueOf(499.99),
            OrderStatus.PENDING, LocalDateTime.now(), Collections.emptyList());
        when(orderService.createOrder(any(OrderCreateDto.class))).thenReturn(orderDto);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void createOrder_returns409OnInsufficientStock() throws Exception {
        OrderCreateDto createDto = new OrderCreateDto(1L, List.of(new OrderItemCreateDto(1L, 100)));
        when(orderService.createOrder(any(OrderCreateDto.class)))
            .thenThrow(new InsufficientStockException("Not enough stock"));

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
            .andExpect(status().isConflict());
    }

    @Test
    void findAll_returnsOrders() throws Exception {
        OrderDto orderDto = new OrderDto(1L, 1L, "John", BigDecimal.valueOf(499.99),
            OrderStatus.PENDING, LocalDateTime.now(), Collections.emptyList());
        when(orderService.findAll()).thenReturn(List.of(orderDto));

        mockMvc.perform(get("/api/orders"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].customerName").value("John"));
    }
}
