package com.inventory.inventory_backend.controller;

import jakarta.validation.Valid;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import java.util.Set;

import com.inventory.inventory_backend.dto.AuthResponse;
import com.inventory.inventory_backend.entity.User;
import com.inventory.inventory_backend.repository.UserRepository;
import com.inventory.inventory_backend.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already registered.");
        }

        Set<String> roles = Set.of("ADMIN", "INVENTORY_MANAGER", "SALES_MANAGER", "VIEWER");
        String role = user.getRole() == null || user.getRole().isBlank() ? "VIEWER" : user.getRole().trim().toUpperCase();
        if (!roles.contains(role)) {
            return ResponseEntity.badRequest().body("Please select a valid role.");
        }
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(responseFor(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {

        Optional<User> existingUser =
                userRepository.findByEmail(loginRequest.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password.");
        }

        User user = existingUser.get();

        if (loginRequest.getPassword() == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password.");
        }

        return ResponseEntity.ok(responseFor(user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(responseFor(user)))
                .orElseGet(() -> ResponseEntity.status(401).body("Session is no longer valid."));
    }

    private AuthResponse responseFor(User user) {
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(),
                jwtService.generateToken(user.getEmail(), user.getRole()));
    }
}
