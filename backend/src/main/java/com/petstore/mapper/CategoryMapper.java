package com.petstore.mapper;

import com.petstore.dto.CategoryDto;
import com.petstore.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDto toDto(Category entity) {
        return new CategoryDto(entity.getId(), entity.getName(), entity.getDescription());
    }

    public Category toEntity(CategoryDto dto) {
        Category entity = new Category();
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        return entity;
    }

    public void updateEntity(Category entity, CategoryDto dto) {
        entity.setName(dto.name());
        entity.setDescription(dto.description());
    }
}
