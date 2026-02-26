package com.bea.admin.service;

import com.bea.admin.dto.AuthResponse;
import com.bea.admin.dto.LoginRequest;
import com.bea.admin.model.User;
import com.bea.admin.repository.UserRepository;
import com.bea.admin.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        // 1. Vérifier que l'utilisateur existe
        User user = userRepository.findByMatricule(request.getMatricule())
                .orElseThrow(() -> new RuntimeException("Matricule ou mot de passe incorrect"));

        // 2. Vérifier que le compte est actif
        if (!"ACTIF".equalsIgnoreCase(user.getStatut())) {
            throw new RuntimeException("Compte inactif ou bloqué, contactez votre administrateur");
        }

        // 3. Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getMotDePasseCrypte())) {
            throw new RuntimeException("Matricule ou mot de passe incorrect");
        }

        // 4. Générer le token JWT
        String token = jwtUtil.generateToken(user.getMatricule());

        return new AuthResponse(
                token,
                user.getMatricule(),
                user.getNom(),
                user.getPrenom(),
                user.getProfilUtilisateur(),
                user.getAgenceUtilisateur()
        );
    }
}