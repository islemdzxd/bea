package com.bea.client.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "comptes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compte {

	@Id
	@Column(name = "numero_compte", length = 10)
	private String numeroCompte;

	@Column(name = "agence", length = 10)
	private String agence;

	@Column(name = "compte_ferme", length = 1)
	private String compteFerme;

	@Column(name = "code_devise", length = 5)
	private String codeDevise;

	@Column(name = "date_ouverture")
	private LocalDate dateOuverture;

	@Column(name = "date_fermeture")
	private LocalDate dateFermeture;

	@Column(name = "solde_comptable", precision = 15, scale = 2)
	private BigDecimal soldeComptable;

	@Column(name = "solde_indicatif", precision = 15, scale = 2)
	private BigDecimal soldeIndicatif;

	@Column(name = "cle_rib", length = 10)
	private String cleRib;

	@Column(name = "code_utilisateur", length = 50)
	private String codeUtilisateur;

	@Column(name = "sens_compte", length = 10)
	private String sensCompte;
}