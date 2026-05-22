package com.bea.client.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class DashboardAccountResponse {
    private String numeroCompte;
    private String agence;
    private String codeDevise;
    private LocalDate dateOuverture;
    private LocalDate dateFermeture;
    private String compteFerme;
    private BigDecimal soldeComptable;
    private BigDecimal soldeIndicatif;
    private String cleRib;
    private String sensCompte;
}