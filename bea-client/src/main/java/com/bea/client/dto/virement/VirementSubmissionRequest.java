package com.bea.client.dto.virement;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VirementSubmissionRequest {
    private String debitAccountId;
    private String beneficiaryLastName;
    private String beneficiaryFirstName;
    private String address;
    private String rib;
    private BigDecimal amount;
    private String reason;
    private String signature;
}