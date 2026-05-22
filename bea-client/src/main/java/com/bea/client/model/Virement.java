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
@Table(name = "virements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Virement {

    @Id
    @Column(name = "reference", length = 30)
    private String reference;

    @Column(name = "code_utilisateur", length = 50)
    private String codeUtilisateur;

    @Column(name = "debit_account_number", length = 10)
    private String debitAccountNumber;

    @Column(name = "beneficiary_last_name", length = 100)
    private String beneficiaryLastName;

    @Column(name = "beneficiary_first_name", length = 100)
    private String beneficiaryFirstName;

    @Column(name = "beneficiary_address", length = 255)
    private String beneficiaryAddress;

    @Column(name = "beneficiary_rib", length = 20)
    private String beneficiaryRib;

    @Column(name = "amount", precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "donor_signature", length = 200)
    private String donorSignature;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "submitted_at")
    private LocalDate submittedAt;

    @Column(name = "processed_at")
    private LocalDate processedAt;
}