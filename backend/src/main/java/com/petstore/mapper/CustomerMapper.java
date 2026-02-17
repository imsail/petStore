package com.petstore.mapper;

import com.petstore.dto.CustomerCreateDto;
import com.petstore.dto.CustomerDto;
import com.petstore.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerDto toDto(Customer entity) {
        return new CustomerDto(
            entity.getId(), entity.getName(), entity.getEmail(),
            entity.getPhone(), entity.getAddress()
        );
    }

    public Customer toEntity(CustomerCreateDto dto) {
        Customer entity = new Customer();
        entity.setName(dto.name());
        entity.setEmail(dto.email());
        entity.setPhone(dto.phone());
        entity.setAddress(dto.address());
        return entity;
    }

    public void updateEntity(Customer entity, CustomerCreateDto dto) {
        entity.setName(dto.name());
        entity.setEmail(dto.email());
        entity.setPhone(dto.phone());
        entity.setAddress(dto.address());
    }
}
