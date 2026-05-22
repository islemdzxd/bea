package com.bea.admin.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {

    @Id
    @Column(name = "numero_dossier", length = 20)
    private String numeroDossier;

    @Column(name = "agence", length = 10)
    private String agence;

    @Column(name = "code_client", length = 15)
    private String codeClient;

    @Column(name = "type_pret", length = 50)
    private String typePret;

    @Column(name = "montant_pret", precision = 15, scale = 2)
    private BigDecimal montantPret;

    @Column(name = "duree_mois")
    private Integer dureeMois;

    @Column(name = "salaire_mensuel", precision = 15, scale = 2)
    private BigDecimal salaireMensuel;

    @Column(name = "salary_slip_path", length = 255)
    private String salarySlipPath;

    @Column(name = "work_certificate_path", length = 255)
    private String workCertificatePath;

    @Column(name = "id_document_path", length = 255)
    private String idDocumentPath;

    @Column(name = "code_utilisateur", length = 50)
    private String codeUtilisateur;

    @Column(name = "date_ouverture_dossier")
    private LocalDate dateOuvertureDossier;

    @Column(name = "date_modification_dossier")
    private LocalDate dateModificationDossier;

    @Column(name = "motif_rejet", columnDefinition = "TEXT")
    private String motifRejet;

    @Column(name = "etat_dossier", length = 30)
    private String etatDossier;

    @Column(name = "date_dernier_etat")
    private LocalDate dateDernierEtat;

    @Column(name = "appointment_at")
    private LocalDateTime appointmentAt;

    @Column(name = "appointment_note", columnDefinition = "TEXT")
    private String appointmentNote;

    @Column(name = "processed_by", length = 50)
    private String processedBy;
}
