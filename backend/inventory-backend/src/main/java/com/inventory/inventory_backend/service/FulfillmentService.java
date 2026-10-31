package com.inventory.inventory_backend.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.inventory.inventory_backend.entity.Fulfillment;
import com.inventory.inventory_backend.repository.OrderRepository;

@Service
public class FulfillmentService {
    private static final Set<String> STATUSES = Set.of("PENDING", "PROCESSING", "PACKED", "READY", "COMPLETED", "CANCELLED");
    private final OrderRepository orders;

    public FulfillmentService(OrderRepository orders) { this.orders = orders; }

    public void validate(Fulfillment fulfillment) {
        if (!orders.existsById(fulfillment.getOrderId())) throw new IllegalArgumentException("Order ID was not found.");
        String status = fulfillment.getStatus() == null ? "" : fulfillment.getStatus().trim().toUpperCase();
        if (!STATUSES.contains(status)) throw new IllegalArgumentException("Choose a valid fulfillment status.");
        fulfillment.setStatus(status);
    }
}
