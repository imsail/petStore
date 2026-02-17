package com.petstore.service;

import com.petstore.dto.OrderCreateDto;
import com.petstore.dto.OrderDto;
import com.petstore.dto.OrderItemCreateDto;
import com.petstore.entity.*;
import com.petstore.exception.InsufficientStockException;
import com.petstore.mapper.OrderMapper;
import com.petstore.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderMapper orderMapper;
    @Mock
    private CustomerService customerService;
    @Mock
    private PetService petService;

    @InjectMocks
    private OrderService orderService;

    private Customer customer;
    private Pet pet;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setId(1L);
        customer.setName("John Doe");

        pet = new Pet();
        pet.setId(1L);
        pet.setName("Buddy");
        pet.setPrice(BigDecimal.valueOf(499.99));
        pet.setStock(3);
        pet.setStatus(PetStatus.AVAILABLE);
    }

    @Test
    void createOrder_decrementsStock() {
        OrderCreateDto dto = new OrderCreateDto(1L, List.of(new OrderItemCreateDto(1L, 2)));
        when(customerService.getEntity(1L)).thenReturn(customer);
        when(petService.getEntity(1L)).thenReturn(pet);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        OrderDto expectedDto = new OrderDto(1L, 1L, "John Doe", BigDecimal.valueOf(999.98),
            OrderStatus.PENDING, LocalDateTime.now(), Collections.emptyList());
        when(orderMapper.toDto(any(Order.class))).thenReturn(expectedDto);

        OrderDto result = orderService.createOrder(dto);

        assertEquals(1, pet.getStock());
        assertEquals(PetStatus.AVAILABLE, pet.getStatus());
        assertNotNull(result);
    }

    @Test
    void createOrder_setsStatusSoldWhenStockZero() {
        pet.setStock(1);
        OrderCreateDto dto = new OrderCreateDto(1L, List.of(new OrderItemCreateDto(1L, 1)));
        when(customerService.getEntity(1L)).thenReturn(customer);
        when(petService.getEntity(1L)).thenReturn(pet);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderMapper.toDto(any(Order.class))).thenReturn(
            new OrderDto(1L, 1L, "John Doe", BigDecimal.valueOf(499.99),
                OrderStatus.PENDING, LocalDateTime.now(), Collections.emptyList()));

        orderService.createOrder(dto);

        assertEquals(0, pet.getStock());
        assertEquals(PetStatus.SOLD, pet.getStatus());
    }

    @Test
    void createOrder_throwsInsufficientStock() {
        pet.setStock(1);
        OrderCreateDto dto = new OrderCreateDto(1L, List.of(new OrderItemCreateDto(1L, 5)));
        when(customerService.getEntity(1L)).thenReturn(customer);
        when(petService.getEntity(1L)).thenReturn(pet);

        assertThrows(InsufficientStockException.class, () -> orderService.createOrder(dto));
    }

    @Test
    void cancelOrder_restoresStock() {
        Order order = new Order();
        order.setId(1L);
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);
        order.setTotal(BigDecimal.valueOf(499.99));
        OrderItem item = new OrderItem();
        item.setPet(pet);
        item.setQuantity(2);
        item.setOrder(order);
        order.getItems().add(item);
        pet.setStock(1);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderMapper.toDto(any(Order.class))).thenReturn(
            new OrderDto(1L, 1L, "John Doe", BigDecimal.valueOf(499.99),
                OrderStatus.CANCELLED, LocalDateTime.now(), Collections.emptyList()));

        orderService.updateStatus(1L, OrderStatus.CANCELLED);

        assertEquals(3, pet.getStock());
    }
}
