package com.bea.admin.service;

import com.bea.admin.dto.AllocationAdminResponse;
import com.bea.admin.dto.AuditEntryDto;
import com.bea.admin.dto.DashboardStatsResponse;
import com.bea.admin.dto.DecisionAllocationRequest;
import com.bea.admin.dto.DocumentDto;
import com.bea.admin.model.Allocation;
import com.bea.admin.model.Client;
import com.bea.admin.model.User;
import com.bea.admin.repository.AllocationRepository;
import com.bea.admin.repository.ClientRepository;
import com.bea.admin.exception.DocumentNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AllocationAdminService {

    public static final String EN_ATTENTE = "EN_ATTENTE";
    public static final String APPROUVE_ATTENTE_VIREMENT = "APPROUVE_ATTENTE_VIR";
    public static final String LEGACY_APPROUVE_ATTENTE_VIREMENT = "APPROUVE_ATTENTE_VIREMENT";
    public static final String VIREMENT_RECU = "VIREMENT_RECU";
    public static final String RECU_ENVOYE = "RECU_ENVOYE";
    public static final String REJETE = "REJETE";
    public static final String SANS_SUITE = "SANS_SUITE";

    private static final Set<String> TERMINAL = Set.of(REJETE, SANS_SUITE, RECU_ENVOYE);

    private final AllocationRepository allocationRepository;
    private final ClientRepository clientRepository;

    @Value("${bea.uploads.root:../bea-client/uploads}")
    private String uploadsRoot;

    @Value("${bea.public-base-url:http://localhost:8080}")
    private String publicBaseUrl;

    @Transactional(readOnly = true)
    public List<AllocationAdminResponse> listAll() {
        applyAutoClosures();
        return allocationRepository.findAllByOrderByDateSaisieDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AllocationAdminResponse getByCode(String codeDeclaration) {
        applyAutoClosures();
        Allocation allocation = allocationRepository.findById(codeDeclaration)
                .orElseThrow(() -> new RuntimeException("Demande d'allocation introuvable"));
        return toResponse(allocation);
    }

    @Transactional
    public AllocationAdminResponse approve(String codeDeclaration, DecisionAllocationRequest request) {
        Allocation allocation = requireAllocation(codeDeclaration);
        String currentStatus = resolveStatus(allocation);
        if (isAwaitingTransferStatus(currentStatus)) {
            return toResponse(allocation);
        }
        if (!EN_ATTENTE.equalsIgnoreCase(currentStatus)) {
            throw new RuntimeException("Seules les demandes en attente peuvent être approuvées (statut actuel: " + currentStatus + ")");
        }
        requireObservation(request);

        String agent = currentAgentName();
        LocalDate today = LocalDate.now();
        allocation.setStatu(APPROUVE_ATTENTE_VIREMENT);
        allocation.setEtat(APPROUVE_ATTENTE_VIREMENT);
        allocation.setEve(APPROUVE_ATTENTE_VIREMENT);
        allocation.setObservation(request.getObservation().trim());
        allocation.setDateVerif(today);
        allocation.setVerifBy(agent);

        return toResponse(allocationRepository.save(allocation));
    }

    @Transactional
    public AllocationAdminResponse reject(String codeDeclaration, DecisionAllocationRequest request) {
        Allocation allocation = requireAllocation(codeDeclaration);
        if (!EN_ATTENTE.equalsIgnoreCase(resolveStatus(allocation))) {
            throw new RuntimeException("Seules les demandes en attente peuvent être rejetées");
        }
        requireObservation(request);

        String agent = currentAgentName();
        allocation.setStatu(REJETE);
        allocation.setEtat(REJETE);
        allocation.setEve(REJETE);
        allocation.setObservation(request.getObservation().trim());
        allocation.setDateVerif(LocalDate.now());
        allocation.setVerifBy(agent);

        return toResponse(allocationRepository.save(allocation));
    }

    @Transactional
    public AllocationAdminResponse confirmTransfer(String codeDeclaration, DecisionAllocationRequest request) {
        Allocation allocation = requireAllocation(codeDeclaration);
        if (!isAwaitingTransferStatus(resolveStatus(allocation))) {
            throw new RuntimeException("Le virement ne peut être confirmé qu'après approbation");
        }
        if (!StringUtils.hasText(request.getTransferReference())) {
            throw new RuntimeException("La référence du virement est obligatoire");
        }

        allocation.setStatu(VIREMENT_RECU);
        allocation.setEtat(VIREMENT_RECU);
        allocation.setEve(VIREMENT_RECU);
        allocation.setTransferReference(request.getTransferReference().trim());
        allocation.setDateVers(LocalDate.now());

        return toResponse(allocationRepository.save(allocation));
    }

    @Transactional
    public AllocationAdminResponse sendReceipt(String codeDeclaration) {
        Allocation allocation = requireAllocation(codeDeclaration);
        if (!VIREMENT_RECU.equalsIgnoreCase(resolveStatus(allocation))) {
            throw new RuntimeException("Le reçu ne peut être envoyé qu'après réception du virement");
        }

        String agent = currentAgentName();
        allocation.setStatu(RECU_ENVOYE);
        allocation.setEtat(RECU_ENVOYE);
        allocation.setEve(RECU_ENVOYE);
        allocation.setValidBy(agent);
        allocation.setDateAb(LocalDate.now());
        allocation.setAbBy(agent);

        return toResponse(allocationRepository.save(allocation));
    }

    @Transactional
    public AllocationAdminResponse closeWithoutFollowUp(String codeDeclaration) {
        Allocation allocation = requireAllocation(codeDeclaration);
        if (TERMINAL.contains(resolveStatus(allocation))) {
            throw new RuntimeException("Cette demande est déjà clôturée");
        }

        allocation.setStatu(SANS_SUITE);
        allocation.setEtat(SANS_SUITE);
        allocation.setEve(SANS_SUITE);

        return toResponse(allocationRepository.save(allocation));
    }

    @Transactional(readOnly = true)
    public Resource loadDocument(String codeDeclaration, String documentId) {
        Allocation allocation = requireAllocation(codeDeclaration);
        String normalizedDocumentId = normalizeDocumentId(documentId);
        String pathValue = switch (normalizedDocumentId) {
            case "passport-main" -> allocation.getPassportMainPagePath();
            case "passport-visa" -> allocation.getPassportVisaPagePath();
            case "passport-neant" -> allocation.getPassportNeantPagePath();
            case "ticket-copy" -> allocation.getTicketCopyPath();
            default -> throw new DocumentNotFoundException("Document inconnu: " + documentId);
        };
        if (!StringUtils.hasText(pathValue)) {
            throw new DocumentNotFoundException("Document non disponible: " + documentId);
        }
        try {
            Path path = resolveStoredFilePath(pathValue);
            boolean exists = java.nio.file.Files.exists(path);
            log.info("Loading allocation document codeDeclaration={} documentType={} storedPath={} resolvedPath={} exists={}",
                    codeDeclaration,
                    normalizedDocumentId,
                    pathValue,
                    path.toAbsolutePath().normalize(),
                    exists);
            if (!exists) {
                throw new DocumentNotFoundException("Fichier introuvable: " + path.toAbsolutePath().normalize());
            }
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new DocumentNotFoundException("Fichier introuvable: " + path.toAbsolutePath().normalize());
            }
            return resource;
        } catch (DocumentNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de charger le document", ex);
        }
    }

    private String normalizeDocumentId(String documentId) {
        if (!StringUtils.hasText(documentId)) {
            return "";
        }
        String normalized = documentId.trim().toLowerCase();
        if ("ticket".equals(normalized)) {
            return "ticket-copy";
        }
        return normalized;
    }

    private Path resolveStoredFilePath(String pathValue) {
        Path uploadsRootPath = Paths.get(uploadsRoot).toAbsolutePath().normalize();
        String normalized = pathValue.trim().replace('\\', '/');

        if (normalized.startsWith("/uploads/")) {
            return uploadsRootPath.resolve(normalized.substring("/uploads/".length())).normalize();
        }

        if (normalized.startsWith("uploads/")) {
            return uploadsRootPath.resolve(normalized.substring("uploads/".length())).normalize();
        }

        Path candidate = Paths.get(pathValue).normalize();
        if (candidate.isAbsolute()) {
            return candidate.toAbsolutePath().normalize();
        }

        return uploadsRootPath.resolve(candidate).normalize();
    }

    public MediaType resolveMediaType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        }
        if (lower.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    public DashboardStatsResponse buildStats(List<AllocationAdminResponse> allocations) {
        long pending = allocations.stream().filter(a -> EN_ATTENTE.equalsIgnoreCase(a.getStatus())).count();
        long awaiting = allocations.stream()
            .filter(a -> isAwaitingTransferStatus(a.getStatus())).count();
        long received = allocations.stream()
                .filter(a -> VIREMENT_RECU.equalsIgnoreCase(a.getStatus())).count();
        long urgent = allocations.stream()
                .filter(a -> isPastDeadline(a.getDepartureDate())
                        && !TERMINAL.contains(a.getStatus()))
                .count();
        return DashboardStatsResponse.builder()
                .allocPending(pending)
                .allocAwaitingTransfer(awaiting)
                .allocTransferReceived(received)
                .allocUrgent(urgent)
                .build();
    }

    @Transactional
    protected void applyAutoClosures() {
        LocalDateTime now = LocalDateTime.now();
        for (Allocation allocation : allocationRepository.findAll()) {
            if (TERMINAL.contains(resolveStatus(allocation))) {
                continue;
            }
            if (allocation.getDateAllez() == null) {
                continue;
            }
            LocalDateTime deadline = allocation.getDateAllez().atStartOfDay().minusHours(72);
            if (now.isAfter(deadline)) {
                allocation.setStatu(SANS_SUITE);
                allocation.setEtat(SANS_SUITE);
                allocation.setEve(SANS_SUITE);
                allocationRepository.save(allocation);
            }
        }
    }

    private Allocation requireAllocation(String codeDeclaration) {
        return allocationRepository.findById(codeDeclaration)
                .orElseThrow(() -> new RuntimeException("Demande d'allocation introuvable"));
    }

    private void requireObservation(DecisionAllocationRequest request) {
        if (request == null || !StringUtils.hasText(request.getObservation())) {
            throw new RuntimeException("L'observation est obligatoire");
        }
    }

    private String currentAgentName() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user.getPrenom() + " " + user.getNom();
        }
        return "Agent";
    }

    private AllocationAdminResponse toResponse(Allocation allocation) {
        Client client = clientRepository.findById(allocation.getAddBy()).orElse(null);
        String clientName = buildName(allocation.getNomBenefi(), allocation.getPrenom());
        String email = allocation.getEmail();
        String phone = allocation.getPhone();
        if (client != null) {
            if (!StringUtils.hasText(email)) {
                email = client.getEmail();
            }
            if (!StringUtils.hasText(phone)) {
                phone = client.getPhone();
            }
            if (!StringUtils.hasText(clientName)) {
                clientName = buildName(client.getNom(), client.getPrenom());
            }
        }

        String status = resolveStatus(allocation);
        String code = allocation.getCodeDeclaration();

        return AllocationAdminResponse.builder()
                .id(code)
                .codeDeclaration(code)
                .clientName(clientName)
                .clientEmail(email)
                .clientPhone(phone)
                .nin(allocation.getNin())
                .passportNumber(allocation.getNumPasseport())
                .destination(allocation.getNomPays())
                .departureDate(formatDate(allocation.getDateAllez()))
                .returnDate(formatDate(allocation.getDateRetour()))
                .amountEur(allocation.getMontantEur())
                .amountDzd(allocation.getContreValeur() != null
                        ? allocation.getContreValeur()
                        : allocation.getMontantTotal())
                .currency(StringUtils.hasText(allocation.getCodeMonnaie())
                        ? allocation.getCodeMonnaie()
                        : allocation.getMoannaie())
                .status(status)
                .documents(buildDocuments(allocation))
                .observation(allocation.getObservation())
                .transferReference(allocation.getTransferReference())
                .receiptSignedAt(allocation.getDateAb() != null
                        ? allocation.getDateAb().atStartOfDay().toString()
                        : null)
                .verifiedBy(allocation.getVerifBy())
                .history(buildHistory(allocation))
                .createdAt(formatDateTime(allocation.getDateSaisie()))
                .build();
    }

    private List<DocumentDto> buildDocuments(Allocation allocation) {
        List<DocumentDto> docs = new ArrayList<>();
        addDocument(docs, "passport-main", "Passeport (page principale)", allocation.getPassportMainPagePath());
        addDocument(docs, "passport-visa", "Passeport (visa / néant)", allocation.getPassportVisaPagePath());
        addDocument(docs, "passport-neant", "Passeport (néant)", allocation.getPassportNeantPagePath());
        addDocument(docs, "ticket", "Billet / réservation", allocation.getTicketCopyPath());
        return docs;
    }

    private void addDocument(
            List<DocumentDto> docs,
            String id,
            String label,
            String path
    ) {
        if (!StringUtils.hasText(path)) {
            return;
        }
        Path resolvedPath = resolveStoredFilePath(path);
        if (!java.nio.file.Files.exists(resolvedPath)) {
            log.warn("Skipping missing allocation document id={} label={} storedPath={} resolvedPath={}",
                    id,
                    label,
                    path,
                    resolvedPath.toAbsolutePath().normalize());
            return;
        }
        String fileName = Paths.get(path).getFileName().toString();
        String downloadUrl = buildPublicUrl(path);
        log.info("Prepared allocation document id={} label={} fileName={} storedPath={} resolvedPath={} downloadUrl={}",
                id,
                label,
                fileName,
                path,
                resolvedPath.toAbsolutePath().normalize(),
                downloadUrl);
        docs.add(DocumentDto.builder()
                .id(id)
                .label(label)
                .fileName(fileName)
                .contentType(resolveMediaType(fileName).toString())
                .downloadUrl(downloadUrl)
                .build());
    }

    private String buildPublicUrl(String path) {
        String normalizedBase = publicBaseUrl.replaceAll("/$", "");
        String normalizedPath = path.startsWith("/") ? path.substring(1) : path;
        return normalizedBase + "/" + normalizedPath;
    }

    private List<AuditEntryDto> buildHistory(Allocation allocation) {
        List<AuditEntryDto> history = new ArrayList<>();
        if (allocation.getDateSaisie() != null) {
            history.add(entry("Demande reçue", allocation.getDateSaisie().atStartOfDay(), "Système", null));
        }
        if (allocation.getDateVerif() != null && StringUtils.hasText(allocation.getVerifBy())) {
            String action = REJETE.equalsIgnoreCase(normalizeStatus(allocation.getStatu()))
                    ? "Rejet"
                    : "Approbation (1er vérificateur)";
            history.add(entry(action, allocation.getDateVerif().atStartOfDay(), allocation.getVerifBy(),
                    allocation.getObservation()));
        }
        if (allocation.getDateVers() != null) {
            history.add(entry("Virement reçu", allocation.getDateVers().atStartOfDay(), allocation.getVerifBy(),
                    allocation.getTransferReference() != null
                            ? "Réf. " + allocation.getTransferReference()
                            : null));
        }
        if (allocation.getDateAb() != null && StringUtils.hasText(allocation.getValidBy())) {
            history.add(entry("Reçu de versement envoyé", allocation.getDateAb().atStartOfDay(),
                    allocation.getValidBy(), "Signature électronique"));
        }
        if (SANS_SUITE.equalsIgnoreCase(normalizeStatus(allocation.getStatu()))) {
            history.add(entry("Classé sans suite", LocalDateTime.now(), "Système",
                    "Délai 72 h avant départ dépassé"));
        }
        return history;
    }

    private AuditEntryDto entry(String action, LocalDateTime at, String by, String detail) {
        return AuditEntryDto.builder()
                .id(action + at)
                .at(at.toString())
                .by(by)
                .action(action)
                .detail(detail)
                .build();
    }

    private String normalizeStatus(String status) {
        if (status == null) {
            return EN_ATTENTE;
        }
        String normalized = status.trim().toUpperCase();
        if (LEGACY_APPROUVE_ATTENTE_VIREMENT.equals(normalized)) {
            return APPROUVE_ATTENTE_VIREMENT;
        }
        if ("EN ATTENTE".equals(normalized) || "EN-ATTENTE".equals(normalized)) {
            return EN_ATTENTE;
        }
        return normalized;
    }

    private String resolveStatus(Allocation allocation) {
        if (StringUtils.hasText(allocation.getStatu())) {
            return normalizeStatus(allocation.getStatu());
        }
        if (StringUtils.hasText(allocation.getEtat())) {
            return normalizeStatus(allocation.getEtat());
        }
        if (StringUtils.hasText(allocation.getEve())) {
            return normalizeStatus(allocation.getEve());
        }
        return EN_ATTENTE;
    }

    private boolean isAwaitingTransferStatus(String status) {
        if (status == null) {
            return false;
        }
        String normalized = status.trim().toUpperCase();
        return APPROUVE_ATTENTE_VIREMENT.equals(normalized)
                || LEGACY_APPROUVE_ATTENTE_VIREMENT.equals(normalized);
    }

    private String buildName(String nom, String prenom) {
        String n = nom == null ? "" : nom.trim();
        String p = prenom == null ? "" : prenom.trim();
        return (p + " " + n).trim();
    }

    private String formatDate(LocalDate date) {
        return date == null ? null : date.toString();
    }

    private String formatDateTime(LocalDate date) {
        return date == null ? null : date.atStartOfDay().toString();
    }

    private boolean isPastDeadline(String departureDate) {
        if (!StringUtils.hasText(departureDate)) {
            return false;
        }
        LocalDate departure = LocalDate.parse(departureDate);
        return LocalDateTime.now().isAfter(departure.atStartOfDay().minusHours(72));
    }
}
