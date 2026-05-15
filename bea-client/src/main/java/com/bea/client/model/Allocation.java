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
@Table(name = "allocation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Allocation {

	@Id
	@Column(name = "codedeclaration", length = 20)
	private String codeDeclaration;

	@Column(name = "datearrete")
	private LocalDate dateArrete;

	@Column(name = "codeagence", length = 10)
	private String codeAgence;

	@Column(name = "etablissementdec", length = 50)
	private String etablissementDec;

	@Column(name = "nin", length = 50)
	private String nin;

	@Column(name = "dateoctroi")
	private LocalDate dateOctroi;

	@Column(name = "nombenefi", length = 100)
	private String nomBenefi;

	@Column(name = "prenom", length = 100)
	private String prenom;

	@Column(name = "numpasseport", length = 20)
	private String numPasseport;

	@Column(name = "datenaissancebenf")
	private LocalDate dateNaissanceBenf;

	@Column(name = "cdmoyentrans", length = 10)
	private String cdMoyenTrans;

	@Column(name = "moeyntrans", length = 50)
	private String moyenTrans;

	@Column(name = "codepostfrontalier", length = 10)
	private String codePostFrontalier;

	@Column(name = "designationpostfr", length = 100)
	private String designationPostFr;

	@Column(name = "dateallez")
	private LocalDate dateAllez;

	@Column(name = "dateretour")
	private LocalDate dateRetour;

	@Column(name = "codepays", length = 10)
	private String codePays;

	@Column(name = "nompays", length = 100)
	private String nomPays;

	@Column(name = "moannaie", length = 10)
	private String moannaie;

	@Column(name = "montanteur", precision = 15, scale = 2)
	private BigDecimal montantEur;

	@Column(name = "cours", precision = 15, scale = 4)
	private BigDecimal cours;

	@Column(name = "contrevaleur", precision = 15, scale = 2)
	private BigDecimal contreValeur;

	@Column(name = "nomtuteur", length = 100)
	private String nomTuteur;

	@Column(name = "nintuteur", length = 50)
	private String ninTuteur;

	@Column(name = "prenomtuteur", length = 100)
	private String prenomTuteur;

	@Column(name = "add_by", length = 50)
	private String addBy;

	@Column(name = "etat", length = 20)
	private String etat;

	@Column(name = "eve", length = 20)
	private String eve;

	@Column(name = "statu", length = 20)
	private String statu;

	@Column(name = "code_monnaie", length = 5)
	private String codeMonnaie;

	@Column(name = "delivpassp")
	private LocalDate delivPassp;

	@Column(name = "monchiffre", precision = 15, scale = 2)
	private BigDecimal monChiffre;

	@Column(name = "dexppassp")
	private LocalDate dExpPassp;

	@Column(name = "civility", length = 20)
	private String civility;

	@Column(name = "nordre", length = 20)
	private String norDre;

	@Column(name = "monttantlettre", length = 200)
	private String montantLettre;

	@Column(name = "montotallettre", length = 200)
	private String monTotalLettre;

	@Column(name = "montanttotal", precision = 15, scale = 2)
	private BigDecimal montantTotal;

	@Column(name = "phone", length = 20)
	private String phone;

	@Column(name = "email", length = 100)
	private String email;

	@Column(name = "datesaisie")
	private LocalDate dateSaisie;

	@Column(name = "dateverif")
	private LocalDate dateVerif;

	@Column(name = "datevers")
	private LocalDate dateVers;

	@Column(name = "observation", columnDefinition = "TEXT")
	private String observation;

	@Column(name = "verif_by", length = 50)
	private String verifBy;

	@Column(name = "valid_by", length = 50)
	private String validBy;

	@Column(name = "dateab")
	private LocalDate dateAb;

	@Column(name = "ab_by", length = 50)
	private String abBy;
}
