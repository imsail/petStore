package com.petstore.controller;

import com.petstore.dto.InventoryDto;
import com.petstore.dto.PetDto;
import com.petstore.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public InventoryDto getDashboard() {
        return inventoryService.getDashboard();
    }

    @GetMapping("/low-stock")
    public List<PetDto> getLowStock() {
        return inventoryService.getLowStockPets();
    }

    @PatchMapping("/pets/{id}/stock")
    public PetDto updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return inventoryService.updateStock(id, body.get("stock"));
    }
}
