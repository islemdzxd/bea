package com.bea.client.dto.credit;

import com.bea.client.dto.DocumentDto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class CreditRequestResponse {
    private String numeroDossier;
    private String cli;
    private String codeClient;
    private String agence;
    private String numeroConvention;
    private String creditType;
    private BigDecimal requestedAmount;
    private BigDecimal propertyValue;
    private BigDecimal monthlySalary;
    private String workStatus;
    private Integer durationMonths;
    private BigDecimal estimatedMonthlyPayment;
    private String etatDossier;
    private LocalDate dateOuvertureDossier;
    private LocalDate dateModificationDossier;
    private LocalDate dateDernierEtat;
    private String motifRejet;
    private String salarySlipPath;
    private String workCertificatePath;
    private String idDocumentPath;
    private List<DocumentDto> documents;
}