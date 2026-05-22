package com.bea.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DocumentDto {
    private String id;
    private String label;
    private String fileName;
    private String downloadUrl;
}
