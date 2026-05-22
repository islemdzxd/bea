package com.bea.client.dto.allocation;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AllocationSubmissionRequest {
    private LocalDate dateAllez;
    private LocalDate dateRetour;
    private String codePays;
    private String nomPays;
    private String codeMonnaie;
    private BigDecimal montantTotal;
    private String cdMoyenTrans;
    private String moyenTrans;
    private String codePostFrontalier;
    private String designationPostFr;
    private String passportNumber;
    private LocalDate passportExpiryDate;
    private String travelType;
    private String observation;
    private MultipartFile passportMainPage;
    private MultipartFile passportVisaPage;
    private MultipartFile passportNeantPage;
    private MultipartFile ticketCopy;
}