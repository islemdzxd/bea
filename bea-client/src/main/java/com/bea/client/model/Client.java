package com.bea.client.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @Column(name = "cli")
    private String cli;

    @Column(name = "agence")
    private String agence;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "lieu_naissance")
    private String lieuNaissance;

    @Column(name = "nin")
    private String nin;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "intitule")
    private String intitule;

    @Column(name = "type_piece_identite")
    private String typePieceIdentite;

    @Column(name = "date_validite_piece")
    private LocalDate dateValiditePiece;

    @Column(name = "raison_sociale")
    private String raisonSociale;

    @Column(name = "code_pays_residence")
    private String codePaysResidence;

    @Column(name = "code_nationalite")
    private String codeNationalite;

    @Column(name = "password")
    private String password;
}
