package com.petstore.service;

import com.petstore.dto.CustomerCreateDto;
import com.petstore.dto.CustomerDto;
import com.petstore.entity.Customer;
import com.petstore.exception.ResourceNotFoundException;
import com.petstore.mapper.CustomerMapper;
import com.petstore.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerMapper mapper;

    public CustomerService(CustomerRepository repository, CustomerMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<CustomerDto> findAll() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }

    public CustomerDto findById(Long id) {
        return mapper.toDto(getEntity(id));
    }

    public CustomerDto create(CustomerCreateDto dto) {
        Customer entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    public CustomerDto update(Long id, CustomerCreateDto dto) {
        Customer entity = getEntity(id);
        mapper.updateEntity(entity, dto);
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public Customer getEntity(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }
}
