package com.inventory.inventory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.inventory_backend.entity.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
}