package com.inventory.inventory_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.inventory.inventory_backend.entity.Inventory;
import com.inventory.inventory_backend.entity.StockTransfer;
import com.inventory.inventory_backend.repository.InventoryRepository;
import com.inventory.inventory_backend.repository.ProductRepository;
import com.inventory.inventory_backend.repository.StockTransferRepository;
import com.inventory.inventory_backend.repository.WarehouseRepository;

@Service
public class StockTransferService {
    private final StockTransferRepository transfers;
    private final InventoryRepository inventory;
    private final ProductRepository products;
    private final WarehouseRepository warehouses;

    public StockTransferService(StockTransferRepository transfers, InventoryRepository inventory,
                                ProductRepository products, WarehouseRepository warehouses) {
        this.transfers = transfers; this.inventory = inventory; this.products = products; this.warehouses = warehouses;
    }

    @Transactional
    public StockTransfer create(StockTransfer transfer) {
        validateReferences(transfer);
        if (transfer.getFromWarehouseId().equals(transfer.getToWarehouseId())) {
            throw new IllegalArgumentException("Source and destination warehouses must be different.");
        }
        Inventory source = inventory.findByProductIdAndWarehouseId(transfer.getProductId(), transfer.getFromWarehouseId())
                .orElseThrow(() -> new IllegalArgumentException("The product is not stocked in the source warehouse."));
        if (source.getQuantity() < transfer.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock in the source warehouse.");
        }
        Inventory destination = inventory.findByProductIdAndWarehouseId(transfer.getProductId(), transfer.getToWarehouseId())
                .orElseGet(() -> new Inventory(transfer.getProductId(), transfer.getToWarehouseId(), 0, source.getMinimumStock()));
        source.setQuantity(source.getQuantity() - transfer.getQuantity());
        destination.setQuantity(destination.getQuantity() + transfer.getQuantity());
        inventory.save(source);
        inventory.save(destination);
        transfer.setStatus("COMPLETED");
        return transfers.save(transfer);
    }

    private void validateReferences(StockTransfer transfer) {
        if (!products.existsById(transfer.getProductId())) throw new IllegalArgumentException("Product was not found.");
        if (!warehouses.existsById(transfer.getFromWarehouseId()) || !warehouses.existsById(transfer.getToWarehouseId())) {
            throw new IllegalArgumentException("Warehouse was not found.");
        }
    }
}
