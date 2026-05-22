package com.bea.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long allocPending;
    private long allocAwaitingTransfer;
    private long allocTransferReceived;
    private long allocUrgent;
    private long creditPending;
    private long creditApproved;
    private long creditTotal;
}
