package com.inventory.inventory_backend.dto;

public record AuthResponse(Long id, String name, String email, String role, String token) {
}
