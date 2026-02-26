package com.bea.admin.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "matricule")
    private String matricule;

    @Column(name = "agence_utilisateur")
    private String agenceUtilisateur;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "profil_utilisateur")
    private String profilUtilisateur;

    @Column(name = "mot_de_passe_crypte")
    private String motDePasseCrypte;

    @Column(name = "date_modif_password")
    private LocalDate dateModifPassword;

    @Column(name = "statut")
    private String statut; // ACTIF / INACTIF / BLOQUE
}