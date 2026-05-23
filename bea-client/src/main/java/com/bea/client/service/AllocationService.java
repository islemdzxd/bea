package com.bea.client.service;

import com.bea.client.dto.DocumentDto;
import com.bea.client.dto.allocation.AllocationContextResponse;
import com.bea.client.dto.allocation.AllocationRequestResponse;
import com.bea.client.dto.allocation.AllocationSubmissionRequest;
import com.bea.client.model.Allocation;
import com.bea.client.model.Client;
import com.bea.client.repository.AllocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AllocationService {

    private static final String STATUS_PENDING = "EN_ATTENTE";
    private static final BigDecimal ADULT_LIMIT = BigDecimal.valueOf(750);
    private static final BigDecimal MINOR_LIMIT = BigDecimal.valueOf(300);

    private final AllocationRepository allocationRepository;

    @Value("${bea.public-base-url:http://localhost:8081}")
    private String publicBaseUrl;

    @Value("${bea.uploads.root:uploads}")
    private String uploadsRoot;

    public AllocationContextResponse getContext(Client client) {
        List<Allocation> history = allocationRepository.findByAddByOrderByDateSaisieDesc(client.getCli());
        Allocation latest = history.stream().findFirst().orElse(null);

        return AllocationContextResponse.builder()
                .cli(client.getCli())
                .nin(client.getNin())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .dateNaissance(client.getDateNaissance())
                .lieuNaissance(client.getLieuNaissance())
                .agence(client.getAgence())
                .alreadyUsedThisYear(!history.isEmpty() && history.stream().anyMatch(allocation -> allocation.getDateSaisie() != null && allocation.getDateSaisie().getYear() == LocalDate.now().getYear()))
                .latestRequest(latest == null ? null : toResponse(client, latest))
                .build();
    }

    public List<AllocationRequestResponse> getHistory(Client client) {
        return allocationRepository.findByAddByOrderByDateSaisieDesc(client.getCli()).stream()
                .map(allocation -> toResponse(client, allocation))
                .toList();
    }

    public AllocationRequestResponse getRequest(Client client, String codeDeclaration) {
        Allocation allocation = allocationRepository.findById(codeDeclaration)
                .orElseThrow(() -> new RuntimeException("Allocation request not found"));
        if (!client.getCli().equals(allocation.getAddBy())) {
            throw new RuntimeException("Allocation request not found");
        }
        return toResponse(client, allocation);
    }

    public List<String> getCliWithoutAllocationThisYear() {
        LocalDate yearStart = LocalDate.of(LocalDate.now().getYear(), 1, 1);
        LocalDate yearEnd = LocalDate.of(LocalDate.now().getYear(), 12, 31);
        return allocationRepository.findCliWithoutTouristAllocationBetween(yearStart, yearEnd);
    }

    public AllocationRequestResponse submit(Client client, AllocationSubmissionRequest request) {
        validateBusinessRules(client, request);

        String codeDeclaration = generateCodeDeclaration();
        Allocation allocation = new Allocation();
        allocation.setCodeDeclaration(codeDeclaration);
        allocation.setDateArrete(LocalDate.now());
        allocation.setCodeAgence(client.getAgence());
        allocation.setEtablissementDec("BEA");
        allocation.setNin(client.getNin());
        allocation.setDateOctroi(LocalDate.now());
        allocation.setNomBenefi(client.getNom());
        allocation.setPrenom(client.getPrenom());
        allocation.setCommuneNaissanceBenf(client.getLieuNaissance());
        allocation.setDateNaissanceBenf(client.getDateNaissance());
        allocation.setNumPasseport(request.getPassportNumber().trim().toUpperCase());
        allocation.setDelivPassp(request.getDateAllez().minusDays(30));
        allocation.setDExpPassp(request.getPassportExpiryDate());
        allocation.setCdMoyenTrans(normalizeTransportCode(request.getCdMoyenTrans(), request.getTravelType()));
        allocation.setMoyenTrans(normalizeTransportLabel(request.getMoyenTrans(), request.getTravelType()));
        allocation.setCodePostFrontalier(request.getCodePostFrontalier());
        allocation.setDesignationPostFr(request.getDesignationPostFr());
        allocation.setDateAllez(request.getDateAllez());
        allocation.setDateRetour(request.getDateRetour());
        allocation.setCodePays(request.getCodePays());
        allocation.setNomPays(request.getNomPays());
        allocation.setMoannaie(request.getCodeMonnaie());
        allocation.setMontantEur(request.getMontantTotal().setScale(2, RoundingMode.HALF_UP));
        allocation.setCours(BigDecimal.ONE.setScale(4, RoundingMode.HALF_UP));
        allocation.setContreValeur(request.getMontantTotal().setScale(2, RoundingMode.HALF_UP));
        allocation.setAddBy(client.getCli());
        allocation.setEtat(STATUS_PENDING);
        allocation.setEve(STATUS_PENDING);
        allocation.setStatu(STATUS_PENDING);
        allocation.setCodeMonnaie(request.getCodeMonnaie());
        allocation.setMonChiffre(request.getMontantTotal().setScale(2, RoundingMode.HALF_UP));
        allocation.setCivility("Mr");
        allocation.setNorDre("ORD" + codeDeclaration.substring(3));
        allocation.setMontantLettre(request.getMontantTotal() + " " + request.getCodeMonnaie());
        allocation.setMonTotalLettre(request.getMontantTotal() + " " + request.getCodeMonnaie());
        allocation.setMontantTotal(request.getMontantTotal().setScale(2, RoundingMode.HALF_UP));
        allocation.setPhone(null);
        allocation.setEmail(null);
        allocation.setDateSaisie(LocalDate.now());
        allocation.setDateVerif(null);
        allocation.setDateVers(null);
        allocation.setObservation(blankToNull(request.getObservation()));
        allocation.setVerifBy(null);
        allocation.setValidBy(null);
        allocation.setDateAb(null);
        allocation.setAbBy(null);

        allocation.setPassportMainPagePath(storeFile("passport-main", request.getPassportMainPage()));
        allocation.setPassportVisaPagePath(storeFile("passport-visa", request.getPassportVisaPage()));
        allocation.setPassportNeantPagePath(storeFile("passport-neant", request.getPassportNeantPage()));
        allocation.setTicketCopyPath(storeFile("ticket-copy", request.getTicketCopy()));

        Allocation saved = allocationRepository.save(allocation);
        return toResponse(client, saved);
    }

    private void validateBusinessRules(Client client, AllocationSubmissionRequest request) {
        LocalDate today = LocalDate.now();
        LocalDate departureDate = requireDate(request.getDateAllez(), "Departure date is required");
        LocalDate returnDate = requireDate(request.getDateRetour(), "Return date is required");
        LocalDate passportExpiryDate = requireDate(request.getPassportExpiryDate(), "Passport expiration date is required");
        BigDecimal amount = requireAmount(request.getMontantTotal(), "Allocation amount is required");

        if (!StringUtils.hasText(client.getNin())) {
            throw new RuntimeException("Client NIN is missing");
        }

        if (ChronoUnit.DAYS.between(today, departureDate) < 5) {
            throw new RuntimeException("Departure date must be at least 5 calendar days from today");
        }

        if (!returnDate.isAfter(departureDate)) {
            throw new RuntimeException("Return date must be after departure date");
        }

        if (ChronoUnit.DAYS.between(departureDate, returnDate) < 7) {
            throw new RuntimeException("Stay duration must be at least 7 days");
        }

        if (!passportExpiryDate.isAfter(returnDate)) {
            throw new RuntimeException("Passport must remain valid throughout the trip");
        }

        if (request.getPassportMainPage() == null || request.getPassportMainPage().isEmpty()) {
            throw new RuntimeException("Passport main page is required");
        }

        if (request.getTicketCopy() == null || request.getTicketCopy().isEmpty()) {
            throw new RuntimeException("Travel ticket is required");
        }

        if (amount.remainder(BigDecimal.valueOf(50)).compareTo(BigDecimal.ZERO) != 0) {
            throw new RuntimeException("Allocation amount must be a multiple of 50");
        }

        BigDecimal limit = isAdult(client, departureDate) ? ADULT_LIMIT : MINOR_LIMIT;
        if (amount.compareTo(limit) > 0) {
            throw new RuntimeException("Allocation amount cannot exceed " + limit.toPlainString());
        }

        LocalDate yearStart = LocalDate.of(departureDate.getYear(), 1, 1);
        LocalDate yearEnd = LocalDate.of(departureDate.getYear(), 12, 31);
        if (allocationRepository.existsByNinAndDateSaisieBetween(client.getNin(), yearStart, yearEnd)) {
            throw new RuntimeException("This NIN has already used the tourist allocation for the current year");
        }

        if (!StringUtils.hasText(request.getCodePays()) || !StringUtils.hasText(request.getNomPays())) {
            throw new RuntimeException("Destination country is required");
        }

        if (!StringUtils.hasText(request.getPassportNumber())) {
            throw new RuntimeException("Passport number is required");
        }
    }

    private boolean isAdult(Client client, LocalDate departureDate) {
        if (client.getDateNaissance() == null) {
            return true;
        }
        return ChronoUnit.YEARS.between(client.getDateNaissance(), departureDate) >= 19;
    }

    private LocalDate requireDate(LocalDate date, String message) {
        if (date == null) {
            throw new RuntimeException(message);
        }
        return date;
    }

    private BigDecimal requireAmount(BigDecimal amount, String message) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(message);
        }
        return amount.setScale(2, RoundingMode.HALF_UP);
    }

    private String generateCodeDeclaration() {
        return "DEC" + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }

    private String storeFile(String prefix, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            validateFileType(file, prefix);

            Path storageRootPath = Paths.get(uploadsRoot).toAbsolutePath().normalize();
            Path folder = storageRootPath.resolve(getStorageCategory(prefix));
            Files.createDirectories(folder);

            String originalFilename = file.getOriginalFilename();
            if (!StringUtils.hasText(originalFilename)) {
                originalFilename = "document";
            }
            String originalName = StringUtils.cleanPath(originalFilename);
            String extension = extractExtension(originalName);
            String baseName = extractBaseName(originalName);
            String fileName = System.currentTimeMillis() + "_" + prefix + "_" + baseName + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path target = folder.resolve(fileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            log.info("Stored uploaded file prefix={} originalName={} savedPath={} exists={}",
                    prefix,
                    originalName,
                    target.toAbsolutePath().normalize(),
                    Files.exists(target));
            return String.join("/", "uploads", getStorageCategory(prefix), fileName);
        } catch (IOException exception) {
            throw new RuntimeException("Failed to store uploaded file", exception);
        }
    }

    private String getStorageCategory(String prefix) {
        return switch (prefix) {
            case "ticket-copy" -> "tickets";
            default -> "passports";
        };
    }

    private String extractExtension(String originalName) {
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalName.length() - 1) {
            return "";
        }
        return originalName.substring(dotIndex);
    }

    private String extractBaseName(String originalName) {
        int dotIndex = originalName.lastIndexOf('.');
        String baseName = dotIndex < 0 ? originalName : originalName.substring(0, dotIndex);
        String cleaned = baseName.replaceAll("[^A-Za-z0-9]+", "_").replaceAll("_+", "_");
        cleaned = cleaned.replaceAll("(^_+)|(_+$)", "");
        if (!StringUtils.hasText(cleaned)) {
            return "document";
        }
        return cleaned.toLowerCase(Locale.ROOT);
    }

    private void validateFileType(MultipartFile file, String prefix) {
        String contentType = file.getContentType();
        String originalName = file.getOriginalFilename();
        String normalizedContentType = contentType == null ? "" : contentType.toLowerCase(Locale.ROOT);
        String normalizedOriginalName = originalName == null ? "" : originalName.toLowerCase(Locale.ROOT);
        boolean accepted = normalizedContentType.startsWith("image/")
                || normalizedContentType.equals("application/pdf")
                || normalizedOriginalName.endsWith(".png")
                || normalizedOriginalName.endsWith(".jpg")
                || normalizedOriginalName.endsWith(".jpeg")
                || normalizedOriginalName.endsWith(".pdf");
        if (!accepted) {
            throw new RuntimeException("Invalid file type for " + prefix + ". Allowed: png, jpg, jpeg, pdf");
        }
    }

    private String normalizeTransportCode(String providedCode, String travelType) {
        if (StringUtils.hasText(providedCode)) {
            return providedCode.trim();
        }
        if (!StringUtils.hasText(travelType)) {
            return null;
        }
        return switch (travelType.trim().toLowerCase()) {
            case "airline" -> "AIR";
            case "maritime" -> "MAR";
            default -> travelType.trim().toUpperCase();
        };
    }

    private String normalizeTransportLabel(String providedLabel, String travelType) {
        if (StringUtils.hasText(providedLabel)) {
            return providedLabel.trim();
        }
        if (!StringUtils.hasText(travelType)) {
            return null;
        }
        return switch (travelType.trim().toLowerCase()) {
            case "airline" -> "AERIEN";
            case "maritime" -> "MARITIME";
            default -> travelType.trim().toUpperCase();
        };
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private AllocationRequestResponse toResponse(Client client, Allocation allocation) {
        return AllocationRequestResponse.builder()
                .codeDeclaration(allocation.getCodeDeclaration())
                .cli(client.getCli())
                .nin(allocation.getNin())
                .nomBenefi(allocation.getNomBenefi())
                .prenom(allocation.getPrenom())
                .communeNaissanceBenf(allocation.getCommuneNaissanceBenf())
                .dateNaissanceBenf(allocation.getDateNaissanceBenf())
                .numPasseport(allocation.getNumPasseport())
                .delivPassp(allocation.getDelivPassp())
                .dExpPassp(allocation.getDExpPassp())
                .dateAllez(allocation.getDateAllez())
                .dateRetour(allocation.getDateRetour())
                .codePays(allocation.getCodePays())
                .nomPays(allocation.getNomPays())
                .codeMonnaie(allocation.getCodeMonnaie())
                .cdMoyenTrans(allocation.getCdMoyenTrans())
                .moyenTrans(allocation.getMoyenTrans())
                .codePostFrontalier(allocation.getCodePostFrontalier())
                .designationPostFr(allocation.getDesignationPostFr())
                .montantTotal(allocation.getMontantTotal())
                .etat(allocation.getEtat())
                .statu(allocation.getStatu())
                .dateSaisie(allocation.getDateSaisie())
                .observation(allocation.getObservation())
                .passportMainPagePath(allocation.getPassportMainPagePath())
                .passportVisaPagePath(allocation.getPassportVisaPagePath())
                .passportNeantPagePath(allocation.getPassportNeantPagePath())
                .ticketCopyPath(allocation.getTicketCopyPath())
                .documents(buildDocuments(allocation))
                .build();
    }

    private java.util.List<DocumentDto> buildDocuments(Allocation allocation) {
        java.util.List<DocumentDto> documents = new ArrayList<>();
        addDocument(documents, "passport-main", "Passeport (page principale)", allocation.getPassportMainPagePath());
        addDocument(documents, "passport-visa", "Passeport (visa / néant)", allocation.getPassportVisaPagePath());
        addDocument(documents, "passport-neant", "Passeport (néant)", allocation.getPassportNeantPagePath());
        addDocument(documents, "ticket", "Billet / réservation", allocation.getTicketCopyPath());
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
