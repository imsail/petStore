package com.petstore.service;

import com.petstore.dto.CategoryDto;
import com.petstore.entity.Category;
import com.petstore.exception.ResourceNotFoundException;
import com.petstore.mapper.CategoryMapper;
import com.petstore.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    public CategoryService(CategoryRepository repository, CategoryMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<CategoryDto> findAll() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }

    public CategoryDto findById(Long id) {
        return mapper.toDto(getEntity(id));
    }

    public CategoryDto create(CategoryDto dto) {
        Category entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    public CategoryDto update(Long id, CategoryDto dto) {
        Category entity = getEntity(id);
        mapper.updateEntity(entity, dto);
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public Category getEntity(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}
