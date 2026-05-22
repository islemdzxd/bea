package com.bea.client.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ordre_bourse")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdreBourse {

    @Id
    @Column(name = "reference", length = 30)
    private String reference;

    @Column(name = "code_utilisateur", length = 50)
    private String codeUtilisateur;

    @Column(name = "numero_compte", length = 10)
    private String numeroCompte;

    @Column(name = "symbol", length = 20)
    private String symbol;

    @Column(name = "stock_name", length = 120)
    private String stockName;

    @Column(name = "side", length = 4)
    private String side;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "total", precision = 15, scale = 2)
    private BigDecimal total;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "submitted_at")
    private LocalDate submittedAt;

    @Column(name = "processed_at")
    private LocalDate processedAt;
}