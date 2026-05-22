package com.bea.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AllocationAdminResponse {
    private String id;
    private String codeDeclaration;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String nin;
    private String passportNumber;
    private String destination;
    private String departureDate;
    private String returnDate;
    private BigDecimal amountEur;
    private BigDecimal amountDzd;
    private String currency;
    private String status;
    private List<DocumentDto> documents;
    private String observation;
    private String transferReference;
    private String receiptSignedAt;
    private String verifiedBy;
    private List<AuditEntryDto> history;
    private String createdAt;
}
