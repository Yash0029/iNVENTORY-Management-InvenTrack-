package com.inventory.inventory_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.inventory_backend.entity.Inventory;
import com.inventory.inventory_backend.repository.InventoryRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:4200")
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    public InventoryController(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // Get all inventory records
    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // Get inventory by ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(
            @PathVariable Long id) {

        Optional<Inventory> inventory =
                inventoryRepository.findById(id);

        if (inventory.isPresent()) {
            return ResponseEntity.ok(inventory.get());
        }

        return ResponseEntity.notFound().build();
    }

    // Create inventory record
    @PostMapping
    public Inventory createInventory(
            @Valid @RequestBody Inventory inventory) {

        return inventoryRepository.save(inventory);
    }

    // Update inventory record
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Long id,
            @RequestBody Inventory inventoryDetails) {

        Optional<Inventory> existing =
                inventoryRepository.findById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Inventory inventory = existing.get();

        inventory.setProductId(
                inventoryDetails.getProductId()
        );

        inventory.setWarehouseId(
                inventoryDetails.getWarehouseId()
        );

        inventory.setQuantity(
                inventoryDetails.getQuantity()
        );

        inventory.setMinimumStock(
                inventoryDetails.getMinimumStock()
        );

        return ResponseEntity.ok(
                inventoryRepository.save(inventory)
        );
    }

    // Delete inventory record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(
            @PathVariable Long id) {

        if (!inventoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        inventoryRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
