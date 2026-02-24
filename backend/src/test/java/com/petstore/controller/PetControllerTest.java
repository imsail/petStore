package com.petstore.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.dto.PetCreateDto;
import com.petstore.dto.PetDto;
import com.petstore.entity.PetStatus;
import com.petstore.exception.GlobalExceptionHandler;
import com.petstore.exception.ResourceNotFoundException;
import com.petstore.service.PetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PetController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private PetService petService;

    private final PetDto samplePet = new PetDto(1L, "Buddy", "Dog", "Golden Retriever", 2,
        BigDecimal.valueOf(499.99), PetStatus.AVAILABLE, null, "A friendly dog", 3, null);

    @Test
    void findAll_returnsPets() throws Exception {
        when(petService.findAll(any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(samplePet)));

        mockMvc.perform(get("/api/pets"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].name").value("Buddy"));
    }

    @Test
    void findById_returnsPet() throws Exception {
        when(petService.findById(1L)).thenReturn(samplePet);

        mockMvc.perform(get("/api/pets/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Buddy"));
    }

    @Test
    void findById_returns404() throws Exception {
        when(petService.findById(99L)).thenThrow(new ResourceNotFoundException("Pet not found"));

        mockMvc.perform(get("/api/pets/99"))
            .andExpect(status().isNotFound());
    }

    @Test
    void create_returnsPet() throws Exception {
        PetCreateDto createDto = new PetCreateDto("Buddy", "Dog", "Golden Retriever", 2,
            BigDecimal.valueOf(499.99), null, "A friendly dog", 3, null);
        when(petService.create(any(PetCreateDto.class))).thenReturn(samplePet);

        mockMvc.perform(post("/api/pets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Buddy"));
    }
}
