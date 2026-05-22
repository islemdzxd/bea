package com.bea.client.dto.allocation;

import com.bea.client.dto.DocumentDto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AllocationRequestResponse {
    private String codeDeclaration;
    private String cli;
    private String nin;
    private String nomBenefi;
    private String prenom;
    private String communeNaissanceBenf;
    private LocalDate dateNaissanceBenf;
    private String numPasseport;
    private LocalDate delivPassp;
    private LocalDate dExpPassp;
    private LocalDate dateAllez;
    private LocalDate dateRetour;
    private String codePays;
    private String nomPays;
    private String codeMonnaie;
    private String cdMoyenTrans;
    private String moyenTrans;
    private String codePostFrontalier;
    private String designationPostFr;
    private BigDecimal montantTotal;
    private String etat;
    private String statu;
    private LocalDate dateSaisie;
    private String observation;
    private String passportMainPagePath;
    private String passportVisaPagePath;
    private String passportNeantPagePath;
    private String ticketCopyPath;
    private List<DocumentDto> documents;
}