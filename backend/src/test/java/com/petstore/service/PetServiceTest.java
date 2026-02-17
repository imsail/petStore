package com.petstore.service;

import com.petstore.dto.PetCreateDto;
import com.petstore.dto.PetDto;
import com.petstore.entity.Category;
import com.petstore.entity.Pet;
import com.petstore.entity.PetStatus;
import com.petstore.exception.ResourceNotFoundException;
import com.petstore.mapper.PetMapper;
import com.petstore.repository.PetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository petRepository;
    @Mock
    private PetMapper petMapper;
    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private PetService petService;

    private Pet pet;
    private PetDto petDto;

    @BeforeEach
    void setUp() {
        pet = new Pet();
        pet.setId(1L);
        pet.setName("Buddy");
        pet.setType("Dog");
        pet.setBreed("Golden Retriever");
        pet.setPrice(BigDecimal.valueOf(499.99));
        pet.setStatus(PetStatus.AVAILABLE);
        pet.setStock(3);

        petDto = new PetDto(1L, "Buddy", "Dog", "Golden Retriever", 2,
            BigDecimal.valueOf(499.99), PetStatus.AVAILABLE, null, "A friendly dog", 3, null);
    }

    @Test
    void findAll_returnsPageOfPets() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Pet> page = new PageImpl<>(List.of(pet));
        when(petRepository.findAll(pageable)).thenReturn(page);
        when(petMapper.toDto(pet)).thenReturn(petDto);

        Page<PetDto> result = petService.findAll(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Buddy", result.getContent().get(0).name());
    }

    @Test
    void findById_returnsPet() {
        when(petRepository.findById(1L)).thenReturn(Optional.of(pet));
        when(petMapper.toDto(pet)).thenReturn(petDto);

        PetDto result = petService.findById(1L);

        assertEquals("Buddy", result.name());
    }

    @Test
    void findById_throwsWhenNotFound() {
        when(petRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> petService.findById(99L));
    }

    @Test
    void create_savesPet() {
        PetCreateDto createDto = new PetCreateDto("Buddy", "Dog", "Golden Retriever", 2,
            BigDecimal.valueOf(499.99), null, "A friendly dog", 3, null);
        when(petMapper.toEntity(createDto, null)).thenReturn(pet);
        when(petRepository.save(pet)).thenReturn(pet);
        when(petMapper.toDto(pet)).thenReturn(petDto);

        PetDto result = petService.create(createDto);

        assertEquals("Buddy", result.name());
        verify(petRepository).save(pet);
    }

    @Test
    void delete_throwsWhenNotFound() {
        when(petRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> petService.delete(99L));
    }

    @Test
    void delete_deletesWhenExists() {
        when(petRepository.existsById(1L)).thenReturn(true);

        petService.delete(1L);

        verify(petRepository).deleteById(1L);
    }
}
