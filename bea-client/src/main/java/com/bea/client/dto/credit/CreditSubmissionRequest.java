package com.bea.client.dto.credit;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class CreditSubmissionRequest {
    private String creditType;
    private BigDecimal requestedAmount;
    private BigDecimal propertyValue;
    private BigDecimal monthlySalary;
    private String workStatus;
    private Integer durationMonths;
    private MultipartFile salarySlip;
    private MultipartFile workCertificate;
    private MultipartFile idDocument;
    private String observation;
}