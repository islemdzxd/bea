package com.bea.client.controller;

import com.bea.client.dto.AuthResponse;
import com.bea.client.dto.LoginRequest;
import com.bea.client.dto.RegisterRequest;
import com.bea.client.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.bea.client.model.Client;
import com.bea.client.dto.AuthResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.ok(null);
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Client client) {
            AuthResponse resp = new AuthResponse(null, client.getNom(), client.getPrenom(), client.getCli());
            return ResponseEntity.ok(resp);
        }

        return ResponseEntity.ok(null);
    }
}