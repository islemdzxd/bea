package com.bea.client.dto.virement;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class VirementContextResponse {
    private String cli;
    private String nom;
    private String prenom;
    private List<VirementAccountResponse> accounts;
    private VirementResponse latestOrder;
}