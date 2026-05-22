package com.bea.client.controller;

import com.bea.client.dto.dashboard.DashboardResponse;
import com.bea.client.model.Client;
import com.bea.client.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/me")
    public ResponseEntity<DashboardResponse> getMyDashboard(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Client client)) {
            throw new IllegalStateException("Authenticated client not found");
        }

        return ResponseEntity.ok(dashboardService.getDashboard(client));
    }
}