package com.bea.admin.service;

import com.bea.admin.dto.AuditEntryDto;
import com.bea.admin.dto.CreditAdminResponse;
import com.bea.admin.dto.DecisionCreditRequest;
import com.bea.admin.dto.DocumentDto;
import com.bea.admin.model.Client;
import com.bea.admin.model.Credit;
import com.bea.admin.model.User;
import com.bea.admin.repository.ClientRepository;
import com.bea.admin.repository.CreditRepository;
import lombok.RequiredArgsConstructor;
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
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditAdminService {

    public static final String EN_ATTENTE = "EN_ATTENTE";
    public static final String APPROUVE_RDV = "APPROUVE_RDV";
    public static final String REJETE = "REJETE";

    private final CreditRepository creditRepository;
    private final ClientRepository clientRepository;

    @Value("${bea.uploads.root:../bea-client/uploads}")
    private String uploadsRoot;

    @Value("${bea.public-base-url:http://localhost:8080}")
    private String publicBaseUrl;

    @Transactional(readOnly = true)
    public List<CreditAdminResponse> listAll() {
        return creditRepository.findAllByOrderByDateOuvertureDossierDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CreditAdminResponse getByNumero(String numeroDossier) {
        Credit credit = creditRepository.findById(numeroDossier)
                .orElseThrow(() -> new RuntimeException("Dossier crédit introuvable"));
        return toResponse(credit);
    }

    @Transactional
    public CreditAdminResponse approve(String numeroDossier, DecisionCreditRequest request) {
        Credit credit = requireCredit(numeroDossier);
        if (!EN_ATTENTE.equalsIgnoreCase(normalizeStatus(credit.getEtatDossier()))) {
            throw new RuntimeException("Seuls les dossiers en attente peuvent être approuvés");
        }
        if (!StringUtils.hasText(request.getAppointmentAt())) {
            throw new RuntimeException("La date du rendez-vous est obligatoire");
        }
        if (!StringUtils.hasText(request.getAppointmentNote())) {
            throw new RuntimeException("Les instructions pour le rendez-vous sont obligatoires");
        }

        LocalDateTime appointmentAt = parseAppointmentAt(request.getAppointmentAt());
        String agent = currentAgentName();
        credit.setEtatDossier(APPROUVE_RDV);
        credit.setAppointmentAt(appointmentAt);
        credit.setAppointmentNote(request.getAppointmentNote().trim());
        credit.setProcessedBy(agent);
        credit.setMotifRejet(null);
        credit.setDateModificationDossier(LocalDate.now());
        credit.setDateDernierEtat(LocalDate.now());

        return toResponse(creditRepository.save(credit));
    }

    @Transactional
    public CreditAdminResponse reject(String numeroDossier, DecisionCreditRequest request) {
        Credit credit = requireCredit(numeroDossier);
        if (!EN_ATTENTE.equalsIgnoreCase(normalizeStatus(credit.getEtatDossier()))) {
            throw new RuntimeException("Seuls les dossiers en attente peuvent être rejetés");
        }
        if (!StringUtils.hasText(request.getObservation())) {
            throw new RuntimeException("Le motif de rejet est obligatoire");
        }

        String agent = currentAgentName();
        credit.setEtatDossier(REJETE);
        credit.setMotifRejet(request.getObservation().trim());
        credit.setProcessedBy(agent);
        credit.setAppointmentAt(null);
        credit.setAppointmentNote(null);
        credit.setDateModificationDossier(LocalDate.now());
        credit.setDateDernierEtat(LocalDate.now());

        return toResponse(creditRepository.save(credit));
    }

    @Transactional(readOnly = true)
    public Resource loadDocument(String numeroDossier, String documentId) {
        Credit credit = requireCredit(numeroDossier);
        String pathValue = switch (documentId) {
            case "id-document" -> credit.getIdDocumentPath();
            case "salary-slip" -> credit.getSalarySlipPath();
            case "work-certificate" -> credit.getWorkCertificatePath();
            default -> throw new RuntimeException("Document inconnu");
        };
        if (!StringUtils.hasText(pathValue)) {
            throw new RuntimeException("Document non disponible");
        }
        try {
            Path path = resolveStoredFilePath(pathValue);
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                resource = new UrlResource(Paths.get(pathValue).toAbsolutePath().normalize().toUri());
            }
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Fichier introuvable");
            }
            return resource;
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de charger le document", ex);
        }
    }

    private Path resolveStoredFilePath(String pathValue) {
        Path candidate = Paths.get(pathValue).normalize();
        if (candidate.isAbsolute()) {
            return candidate;
        }

        Path uploadsRootPath = Paths.get(uploadsRoot).toAbsolutePath().normalize();
        if (candidate.startsWith(Paths.get("uploads"))) {
            candidate = uploadsRootPath.resolve(Paths.get("uploads").relativize(candidate)).normalize();
        } else {
            candidate = uploadsRootPath.resolve(candidate).normalize();
        }

        return candidate.toAbsolutePath().normalize();
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

    private Credit requireCredit(String numeroDossier) {
        return creditRepository.findById(numeroDossier)
                .orElseThrow(() -> new RuntimeException("Dossier crédit introuvable"));
    }

    private String currentAgentName() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user.getPrenom() + " " + user.getNom();
        }
        return "Agent";
    }

    private CreditAdminResponse toResponse(Credit credit) {
        Client client = clientRepository.findById(credit.getCodeClient()).orElse(null);
        String clientName = client == null
                ? credit.getCodeClient()
                : (client.getPrenom() + " " + client.getNom()).trim();
        String email = client != null ? client.getEmail() : null;

        return CreditAdminResponse.builder()
                .id(credit.getNumeroDossier())
                .numeroDossier(credit.getNumeroDossier())
                .clientName(clientName)
                .clientEmail(email)
                .codeClient(credit.getCodeClient())
                .typePret(credit.getTypePret())
                .montantPret(credit.getMontantPret())
                .dureeMois(credit.getDureeMois())
                .salaireMensuel(credit.getSalaireMensuel())
                .status(normalizeStatus(credit.getEtatDossier()))
                .documents(buildDocuments(credit))
                .motifRejet(credit.getMotifRejet())
                .appointmentAt(credit.getAppointmentAt() != null
                        ? credit.getAppointmentAt().toString()
                        : null)
                .appointmentNote(credit.getAppointmentNote())
                .processedBy(credit.getProcessedBy())
                .history(buildHistory(credit))
                .createdAt(credit.getDateOuvertureDossier() != null
                        ? credit.getDateOuvertureDossier().atStartOfDay().toString()
                        : null)
                .build();
    }

    private List<DocumentDto> buildDocuments(Credit credit) {
        List<DocumentDto> docs = new ArrayList<>();
        String numero = credit.getNumeroDossier();
        addDocument(docs, "id-document", "Pièce d'identité", credit.getIdDocumentPath(), numero);
        addDocument(docs, "salary-slip", "Bulletin de salaire", credit.getSalarySlipPath(), numero);
        addDocument(docs, "work-certificate", "Attestation de travail", credit.getWorkCertificatePath(), numero);
        return docs;
    }

    private void addDocument(
            List<DocumentDto> docs,
            String id,
            String label,
            String path,
            String numero
    ) {
        if (!StringUtils.hasText(path)) {
            return;
        }
        docs.add(DocumentDto.builder()
                .id(id)
                .label(label)
                .fileName(Paths.get(path).getFileName().toString())
                .contentType(resolveMediaType(Paths.get(path).getFileName().toString()).toString())
                .downloadUrl("/api/credits/" + numero + "/documents/" + id)
                .build());
    }

    private List<AuditEntryDto> buildHistory(Credit credit) {
        List<AuditEntryDto> history = new ArrayList<>();
        if (credit.getDateOuvertureDossier() != null) {
            history.add(AuditEntryDto.builder()
                    .id("open")
                    .at(credit.getDateOuvertureDossier().atStartOfDay().toString())
                    .by("Système")
                    .action("Dossier ouvert")
                    .build());
        }
        if (APPROUVE_RDV.equalsIgnoreCase(normalizeStatus(credit.getEtatDossier()))
                && credit.getAppointmentAt() != null) {
            history.add(AuditEntryDto.builder()
                    .id("approve")
                    .at(credit.getAppointmentAt().toString())
                    .by(credit.getProcessedBy())
                    .action("Approbation")
                    .detail(credit.getAppointmentNote())
                    .build());
        }
        if (REJETE.equalsIgnoreCase(normalizeStatus(credit.getEtatDossier()))) {
            history.add(AuditEntryDto.builder()
                    .id("reject")
                    .at(credit.getDateDernierEtat() != null
                            ? credit.getDateDernierEtat().atStartOfDay().toString()
                            : LocalDateTime.now().toString())
                    .by(credit.getProcessedBy())
                    .action("Rejet")
                    .detail(credit.getMotifRejet())
                    .build());
        }
        return history;
    }

    private String normalizeStatus(String status) {
        return status == null ? EN_ATTENTE : status.trim().toUpperCase();
    }

    private LocalDateTime parseAppointmentAt(String value) {
        if (value.contains("T") && (value.endsWith("Z") || value.contains("+"))) {
            return Instant.parse(value).atZone(ZoneId.systemDefault()).toLocalDateTime();
        }
        return LocalDateTime.parse(value.length() > 16 ? value.substring(0, 16) : value);
    }
}
