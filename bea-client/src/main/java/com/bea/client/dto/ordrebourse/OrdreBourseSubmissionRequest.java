package com.bea.client.dto.ordrebourse;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrdreBourseSubmissionRequest {
    private String accountId;
    private String symbol;
    private String name;
    private String side;
    private Integer quantity;
    private BigDecimal price;
}