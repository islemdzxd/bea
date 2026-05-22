package com.bea.client.dto.allocation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AllocationContextResponse {
    private String cli;
    private String nin;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String lieuNaissance;
    private String agence;
    private boolean alreadyUsedThisYear;
    private AllocationRequestResponse latestRequest;
}