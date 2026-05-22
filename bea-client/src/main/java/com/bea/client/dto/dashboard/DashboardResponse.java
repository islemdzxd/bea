package com.bea.client.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private String cli;
    private String nom;
    private String prenom;
    private BigDecimal totalBalance;
    private BigDecimal totalIndicativeBalance;
    private int totalAccounts;
    private DashboardAccountResponse primaryAccount;
    private List<DashboardAccountResponse> accounts;
    private List<DashboardMovementResponse> recentMovements;
    private LocalDateTime generatedAt;
}