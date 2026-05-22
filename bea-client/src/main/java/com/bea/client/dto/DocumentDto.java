package com.bea.client.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentDto {
    private String id;
    private String label;
    private String fileName;
    private String contentType;
    private String downloadUrl;
}