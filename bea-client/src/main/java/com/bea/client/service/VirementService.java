package com.bea.client.service;

import com.bea.client.dto.virement.VirementAccountResponse;
import com.bea.client.dto.virement.VirementContextResponse;
import com.bea.client.dto.virement.VirementResponse;
import com.bea.client.dto.virement.VirementSubmissionRequest;
import com.bea.client.model.Client;
import com.bea.client.model.Compte;
import com.bea.client.model.Mouvement;
import com.bea.client.model.Virement;
import com.bea.client.repository.CompteRepository;
import com.bea.client.repository.MouvementRepository;
import com.bea.client.repository.VirementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class VirementService {

	private static final String STATUS_COMPLETED = "COMPLETED";
	private static final DateTimeFormatter REFERENCE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

	private final CompteRepository compteRepository;
	private final MouvementRepository mouvementRepository;
	private final VirementRepository virementRepository;

	public VirementContextResponse getContext(Client client) {
		List<Compte> accounts = compteRepository.findByCodeUtilisateurOrderByDateOuvertureDesc(client.getCli());
		List<Virement> history = virementRepository.findByCodeUtilisateurOrderBySubmittedAtDesc(client.getCli());

		return VirementContextResponse.builder()
				.cli(client.getCli())
				.nom(client.getNom())
				.prenom(client.getPrenom())
				.accounts(accounts.stream().map(this::toAccountResponse).toList())
			.latestOrder(history.isEmpty() ? null : toResponse(history.get(0)))
				.build();
	}

	public List<VirementResponse> getHistory(Client client) {
		return virementRepository.findByCodeUtilisateurOrderBySubmittedAtDesc(client.getCli())
				.stream()
				.map(this::toResponse)
				.toList();
	}

	public VirementResponse getOrder(Client client, String reference) {
		Virement order = virementRepository.findById(Objects.requireNonNull(reference))
				.orElseThrow(() -> new IllegalArgumentException("Transfer order not found"));
		if (!client.getCli().equals(order.getCodeUtilisateur())) {
			throw new IllegalArgumentException("Transfer order not found");
		}
		return toResponse(order);
	}

	@Transactional
	public VirementResponse submit(Client client, VirementSubmissionRequest request) {
		validate(request);

		String debitAccountId = request.getDebitAccountId().trim();
		Compte account = compteRepository.findByNumeroCompteAndCodeUtilisateur(debitAccountId, client.getCli())
				.orElseThrow(() -> new IllegalArgumentException("Selected debit account was not found"));

		BigDecimal amount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
		if (account.getSoldeComptable() == null || account.getSoldeComptable().compareTo(amount) < 0) {
			throw new IllegalArgumentException("Insufficient balance for this transfer");
		}

		String reference = generateReference();
		LocalDate today = LocalDate.now();

		account.setSoldeComptable(account.getSoldeComptable().subtract(amount));
		if (account.getSoldeIndicatif() != null) {
			account.setSoldeIndicatif(account.getSoldeIndicatif().subtract(amount));
		}
		compteRepository.save(account);

		Virement order = new Virement();
		order.setReference(reference);
		order.setCodeUtilisateur(client.getCli());
		order.setDebitAccountNumber(account.getNumeroCompte());
		order.setBeneficiaryLastName(request.getBeneficiaryLastName().trim());
		order.setBeneficiaryFirstName(request.getBeneficiaryFirstName().trim());
		order.setBeneficiaryAddress(request.getAddress().trim());
		order.setBeneficiaryRib(normalizeRib(request.getRib()));
		order.setAmount(amount);
		order.setReason(blankToNull(request.getReason()));
		order.setDonorSignature(request.getSignature().trim());
		order.setStatus(STATUS_COMPLETED);
		order.setFailureReason(null);
		order.setSubmittedAt(today);
		order.setProcessedAt(today);
		virementRepository.save(order);

		Mouvement mouvement = new Mouvement();
		mouvement.setAgence(account.getAgence());
		mouvement.setCodeAgenceDestinatrice(account.getAgence());
		mouvement.setCodeAgenceEmetrice(account.getAgence());
		mouvement.setChapitreComptable("VIREMENT");
		mouvement.setDateComptable(today);
		mouvement.setCodeDevise(account.getCodeDevise());
		mouvement.setDateValeur(today);
		mouvement.setLibelle("VIREMENT A " + order.getBeneficiaryFirstName() + " " + order.getBeneficiaryLastName());
		mouvement.setMontant(amount);
		mouvement.setNumeroCompte(account.getNumeroCompte());
		mouvement.setNumeroCompteRapprochement(null);
		mouvement.setCodeOperation("VIR");
		mouvement.setSens("D");
		mouvement.setCodeUtilisateur(client.getCli());
		mouvementRepository.save(mouvement);

		return toResponse(order);
	}

	private void validate(VirementSubmissionRequest request) {
		if (!StringUtils.hasText(request.getDebitAccountId())) {
			throw new IllegalArgumentException("Select a debit account");
		}
		if (!StringUtils.hasText(request.getBeneficiaryLastName())) {
			throw new IllegalArgumentException("Beneficiary last name is required");
		}
		if (!StringUtils.hasText(request.getBeneficiaryFirstName())) {
			throw new IllegalArgumentException("Beneficiary first name is required");
		}
		if (!StringUtils.hasText(request.getAddress())) {
			throw new IllegalArgumentException("Beneficiary address is required");
		}
		if (!StringUtils.hasText(request.getRib()) || !normalizeRib(request.getRib()).matches("\\d{20}")) {
			throw new IllegalArgumentException("Enter a valid 20-digit RIB/IBAN");
		}
		if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("Transfer amount must be greater than zero");
		}
		if (!StringUtils.hasText(request.getSignature())) {
			throw new IllegalArgumentException("Type your name as the transfer signature");
		}
	}

	private String normalizeRib(String value) {
		return value == null ? "" : value.replaceAll("\\s+", "").trim();
	}

	private String blankToNull(String value) {
		return StringUtils.hasText(value) ? value.trim() : null;
	}

	private String generateReference() {
		return "TRF" + LocalDateTime.now().format(REFERENCE_FORMATTER);
	}

	private VirementAccountResponse toAccountResponse(Compte account) {
		return VirementAccountResponse.builder()
				.numeroCompte(account.getNumeroCompte())
				.agence(account.getAgence())
				.codeDevise(account.getCodeDevise())
				.soldeComptable(account.getSoldeComptable())
				.soldeIndicatif(account.getSoldeIndicatif())
				.cleRib(account.getCleRib())
				.sensCompte(account.getSensCompte())
				.compteFerme(account.getCompteFerme())
				.build();
	}

	private VirementResponse toResponse(Virement order) {
		return VirementResponse.builder()
				.reference(order.getReference())
				.codeUtilisateur(order.getCodeUtilisateur())
				.debitAccountNumber(order.getDebitAccountNumber())
				.beneficiaryLastName(order.getBeneficiaryLastName())
				.beneficiaryFirstName(order.getBeneficiaryFirstName())
				.beneficiaryAddress(order.getBeneficiaryAddress())
				.beneficiaryRib(order.getBeneficiaryRib())
				.amount(order.getAmount())
				.reason(order.getReason())
				.donorSignature(order.getDonorSignature())
				.status(order.getStatus())
				.failureReason(order.getFailureReason())
				.submittedAt(order.getSubmittedAt())
				.processedAt(order.getProcessedAt())
				.build();
	}
}
