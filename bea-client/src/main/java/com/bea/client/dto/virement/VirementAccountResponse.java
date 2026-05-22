package com.bea.client.dto.virement;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class VirementAccountResponse {
    private String numeroCompte;
    private String agence;
    private String codeDevise;
    private BigDecimal soldeComptable;
    private BigDecimal soldeIndicatif;
    private String cleRib;
    private String sensCompte;
    private String compteFerme;
}