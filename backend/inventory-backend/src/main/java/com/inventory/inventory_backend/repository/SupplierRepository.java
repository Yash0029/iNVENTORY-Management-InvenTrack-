package com.inventory.inventory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.inventory_backend.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}