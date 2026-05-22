package com.bea.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CreditAdminResponse {
    private String id;
    private String numeroDossier;
    private String clientName;
    private String clientEmail;
    private String codeClient;
    private String typePret;
    private BigDecimal montantPret;
    private Integer dureeMois;
    private BigDecimal salaireMensuel;
    private String status;
    private List<DocumentDto> documents;
    private String motifRejet;
    private String appointmentAt;
    private String appointmentNote;
    private String processedBy;
    private List<AuditEntryDto> history;
    private String createdAt;
}
