package com.bea.client.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class DashboardMovementResponse {
    private Long numeroMouvement;
    private String numeroCompte;
    private String agence;
    private String codeAgenceDestinatrice;
    private String codeAgenceEmetrice;
    private String codeDevise;
    private LocalDate dateComptable;
    private LocalDate dateValeur;
    private String libelle;
    private BigDecimal montant;
    private String sens;
    private String codeOperation;
}