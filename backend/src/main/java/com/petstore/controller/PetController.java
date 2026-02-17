package com.petstore.controller;

import com.petstore.dto.PetCreateDto;
import com.petstore.dto.PetDto;
import com.petstore.entity.PetStatus;
import com.petstore.service.PetService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public Page<PetDto> findAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) PetStatus status,
            Pageable pageable) {
        if (categoryId != null) return petService.findByCategory(categoryId, pageable);
        if (status != null) return petService.findByStatus(status, pageable);
        return petService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public PetDto findById(@PathVariable Long id) {
        return petService.findById(id);
    }

    @GetMapping("/search")
    public Page<PetDto> search(@RequestParam String q, Pageable pageable) {
        return petService.search(q, pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PetDto create(@Valid @RequestBody PetCreateDto dto) {
        return petService.create(dto);
    }

    @PutMapping("/{id}")
    public PetDto update(@PathVariable Long id, @Valid @RequestBody PetCreateDto dto) {
        return petService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        petService.delete(id);
    }
}
