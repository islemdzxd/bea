package com.bea.client.service;

import com.bea.client.dto.ordrebourse.OrdreBourseAccountResponse;
import com.bea.client.dto.ordrebourse.OrdreBourseContextResponse;
import com.bea.client.dto.ordrebourse.OrdreBourseResponse;
import com.bea.client.dto.ordrebourse.OrdreBourseSubmissionRequest;
import com.bea.client.model.Client;
import com.bea.client.model.Compte;
import com.bea.client.model.Mouvement;
import com.bea.client.model.OrdreBourse;
import com.bea.client.repository.CompteRepository;
import com.bea.client.repository.MouvementRepository;
import com.bea.client.repository.OrdreBourseRepository;
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

@Service
@RequiredArgsConstructor
public class OrdreBourseService {

	private static final String STATUS_COMPLETED = "COMPLETED";
	private static final String SIDE_BUY = "buy";
	private static final String SIDE_SELL = "sell";
	private static final DateTimeFormatter REFERENCE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

	private final CompteRepository compteRepository;
	private final MouvementRepository mouvementRepository;
	private final OrdreBourseRepository ordreBourseRepository;

	public OrdreBourseContextResponse getContext(Client client) {
		List<Compte> accounts = compteRepository.findByCodeUtilisateurOrderByDateOuvertureDesc(client.getCli());
		List<OrdreBourse> history = ordreBourseRepository.findByCodeUtilisateurOrderBySubmittedAtDesc(client.getCli());

		return OrdreBourseContextResponse.builder()
				.cli(client.getCli())
				.nom(client.getNom())
				.prenom(client.getPrenom())
				.accounts(accounts.stream().map(this::toAccountResponse).toList())
				.latestOrder(history.isEmpty() ? null : toResponse(history.get(0)))
				.build();
	}

	public List<OrdreBourseResponse> getHistory(Client client) {
		return ordreBourseRepository.findByCodeUtilisateurOrderBySubmittedAtDesc(client.getCli())
				.stream()
				.map(this::toResponse)
				.toList();
	}

	public OrdreBourseResponse getOrder(Client client, String reference) {
		OrdreBourse order = ordreBourseRepository.findById(reference)
				.orElseThrow(() -> new IllegalArgumentException("Stock order not found"));
		if (!client.getCli().equals(order.getCodeUtilisateur())) {
			throw new IllegalArgumentException("Stock order not found");
		}
		return toResponse(order);
	}

