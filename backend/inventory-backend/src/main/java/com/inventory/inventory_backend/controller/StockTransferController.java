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

import com.inventory.inventory_backend.entity.StockTransfer;
import com.inventory.inventory_backend.repository.StockTransferRepository;
import com.inventory.inventory_backend.service.StockTransferService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stock-transfers")
@CrossOrigin(origins = "http://localhost:4200")
public class StockTransferController {

    private final StockTransferRepository stockTransferRepository;
    private final StockTransferService stockTransferService;

    public StockTransferController(
            StockTransferRepository stockTransferRepository, StockTransferService stockTransferService) {
        this.stockTransferRepository = stockTransferRepository;
        this.stockTransferService = stockTransferService;
    }

    @GetMapping
    public List<StockTransfer> getAllStockTransfers() {
        return stockTransferRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockTransfer> getStockTransferById(
            @PathVariable Long id) {

        Optional<StockTransfer> transfer =
                stockTransferRepository.findById(id);

        if (transfer.isPresent()) {
            return ResponseEntity.ok(transfer.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public StockTransfer createStockTransfer(
            @Valid @RequestBody StockTransfer stockTransfer) {

        return stockTransferService.create(stockTransfer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockTransfer> updateStockTransfer(
            @PathVariable Long id,
            @RequestBody StockTransfer transferDetails) {

        Optional<StockTransfer> existingTransfer =
                stockTransferRepository.findById(id);

        if (existingTransfer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StockTransfer transfer = existingTransfer.get();

        transfer.setProductId(transferDetails.getProductId());
        transfer.setFromWarehouseId(
                transferDetails.getFromWarehouseId());
        transfer.setToWarehouseId(
                transferDetails.getToWarehouseId());
        transfer.setQuantity(transferDetails.getQuantity());
        transfer.setStatus(transferDetails.getStatus());

        StockTransfer updatedTransfer =
                stockTransferRepository.save(transfer);

        return ResponseEntity.ok(updatedTransfer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockTransfer(
            @PathVariable Long id) {

        if (!stockTransferRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        stockTransferRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
