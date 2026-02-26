package com.bea.client.service;

import com.bea.client.dto.AuthResponse;
import com.bea.client.dto.LoginRequest;
import com.bea.client.model.Client;
import com.bea.client.repository.ClientRepository;
import com.bea.client.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        // 1. Vérifier que le client existe
        Client client = clientRepository.findByCli(request.getCli())
                .orElseThrow(() -> new RuntimeException("Login incorrect"));

        // 2. Vérifier que le client a un mot de passe (accès activé par la BEA)
        if (client.getPassword() == null) {
            throw new RuntimeException("Accès non activé, contactez votre agence");
        }

        // 3. Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), client.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // 4. Générer le token JWT
        String token = jwtUtil.generateToken(client.getCli());

        return new AuthResponse(token, client.getNom(), client.getPrenom(), client.getCli());
    }
}