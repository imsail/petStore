package com.petstore.mapper;

import com.petstore.dto.PetCreateDto;
import com.petstore.dto.PetDto;
import com.petstore.entity.Category;
import com.petstore.entity.Pet;
import com.petstore.entity.PetStatus;
import org.springframework.stereotype.Component;

@Component
public class PetMapper {

    private final CategoryMapper categoryMapper;

    public PetMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public PetDto toDto(Pet entity) {
        return new PetDto(
            entity.getId(),
            entity.getName(),
            entity.getType(),
            entity.getBreed(),
            entity.getAge(),
            entity.getPrice(),
            entity.getStatus(),
            entity.getImageUrl(),
            entity.getDescription(),
            entity.getStock(),
            entity.getCategory() != null ? categoryMapper.toDto(entity.getCategory()) : null
        );
    }

    public Pet toEntity(PetCreateDto dto, Category category) {
        Pet entity = new Pet();
        entity.setName(dto.name());
        entity.setType(dto.type());
        entity.setBreed(dto.breed());
        entity.setAge(dto.age());
        entity.setPrice(dto.price());
        entity.setImageUrl(dto.imageUrl());
        entity.setDescription(dto.description());
        entity.setStock(dto.stock());
        entity.setStatus(PetStatus.AVAILABLE);
        entity.setCategory(category);
        return entity;
    }

    public void updateEntity(Pet entity, PetCreateDto dto, Category category) {
        entity.setName(dto.name());
        entity.setType(dto.type());
        entity.setBreed(dto.breed());
        entity.setAge(dto.age());
        entity.setPrice(dto.price());
        entity.setImageUrl(dto.imageUrl());
        entity.setDescription(dto.description());
        entity.setStock(dto.stock());
        entity.setCategory(category);
    }
}
