package com.bea.client.dto.ordrebourse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class OrdreBourseResponse {
    private String reference;
    private String codeUtilisateur;
    private String numeroCompte;
    private String symbol;
    private String stockName;
    private String side;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal total;
    private String status;
    private String failureReason;
    private LocalDate submittedAt;
    private LocalDate processedAt;
}