package com.bea.client.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "achat_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AchatActions {

	@Id
	@Column(name = "numero_compte", length = 10)
	private String numeroCompte;

	@Column(name = "agence", length = 10)
	private String agence;

	@Column(name = "nom", length = 100)
	private String nom;

	@Column(name = "prenom", length = 100)
	private String prenom;

	@Column(name = "nin", length = 50)
	private String nin;

	@Column(name = "delivre_le")
	private LocalDate delivreLe;

	@Column(name = "lieu_delivrance", length = 100)
	private String lieuDelivrance;

	@Column(name = "adresse", length = 200)
	private String adresse;

	@Column(name = "valeur", length = 100)
	private String valeur;

	@Column(name = "quantite")
	private Integer quantite;

	@Column(name = "date_validite")
	private LocalDate dateValidite;

	@Column(name = "date_demande")
	private LocalDate dateDemande;
}
