package com.inventory.inventory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.inventory_backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}