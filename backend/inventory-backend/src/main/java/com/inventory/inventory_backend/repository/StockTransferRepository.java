package com.inventory.inventory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.inventory_backend.entity.StockTransfer;

public interface StockTransferRepository
        extends JpaRepository<StockTransfer, Long> {
}