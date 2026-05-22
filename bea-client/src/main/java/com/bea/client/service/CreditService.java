package com.bea.client.service;

import com.bea.client.dto.DocumentDto;
import com.bea.client.dto.credit.CreditContextResponse;
import com.bea.client.dto.credit.CreditRequestResponse;
import com.bea.client.dto.credit.CreditSubmissionRequest;
import com.bea.client.model.Client;
import com.bea.client.model.Credit;
import com.bea.client.repository.CreditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditService {

    private static final Path STORAGE_ROOT = Paths.get("uploads", "credit");
    private static final String STATUS_PENDING = "EN_ATTENTE";
    private static final String STATUS_REJECTED = "REJETE";

    private final CreditRepository creditRepository;

    @Value("${bea.public-base-url:http://localhost:8081}")
    private String publicBaseUrl;

    public CreditContextResponse getContext(Client client) {
        List<Credit> history = creditRepository.findByCodeUtilisateurOrderByDateOuvertureDossierDesc(client.getCli());
        Credit latest = history.stream().findFirst().orElse(null);

        BigDecimal averageMonthlySalary = history.stream()
                .map(Credit::getSalaireMensuel)
                .filter(value -> value != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (!history.isEmpty()) {
            averageMonthlySalary = averageMonthlySalary.divide(BigDecimal.valueOf(history.size()), 2, RoundingMode.HALF_UP);
        }

        return CreditContextResponse.builder()
                .cli(client.getCli())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .nin(client.getNin())
                .agence(client.getAgence())
                .dateNaissance(client.getDateNaissance())
                .lieuNaissance(client.getLieuNaissance())
                .latestRequest(latest == null ? null : toResponse(client, latest))
                .hasPendingRequest(history.stream().anyMatch(credit -> STATUS_PENDING.equalsIgnoreCase(credit.getEtatDossier())))
                .averageMonthlySalary(averageMonthlySalary)
                .build();
    }

    public List<CreditRequestResponse> getHistory(Client client) {
        return creditRepository.findByCodeUtilisateurOrderByDateOuvertureDossierDesc(client.getCli()).stream()
                .map(credit -> toResponse(client, credit))
                .toList();
    }

    public CreditRequestResponse getRequest(Client client, String numeroDossier) {
        Credit credit = creditRepository.findById(numeroDossier)
                .orElseThrow(() -> new IllegalArgumentException("Credit request not found"));
        if (!client.getCli().equals(credit.getCodeUtilisateur())) {
            throw new IllegalArgumentException("Credit request not found");
        }
        return toResponse(client, credit);
    }

    public CreditRequestResponse submit(Client client, CreditSubmissionRequest request) {
        validate(request);

        boolean rejected = request.getRequestedAmount().compareTo(BigDecimal.valueOf(5000)) < 0
                || request.getDurationMonths() < 6
                || !request.getRequestedAmount().remainder(BigDecimal.valueOf(50)).equals(BigDecimal.ZERO)
                || !meetsAffordabilityRules(request);

        String numeroDossier = generateNumeroDossier();
        String status = rejected ? STATUS_REJECTED : STATUS_PENDING;
        String rejectionReason = rejected ? buildRejectionReason(request) : null;

        Credit credit = new Credit();
        credit.setNumeroDossier(numeroDossier);
        credit.setAgence(client.getAgence());
        credit.setCodeClient(client.getCli());
        credit.setNumeroConvention("CONV" + numeroDossier.substring(3));
        credit.setTypePret(request.getCreditType().trim().toUpperCase());
        credit.setMontantPret(request.getRequestedAmount().setScale(2, RoundingMode.HALF_UP));
        credit.setMontantBien(request.getPropertyValue() == null ? null : request.getPropertyValue().setScale(2, RoundingMode.HALF_UP));
        credit.setSalaireMensuel(request.getMonthlySalary().setScale(2, RoundingMode.HALF_UP));
        credit.setDureeMois(request.getDurationMonths());
        credit.setStatutTravail(request.getWorkStatus().trim());
        credit.setCodeUtilisateur(client.getCli());
        credit.setDateOuvertureDossier(LocalDate.now());
        credit.setDateModificationDossier(LocalDate.now());
        credit.setMotifRejet(rejectionReason);
        credit.setEtatDossier(status);
        credit.setDateDernierEtat(LocalDate.now());

        String dossierFolder = credit.getNumeroDossier();
        credit.setSalarySlipPath(storeFile(client, dossierFolder, "salary-slip", request.getSalarySlip()));
        credit.setWorkCertificatePath(storeFile(client, dossierFolder, "work-certificate", request.getWorkCertificate()));
        credit.setIdDocumentPath(storeFile(client, dossierFolder, "id-document", request.getIdDocument()));

        Credit saved = creditRepository.save(credit);
        return toResponse(client, saved);
    }

    private void validate(CreditSubmissionRequest request) {
        if (!StringUtils.hasText(request.getCreditType())) {
            throw new IllegalArgumentException("Credit type is required");
        }
        if (request.getRequestedAmount() == null || request.getRequestedAmount().compareTo(BigDecimal.valueOf(5000)) < 0) {
            throw new IllegalArgumentException("Requested amount must be at least 5,000 DZD");
        }
        if (request.getMonthlySalary() == null || request.getMonthlySalary().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Monthly salary is required");
        }
        if (request.getDurationMonths() == null || request.getDurationMonths() < 6) {
            throw new IllegalArgumentException("Duration must be at least 6 months");
        }
        if (!StringUtils.hasText(request.getWorkStatus())) {
            throw new IllegalArgumentException("Work status is required");
        }
        if (request.getSalarySlip() == null || request.getSalarySlip().isEmpty()) {
            throw new IllegalArgumentException("Salary slips are required");
        }
        if (request.getWorkCertificate() == null || request.getWorkCertificate().isEmpty()) {
            throw new IllegalArgumentException("Work certificate is required");
        }
        if (request.getIdDocument() == null || request.getIdDocument().isEmpty()) {
            throw new IllegalArgumentException("ID document is required");
        }
        if ("immobilier".equalsIgnoreCase(request.getCreditType())
                && (request.getPropertyValue() == null || request.getPropertyValue().compareTo(BigDecimal.ZERO) <= 0)) {
            throw new IllegalArgumentException("Property value is required for immobilier credit");
        }
    }

    private boolean meetsAffordabilityRules(CreditSubmissionRequest request) {
        BigDecimal propertyValue = request.getPropertyValue() == null ? BigDecimal.ZERO : request.getPropertyValue();
        BigDecimal estimatedInstallment = request.getRequestedAmount()
                .divide(BigDecimal.valueOf(request.getDurationMonths()), 2, RoundingMode.HALF_UP);

        if ("immobilier".equalsIgnoreCase(request.getCreditType()) && request.getRequestedAmount().compareTo(propertyValue.multiply(BigDecimal.valueOf(0.8))) > 0) {
            return false;
        }

        BigDecimal ratio = "immobilier".equalsIgnoreCase(request.getCreditType()) ? BigDecimal.valueOf(2) : BigDecimal.valueOf(2.5);
        return request.getMonthlySalary().compareTo(estimatedInstallment.multiply(ratio)) >= 0;
    }

    private String buildRejectionReason(CreditSubmissionRequest request) {
        StringBuilder reason = new StringBuilder();
        if (request.getRequestedAmount().compareTo(BigDecimal.valueOf(5000)) < 0) {
            reason.append("Requested amount below minimum. ");
        }
        if (request.getDurationMonths() < 6) {
            reason.append("Duration below minimum. ");
        }
        if (!request.getRequestedAmount().remainder(BigDecimal.valueOf(50)).equals(BigDecimal.ZERO)) {
            reason.append("Amount must be a multiple of 50. ");
        }
        if ("immobilier".equalsIgnoreCase(request.getCreditType())
                && request.getPropertyValue() != null
                && request.getRequestedAmount().compareTo(request.getPropertyValue().multiply(BigDecimal.valueOf(0.8))) > 0) {
            reason.append("Requested amount exceeds 80% of property value. ");
        }
        BigDecimal estimatedInstallment = request.getRequestedAmount().divide(BigDecimal.valueOf(request.getDurationMonths()), 2, RoundingMode.HALF_UP);
        BigDecimal requiredSalary = estimatedInstallment.multiply("immobilier".equalsIgnoreCase(request.getCreditType()) ? BigDecimal.valueOf(2) : BigDecimal.valueOf(2.5));
        if (request.getMonthlySalary().compareTo(requiredSalary) < 0) {
            reason.append("Monthly salary too low for installment. ");
        }
        return reason.toString().trim();
    }

    private String generateNumeroDossier() {
        return "DOS" + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }

    private String storeFile(Client client, String dossier, String prefix, MultipartFile file) {
        try {
            Path folder = STORAGE_ROOT.resolve(client.getCli()).resolve(dossier);
            Files.createDirectories(folder);

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (StringUtils.hasText(originalFilename) && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            }

                String fileName = prefix + extension;
                Path target = folder.resolve(fileName);
                Files.write(target, file.getBytes());
                // return a web-friendly relative path (uploads/credit/<client>/<dossier>/<file>)
                return String.join("/", "uploads", "credit", client.getCli(), dossier, fileName);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to store uploaded file", exception);
        }
    }

    private CreditRequestResponse toResponse(Client client, Credit credit) {
        return CreditRequestResponse.builder()
                .numeroDossier(credit.getNumeroDossier())
                .cli(client.getCli())
                .codeClient(credit.getCodeClient())
                .agence(credit.getAgence())
                .numeroConvention(credit.getNumeroConvention())
                .creditType(credit.getTypePret())
                .requestedAmount(credit.getMontantPret())
                .propertyValue(credit.getMontantBien())
                .monthlySalary(credit.getSalaireMensuel())
                .workStatus(credit.getStatutTravail())
                .durationMonths(credit.getDureeMois())
                .estimatedMonthlyPayment(credit.getDureeMois() == null || credit.getDureeMois() == 0 ? BigDecimal.ZERO : credit.getMontantPret().divide(BigDecimal.valueOf(credit.getDureeMois()), 2, RoundingMode.HALF_UP))
                .etatDossier(credit.getEtatDossier())
                .dateOuvertureDossier(credit.getDateOuvertureDossier())
                .dateModificationDossier(credit.getDateModificationDossier())
                .dateDernierEtat(credit.getDateDernierEtat())
                .motifRejet(credit.getMotifRejet())
                .salarySlipPath(credit.getSalarySlipPath())
                .workCertificatePath(credit.getWorkCertificatePath())
                .idDocumentPath(credit.getIdDocumentPath())
                .documents(buildDocuments(credit))
                .build();
    }

    private java.util.List<DocumentDto> buildDocuments(Credit credit) {
        java.util.List<DocumentDto> documents = new ArrayList<>();
        addDocument(documents, "id-document", "Pièce d'identité", credit.getIdDocumentPath());
        addDocument(documents, "salary-slip", "Bulletin de salaire", credit.getSalarySlipPath());
        addDocument(documents, "work-certificate", "Attestation de travail", credit.getWorkCertificatePath());
        return documents;
    }

    private void addDocument(java.util.List<DocumentDto> documents, String id, String label, String path) {
        if (!StringUtils.hasText(path)) {
            return;
        }

        String fileName = Paths.get(path).getFileName().toString();
        documents.add(DocumentDto.builder()
                .id(id)
                .label(label)
                .fileName(fileName)
                .contentType(resolveContentType(fileName))
                .downloadUrl(buildPublicUrl(path))
                .build());
    }

    private String buildPublicUrl(String path) {
        String normalizedBase = publicBaseUrl.replaceAll("/$", "");
        String normalizedPath = path.startsWith("/") ? path.substring(1) : path;
        return normalizedBase + "/" + normalizedPath;
    }

    private String resolveContentType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".pdf")) {
            return "application/pdf";
        }
        if (lower.endsWith(".png")) {
            return "image/png";
        }
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        if (lower.endsWith(".webp")) {
            return "image/webp";
        }
        return "application/octet-stream";
    }
}
