package com.bea.client.dto.credit;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class CreditContextResponse {
    private String cli;
    private String nom;
    private String prenom;
    private String nin;
    private String agence;
    private LocalDate dateNaissance;
    private String lieuNaissance;
    private CreditRequestResponse latestRequest;
    private boolean hasPendingRequest;
    private BigDecimal averageMonthlySalary;
}