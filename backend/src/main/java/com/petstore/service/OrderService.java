package com.petstore.service;

import com.petstore.dto.OrderCreateDto;
import com.petstore.dto.OrderDto;
import com.petstore.dto.OrderItemCreateDto;
import com.petstore.entity.*;
import com.petstore.exception.InsufficientStockException;
import com.petstore.exception.ResourceNotFoundException;
import com.petstore.mapper.OrderMapper;
import com.petstore.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final CustomerService customerService;
    private final PetService petService;

    public OrderService(OrderRepository repository, OrderMapper mapper,
                        CustomerService customerService, PetService petService) {
        this.repository = repository;
        this.mapper = mapper;
        this.customerService = customerService;
        this.petService = petService;
    }

    public List<OrderDto> findAll() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }

    public OrderDto findById(Long id) {
        return mapper.toDto(getEntity(id));
    }

    public List<OrderDto> findByCustomerId(Long customerId) {
        return repository.findByCustomerIdOrderByOrderDateDesc(customerId).stream()
            .map(mapper::toDto).toList();
    }

    @Transactional
    public OrderDto createOrder(OrderCreateDto dto) {
        Customer customer = customerService.getEntity(dto.customerId());

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemCreateDto itemDto : dto.items()) {
            Pet pet = petService.getEntity(itemDto.petId());

            if (pet.getStock() < itemDto.quantity()) {
                throw new InsufficientStockException(
                    "Insufficient stock for pet '" + pet.getName() + "'. Available: " + pet.getStock() + ", Requested: " + itemDto.quantity());
            }

            pet.setStock(pet.getStock() - itemDto.quantity());
            if (pet.getStock() == 0) {
                pet.setStatus(PetStatus.SOLD);
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setPet(pet);
            item.setQuantity(itemDto.quantity());
            item.setPrice(pet.getPrice());
            order.getItems().add(item);

            total = total.add(pet.getPrice().multiply(BigDecimal.valueOf(itemDto.quantity())));
        }

        order.setTotal(total);
        return mapper.toDto(repository.save(order));
    }

    @Transactional
    public OrderDto updateStatus(Long id, OrderStatus status) {
        Order order = getEntity(id);

        if (status == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                Pet pet = item.getPet();
                pet.setStock(pet.getStock() + item.getQuantity());
                if (pet.getStatus() == PetStatus.SOLD) {
                    pet.setStatus(PetStatus.AVAILABLE);
                }
            }
        }

        order.setStatus(status);
        return mapper.toDto(repository.save(order));
    }

    private Order getEntity(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}
