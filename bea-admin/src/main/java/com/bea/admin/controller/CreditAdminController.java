package com.bea.admin.controller;

import com.bea.admin.dto.CreditAdminResponse;
import com.bea.admin.dto.DecisionCreditRequest;
import com.bea.admin.service.CreditAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/credits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CreditAdminController {

    private final CreditAdminService creditAdminService;

    @GetMapping
    public ResponseEntity<List<CreditAdminResponse>> list() {
        return ResponseEntity.ok(creditAdminService.listAll());
    }

    @GetMapping("/{numeroDossier}")
    public ResponseEntity<CreditAdminResponse> get(@PathVariable String numeroDossier) {
        return ResponseEntity.ok(creditAdminService.getByNumero(numeroDossier));
    }

    @PostMapping("/{numeroDossier}/approve")
    public ResponseEntity<CreditAdminResponse> approve(
            @PathVariable String numeroDossier,
            @RequestBody DecisionCreditRequest request
    ) {
        return ResponseEntity.ok(creditAdminService.approve(numeroDossier, request));
    }

    @PostMapping("/{numeroDossier}/reject")
    public ResponseEntity<CreditAdminResponse> reject(
            @PathVariable String numeroDossier,
            @RequestBody DecisionCreditRequest request
    ) {
        return ResponseEntity.ok(creditAdminService.reject(numeroDossier, request));
    }

    @GetMapping("/{numeroDossier}/documents/{documentId}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable String numeroDossier,
            @PathVariable String documentId
    ) {
        Resource resource = creditAdminService.loadDocument(numeroDossier, documentId);
        String fileName = Paths.get(resource.getFilename() != null ? resource.getFilename() : documentId + ".pdf")
                .getFileName().toString();
        return ResponseEntity.ok()
                .contentType(creditAdminService.resolveMediaType(fileName))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }
}
