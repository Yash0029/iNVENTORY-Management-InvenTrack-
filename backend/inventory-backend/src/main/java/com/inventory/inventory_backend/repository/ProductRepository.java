package com.inventory.inventory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.inventory_backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}