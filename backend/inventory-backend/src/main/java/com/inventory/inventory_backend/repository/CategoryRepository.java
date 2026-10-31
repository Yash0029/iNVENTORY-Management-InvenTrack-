package com.inventory.inventory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.inventory_backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}