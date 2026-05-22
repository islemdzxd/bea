package com.bea.admin.controller;

import com.bea.admin.dto.AllocationAdminResponse;
import com.bea.admin.dto.CreditAdminResponse;
import com.bea.admin.dto.DashboardStatsResponse;
import com.bea.admin.service.AllocationAdminService;
import com.bea.admin.service.CreditAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final AllocationAdminService allocationAdminService;
    private final CreditAdminService creditAdminService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> stats() {
        List<AllocationAdminResponse> allocations = allocationAdminService.listAll();
        List<CreditAdminResponse> credits = creditAdminService.listAll();

        DashboardStatsResponse allocationStats = allocationAdminService.buildStats(allocations);

        long creditPending = credits.stream()
                .filter(c -> CreditAdminService.EN_ATTENTE.equalsIgnoreCase(c.getStatus()))
                .count();
        long creditApproved = credits.stream()
                .filter(c -> CreditAdminService.APPROUVE_RDV.equalsIgnoreCase(c.getStatus()))
                .count();

        DashboardStatsResponse response = DashboardStatsResponse.builder()
                .allocPending(allocationStats.getAllocPending())
                .allocAwaitingTransfer(allocationStats.getAllocAwaitingTransfer())
                .allocTransferReceived(allocationStats.getAllocTransferReceived())
                .allocUrgent(allocationStats.getAllocUrgent())
                .creditPending(creditPending)
                .creditApproved(creditApproved)
                .creditTotal(credits.size())
                .build();

        return ResponseEntity.ok(response);
    }
}
