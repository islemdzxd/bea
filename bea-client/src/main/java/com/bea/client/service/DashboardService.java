package com.bea.client.service;

import com.bea.client.dto.dashboard.DashboardAccountResponse;
import com.bea.client.dto.dashboard.DashboardMovementResponse;
import com.bea.client.dto.dashboard.DashboardResponse;
import com.bea.client.model.Client;
import com.bea.client.model.Compte;
import com.bea.client.model.Mouvement;
import com.bea.client.repository.CompteRepository;
import com.bea.client.repository.MouvementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CompteRepository compteRepository;
    private final MouvementRepository mouvementRepository;

    public DashboardResponse getDashboard(Client client) {
        List<Compte> comptes = compteRepository.findByCodeUtilisateurOrderByDateOuvertureDesc(client.getCli());
        List<DashboardAccountResponse> accountResponses = comptes.stream()
                .map(this::toAccountResponse)
                .toList();

        List<String> numeroComptes = comptes.stream()
                .map(Compte::getNumeroCompte)
                .toList();

        List<DashboardMovementResponse> recentMovements = numeroComptes.isEmpty()
                ? List.of()
                : mouvementRepository.findByNumeroCompteIn(
                        numeroComptes,
                        PageRequest.of(
                                0,
                                10,
                                Sort.by(
                                        Sort.Order.desc("dateValeur"),
                                        Sort.Order.desc("dateComptable"),
                                        Sort.Order.desc("numeroMouvement")
                                )
                        )
                ).getContent().stream()
                .map(this::toMovementResponse)
                .toList();

        BigDecimal totalBalance = comptes.stream()
                .map(this::preferredBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalIndicativeBalance = comptes.stream()
                .map(this::preferredIndicativeBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        DashboardAccountResponse primaryAccount = accountResponses.stream()
                .max(Comparator.comparing(DashboardAccountResponse::getDateOuverture, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(null);

        return DashboardResponse.builder()
                .cli(client.getCli())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .totalBalance(totalBalance)
                .totalIndicativeBalance(totalIndicativeBalance)
                .totalAccounts(accountResponses.size())
                .primaryAccount(primaryAccount)
                .accounts(accountResponses)
                .recentMovements(recentMovements)
                .generatedAt(LocalDateTime.now())
                .build();
    }

    private DashboardAccountResponse toAccountResponse(Compte compte) {
        return DashboardAccountResponse.builder()
                .numeroCompte(compte.getNumeroCompte())
                .agence(compte.getAgence())
                .codeDevise(compte.getCodeDevise())
                .dateOuverture(compte.getDateOuverture())
                .dateFermeture(compte.getDateFermeture())
                .compteFerme(compte.getCompteFerme())
                .soldeComptable(compte.getSoldeComptable())
                .soldeIndicatif(compte.getSoldeIndicatif())
                .cleRib(compte.getCleRib())
                .sensCompte(compte.getSensCompte())
                .build();
    }

        private BigDecimal preferredBalance(Compte compte) {
                if (compte.getSoldeIndicatif() != null) {
                        return compte.getSoldeIndicatif();
                }

                return compte.getSoldeComptable() == null ? BigDecimal.ZERO : compte.getSoldeComptable();
        }

        private BigDecimal preferredIndicativeBalance(Compte compte) {
                if (compte.getSoldeComptable() != null) {
                        return compte.getSoldeComptable();
                }

                return compte.getSoldeIndicatif() == null ? BigDecimal.ZERO : compte.getSoldeIndicatif();
        }

    private DashboardMovementResponse toMovementResponse(Mouvement mouvement) {
        return DashboardMovementResponse.builder()
                .numeroMouvement(mouvement.getNumeroMouvement())
                .numeroCompte(mouvement.getNumeroCompte())
                .agence(mouvement.getAgence())
                .codeAgenceDestinatrice(mouvement.getCodeAgenceDestinatrice())
                .codeAgenceEmetrice(mouvement.getCodeAgenceEmetrice())
                .codeDevise(mouvement.getCodeDevise())
                .dateComptable(mouvement.getDateComptable())
                .dateValeur(mouvement.getDateValeur())
                .libelle(mouvement.getLibelle())
                .montant(mouvement.getMontant())
                .sens(mouvement.getSens())
                .codeOperation(mouvement.getCodeOperation())
                .build();
    }
}