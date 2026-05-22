package com.bea.admin.model;

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

    @Column(name = "nin", length = 50)
    private String nin;

    @Column(name = "nombenefi", length = 100)
    private String nomBenefi;

    @Column(name = "prenom", length = 100)
    private String prenom;

    @Column(name = "numpasseport", length = 20)
    private String numPasseport;

    @Column(name = "dateallez")
    private LocalDate dateAllez;

    @Column(name = "dateretour")
    private LocalDate dateRetour;

    @Column(name = "nompays", length = 100)
    private String nomPays;

    @Column(name = "montanteur", precision = 15, scale = 2)
    private BigDecimal montantEur;

    @Column(name = "contrevaleur", precision = 15, scale = 2)
    private BigDecimal contreValeur;

    @Column(name = "montanttotal", precision = 15, scale = 2)
    private BigDecimal montantTotal;

    @Column(name = "moannaie", length = 10)
    private String moannaie;

    @Column(name = "code_monnaie", length = 5)
    private String codeMonnaie;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "add_by", length = 50)
    private String addBy;

    @Column(name = "etat", length = 20)
    private String etat;

    @Column(name = "eve", length = 20)
    private String eve;

    @Column(name = "statu", length = 30)
    private String statu;

    @Column(name = "passport_main_page_path", length = 255)
    private String passportMainPagePath;

    @Column(name = "passport_visa_page_path", length = 255)
    private String passportVisaPagePath;

    @Column(name = "passport_neant_page_path", length = 255)
    private String passportNeantPagePath;

    @Column(name = "ticket_copy_path", length = 255)
    private String ticketCopyPath;

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

    @Column(name = "transfer_reference", length = 50)
    private String transferReference;
}
