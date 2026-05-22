package com.bea.admin.controller;

import com.bea.admin.dto.AllocationAdminResponse;
import com.bea.admin.dto.DecisionAllocationRequest;
import com.bea.admin.service.AllocationAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AllocationAdminController {

    private final AllocationAdminService allocationAdminService;

    @GetMapping
    public ResponseEntity<List<AllocationAdminResponse>> list() {
        return ResponseEntity.ok(allocationAdminService.listAll());
    }

    @GetMapping("/{codeDeclaration}")
    public ResponseEntity<AllocationAdminResponse> get(@PathVariable String codeDeclaration) {
        return ResponseEntity.ok(allocationAdminService.getByCode(codeDeclaration));
    }

    @PostMapping("/{codeDeclaration}/approve")
    public ResponseEntity<AllocationAdminResponse> approve(
            @PathVariable String codeDeclaration,
            @RequestBody DecisionAllocationRequest request
    ) {
        return ResponseEntity.ok(allocationAdminService.approve(codeDeclaration, request));
    }

    @PostMapping("/{codeDeclaration}/reject")
    public ResponseEntity<AllocationAdminResponse> reject(
            @PathVariable String codeDeclaration,
            @RequestBody DecisionAllocationRequest request
    ) {
        return ResponseEntity.ok(allocationAdminService.reject(codeDeclaration, request));
    }

    @PostMapping("/{codeDeclaration}/transfer-received")
    public ResponseEntity<AllocationAdminResponse> transferReceived(
            @PathVariable String codeDeclaration,
            @RequestBody DecisionAllocationRequest request
    ) {
        return ResponseEntity.ok(allocationAdminService.confirmTransfer(codeDeclaration, request));
    }

    @PostMapping("/{codeDeclaration}/send-receipt")
    public ResponseEntity<AllocationAdminResponse> sendReceipt(@PathVariable String codeDeclaration) {
        return ResponseEntity.ok(allocationAdminService.sendReceipt(codeDeclaration));
    }

    @PostMapping("/{codeDeclaration}/close-without-followup")
    public ResponseEntity<AllocationAdminResponse> closeWithoutFollowUp(
            @PathVariable String codeDeclaration
    ) {
        return ResponseEntity.ok(allocationAdminService.closeWithoutFollowUp(codeDeclaration));
    }

    @GetMapping("/{codeDeclaration}/documents/{documentId}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable String codeDeclaration,
            @PathVariable String documentId
    ) {
        Resource resource = allocationAdminService.loadDocument(codeDeclaration, documentId);
        String fileName = Paths.get(resource.getFilename() != null ? resource.getFilename() : documentId + ".pdf")
                .getFileName().toString();
        return ResponseEntity.ok()
                .contentType(allocationAdminService.resolveMediaType(fileName))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }
}
