package com.petstore.service;

import com.petstore.dto.PetCreateDto;
import com.petstore.dto.PetDto;
import com.petstore.entity.Category;
import com.petstore.entity.Pet;
import com.petstore.entity.PetStatus;
import com.petstore.exception.ResourceNotFoundException;
import com.petstore.mapper.PetMapper;
import com.petstore.repository.PetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PetService {

    private final PetRepository repository;
    private final PetMapper mapper;
    private final CategoryService categoryService;

    public PetService(PetRepository repository, PetMapper mapper, CategoryService categoryService) {
        this.repository = repository;
        this.mapper = mapper;
        this.categoryService = categoryService;
    }

    public Page<PetDto> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDto);
    }

    public PetDto findById(Long id) {
        return mapper.toDto(getEntity(id));
    }

    public Page<PetDto> findByCategory(Long categoryId, Pageable pageable) {
        return repository.findByCategoryId(categoryId, pageable).map(mapper::toDto);
    }

    public Page<PetDto> findByStatus(PetStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable).map(mapper::toDto);
    }

    public Page<PetDto> search(String query, Pageable pageable) {
        return repository.search(query, pageable).map(mapper::toDto);
    }

    public PetDto create(PetCreateDto dto) {
        Category category = dto.categoryId() != null ? categoryService.getEntity(dto.categoryId()) : null;
        Pet entity = mapper.toEntity(dto, category);
        return mapper.toDto(repository.save(entity));
    }

    public PetDto update(Long id, PetCreateDto dto) {
        Pet entity = getEntity(id);
        Category category = dto.categoryId() != null ? categoryService.getEntity(dto.categoryId()) : null;
        mapper.updateEntity(entity, dto, category);
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Pet not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public Pet getEntity(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
    }
}
