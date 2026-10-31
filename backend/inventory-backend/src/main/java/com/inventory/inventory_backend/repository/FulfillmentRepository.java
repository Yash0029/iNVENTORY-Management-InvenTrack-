package com.inventory.inventory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.inventory_backend.entity.Fulfillment;

public interface FulfillmentRepository
        extends JpaRepository<Fulfillment, Long> {
}