package com.bea.admin.dto;

import lombok.Data;

@Data
public class DecisionCreditRequest {
    private String observation;
    private String appointmentAt;
    private String appointmentNote;
}
