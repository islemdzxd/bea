package com.bea.client.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "mouvements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mouvement {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "numero_mouvement")
	private Long numeroMouvement;

	@Column(name = "agence", length = 10)
	private String agence;

	@Column(name = "code_agence_destinatrice", length = 10)
	private String codeAgenceDestinatrice;

	@Column(name = "code_agence_emetrice", length = 10)
	private String codeAgenceEmetrice;

	@Column(name = "chapitre_comptable", length = 20)
	private String chapitreComptable;

	@Column(name = "date_comptable")
	private LocalDate dateComptable;

	@Column(name = "code_devise", length = 5)
	private String codeDevise;

	@Column(name = "date_valeur")
	private LocalDate dateValeur;

	@Column(name = "libelle", length = 200)
	private String libelle;

	@Column(name = "montant", precision = 15, scale = 2)
	private BigDecimal montant;

	@Column(name = "numero_compte", length = 10)
	private String numeroCompte;

	@Column(name = "numero_compte_rapprochement", length = 10)
	private String numeroCompteRapprochement;

	@Column(name = "code_operation", length = 20)
	private String codeOperation;

	@Column(name = "sens", length = 1)
	private String sens;

	@Column(name = "code_utilisateur", length = 50)
	private String codeUtilisateur;
}
