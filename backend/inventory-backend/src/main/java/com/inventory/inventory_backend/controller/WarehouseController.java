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

import com.inventory.inventory_backend.entity.Warehouse;
import com.inventory.inventory_backend.repository.WarehouseRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "http://localhost:4200")
public class WarehouseController {

    private final WarehouseRepository warehouseRepository;

    public WarehouseController(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(
            @PathVariable Long id) {

        Optional<Warehouse> warehouse =
                warehouseRepository.findById(id);

        if (warehouse.isPresent()) {
            return ResponseEntity.ok(warehouse.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Warehouse createWarehouse(
            @Valid @RequestBody Warehouse warehouse) {

        return warehouseRepository.save(warehouse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Warehouse> updateWarehouse(
            @PathVariable Long id,
            @RequestBody Warehouse warehouseDetails) {

        Optional<Warehouse> existingWarehouse =
                warehouseRepository.findById(id);

        if (existingWarehouse.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Warehouse warehouse = existingWarehouse.get();

        warehouse.setName(warehouseDetails.getName());
        warehouse.setLocation(warehouseDetails.getLocation());
        warehouse.setManager(warehouseDetails.getManager());

        Warehouse updatedWarehouse =
                warehouseRepository.save(warehouse);

        return ResponseEntity.ok(updatedWarehouse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(
            @PathVariable Long id) {

        if (!warehouseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        warehouseRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
