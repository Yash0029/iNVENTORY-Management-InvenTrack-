package com.inventory.inventory_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.repository.UserRepository;

@Configuration
public class DemoDataInitializer {
    @Bean
    CommandLineRunner initializeAdmin(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            User admin = users.findByEmail("admin@inventrack.com")
                    .orElseGet(() -> new User("Admin User", "admin@inventrack.com", "", "ADMIN"));
            // Migrate the development account from the original plaintext password once.
            if (!admin.getPassword().startsWith("$2")) {
                admin.setPassword(encoder.encode(admin.getPassword().isBlank() ? "admin123" : admin.getPassword()));
            }
            admin.setRole("ADMIN");
            users.save(admin);
        };
    }
}
