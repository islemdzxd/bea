package com.bea.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String matricule;
    private String nom;
    private String prenom;
    private String profil;
    private String agence;
}