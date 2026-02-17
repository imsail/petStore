package com.petstore.service;

import com.petstore.dto.InventoryDto;
import com.petstore.dto.PetDto;
import com.petstore.entity.Pet;
import com.petstore.entity.PetStatus;
import com.petstore.exception.ResourceNotFoundException;
import com.petstore.mapper.PetMapper;
import com.petstore.repository.PetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final PetRepository petRepository;
    private final PetMapper petMapper;

    public InventoryService(PetRepository petRepository, PetMapper petMapper) {
        this.petRepository = petRepository;
        this.petMapper = petMapper;
    }

    public InventoryDto getDashboard() {
        long total = petRepository.count();
        long available = petRepository.countByStatus(PetStatus.AVAILABLE);
        long pending = petRepository.countByStatus(PetStatus.PENDING);
        long sold = petRepository.countByStatus(PetStatus.SOLD);
        List<PetDto> lowStock = getLowStockPets();
        return new InventoryDto(total, available, pending, sold, lowStock.size(), lowStock);
    }

    public List<PetDto> getLowStockPets() {
        return petRepository.findByStockLessThanAndStatusNot(5, PetStatus.SOLD).stream()
            .map(petMapper::toDto).toList();
    }

    @Transactional
    public PetDto updateStock(Long petId, int stock) {
        Pet pet = petRepository.findById(petId)
            .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));
        pet.setStock(stock);
        if (stock == 0) {
            pet.setStatus(PetStatus.SOLD);
        } else if (pet.getStatus() == PetStatus.SOLD) {
            pet.setStatus(PetStatus.AVAILABLE);
        }
        return petMapper.toDto(petRepository.save(pet));
    }
}