	@Transactional
	public OrdreBourseResponse submit(Client client, OrdreBourseSubmissionRequest request) {
		validate(request);

		Compte account = compteRepository.findByNumeroCompteAndCodeUtilisateur(request.getAccountId().trim(), client.getCli())
				.orElseThrow(() -> new IllegalArgumentException("Selected account was not found"));

		BigDecimal price = request.getPrice().setScale(2, RoundingMode.HALF_UP);
		BigDecimal total = price.multiply(BigDecimal.valueOf(request.getQuantity())).setScale(2, RoundingMode.HALF_UP);
		String side = request.getSide().trim().toLowerCase();

		if (SIDE_BUY.equals(side)) {
			if (account.getSoldeComptable() == null || account.getSoldeComptable().compareTo(total) < 0) {
				throw new IllegalArgumentException("Insufficient balance for this buy order");
			}
			account.setSoldeComptable(account.getSoldeComptable().subtract(total));
			if (account.getSoldeIndicatif() != null) {
				account.setSoldeIndicatif(account.getSoldeIndicatif().subtract(total));
			}
		} else if (SIDE_SELL.equals(side)) {
			int availableQuantity = getNetQuantity(client.getCli(), account.getNumeroCompte(), request.getSymbol().trim().toUpperCase());
			if (availableQuantity < request.getQuantity()) {
				throw new IllegalArgumentException("Insufficient holdings for this sell order");
			}
			account.setSoldeComptable(account.getSoldeComptable() == null ? total : account.getSoldeComptable().add(total));
			if (account.getSoldeIndicatif() != null) {
				account.setSoldeIndicatif(account.getSoldeIndicatif().add(total));
			}
		} else {
			throw new IllegalArgumentException("Order side must be buy or sell");
		}

		compteRepository.save(account);

		String reference = generateReference();
		OrdreBourse order = new OrdreBourse();
		order.setReference(reference);
		order.setCodeUtilisateur(client.getCli());
		order.setNumeroCompte(account.getNumeroCompte());
		order.setSymbol(request.getSymbol().trim().toUpperCase());
		order.setStockName(request.getName().trim());
		order.setSide(side);
		order.setQuantity(request.getQuantity());
		order.setPrice(price);
		order.setTotal(total);
		order.setStatus(STATUS_COMPLETED);
		order.setFailureReason(null);
		order.setSubmittedAt(LocalDate.now());
		order.setProcessedAt(LocalDate.now());
		ordreBourseRepository.save(order);

		Mouvement mouvement = new Mouvement();
		mouvement.setAgence(account.getAgence());
		mouvement.setCodeAgenceDestinatrice(account.getAgence());
		mouvement.setCodeAgenceEmetrice(account.getAgence());
		mouvement.setChapitreComptable("ORDRE_BOURSE");
		mouvement.setDateComptable(LocalDate.now());
		mouvement.setCodeDevise(account.getCodeDevise());
		mouvement.setDateValeur(LocalDate.now());
		mouvement.setLibelle((SIDE_BUY.equals(side) ? "ACHAT ACTIONS " : "VENTE ACTIONS ") + order.getSymbol());
		mouvement.setMontant(total);
		mouvement.setNumeroCompte(account.getNumeroCompte());
		mouvement.setNumeroCompteRapprochement(null);
		mouvement.setCodeOperation(SIDE_BUY.equals(side) ? "ACH" : "VTE");
		mouvement.setSens(SIDE_BUY.equals(side) ? "D" : "C");
		mouvement.setCodeUtilisateur(client.getCli());
		mouvementRepository.save(mouvement);

		return toResponse(order);
	}

	private void validate(OrdreBourseSubmissionRequest request) {
		if (!StringUtils.hasText(request.getAccountId())) {
			throw new IllegalArgumentException("Select an account");
		}
		if (!StringUtils.hasText(request.getSymbol())) {
			throw new IllegalArgumentException("Stock symbol is required");
		}
		if (!StringUtils.hasText(request.getName())) {
			throw new IllegalArgumentException("Stock name is required");
		}
		if (!StringUtils.hasText(request.getSide())) {
			throw new IllegalArgumentException("Order side is required");
		}
		if (request.getQuantity() == null || request.getQuantity() <= 0) {
			throw new IllegalArgumentException("Quantity must be greater than zero");
		}
		if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("Price must be greater than zero");
		}
		String side = request.getSide().trim().toLowerCase();
		if (!SIDE_BUY.equals(side) && !SIDE_SELL.equals(side)) {
			throw new IllegalArgumentException("Order side must be buy or sell");
		}
	}

	private int getNetQuantity(String codeUtilisateur, String numeroCompte, String symbol) {
		return ordreBourseRepository.findByCodeUtilisateurAndNumeroCompteAndSymbolOrderBySubmittedAtDesc(codeUtilisateur, numeroCompte, symbol)
				.stream()
				.mapToInt(order -> SIDE_BUY.equalsIgnoreCase(order.getSide()) ? order.getQuantity() : -order.getQuantity())
				.sum();
	}

	private String generateReference() {
		return "STK" + LocalDateTime.now().format(REFERENCE_FORMATTER);
	}

	private OrdreBourseAccountResponse toAccountResponse(Compte account) {
		return OrdreBourseAccountResponse.builder()
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

	private OrdreBourseResponse toResponse(OrdreBourse order) {
		return OrdreBourseResponse.builder()
				.reference(order.getReference())
				.codeUtilisateur(order.getCodeUtilisateur())
				.numeroCompte(order.getNumeroCompte())
				.symbol(order.getSymbol())
				.stockName(order.getStockName())
				.side(order.getSide())
				.quantity(order.getQuantity())
				.price(order.getPrice())
				.total(order.getTotal())
				.status(order.getStatus())
				.failureReason(order.getFailureReason())
				.submittedAt(order.getSubmittedAt())
				.processedAt(order.getProcessedAt())
				.build();
	}
}
