package com.bea.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuditEntryDto {
    private String id;
    private String at;
    private String by;
    private String action;
    private String detail;
}
