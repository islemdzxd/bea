package com.bea.client.dto.virement;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class VirementResponse {
    private String reference;
    private String codeUtilisateur;
    private String debitAccountNumber;
    private String beneficiaryLastName;
    private String beneficiaryFirstName;
    private String beneficiaryAddress;
    private String beneficiaryRib;
    private BigDecimal amount;
    private String reason;
    private String donorSignature;
    private String status;
    private String failureReason;
    private LocalDate submittedAt;
    private LocalDate processedAt;
}