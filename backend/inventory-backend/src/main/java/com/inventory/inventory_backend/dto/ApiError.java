package com.inventory.inventory_backend.dto;

import java.time.Instant;

public record ApiError(Instant timestamp, int status, String message) {
}
