package com.bea.client.seeder;

import com.bea.client.model.Compte;
import com.bea.client.model.Mouvement;
import com.bea.client.repository.CompteRepository;
import com.bea.client.repository.MouvementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Component
@Profile("seed")
@Order(5)
@RequiredArgsConstructor
public class AccountHistorySeeder implements CommandLineRunner {

    private static final int MIN_HISTORY_PER_ACCOUNT = 5;

    private static final String[] AGENCES = {
        "00001", "00002", "00004", "00005", "00006", "00008", "00010", "00012",
        "00020", "00030", "00036", "00050", "00060", "00040", "00054"
    };

    private static final String[] DEVISES = {"DZD", "EUR", "USD"};
    private static final String[] CREDIT_LIBELLES = {"SOLDE D'OUVERTURE", "VERSEMENT INITIAL", "VIREMENT SALAIRE", "REMISE CHEQUE", "REMBOURSEMENT"};
    private static final String[] DEBIT_LIBELLES = {"RETRAIT DAB", "PAIEMENT CARTE", "PAIEMENT FACTURE", "VIREMENT SORTANT", "PRELEVEMENT"};
    private static final String[] CREDIT_OPERATIONS = {"DEP", "SAL", "RMB", "VIR"};
    private static final String[] DEBIT_OPERATIONS = {"RET", "PAI", "VIR", "PRE"};

    private final CompteRepository compteRepository;
    private final MouvementRepository mouvementRepository;

    @Override
    public void run(String... args) {
        List<Compte> comptes = compteRepository.findAll();
        if (comptes.isEmpty()) {
            System.out.println("⚠️ Aucun compte trouvé. Seeder d'historique annulé.");
            return;
        }

        Map<String, Long> movementCounts = mouvementRepository.findAll().stream()
                .filter(mouvement -> mouvement.getNumeroCompte() != null && !mouvement.getNumeroCompte().isBlank())
                .collect(Collectors.groupingBy(Mouvement::getNumeroCompte, Collectors.counting()));

        List<Compte> comptesToTopUp = comptes.stream()
                .filter(compte -> movementCounts.getOrDefault(compte.getNumeroCompte(), 0L) < MIN_HISTORY_PER_ACCOUNT)
                .toList();

        if (comptesToTopUp.isEmpty()) {
            System.out.println("✅ Tous les comptes ont déjà un historique suffisant. Seeder ignoré.");
            return;
        }

        System.out.println("🚀 Complétion de l'historique des comptes sans mouvements suffisants...");

        Random random = new Random();
        List<Mouvement> batch = new ArrayList<>();
        int inserted = 0;

        for (Compte compte : comptesToTopUp) {
            long existingCount = movementCounts.getOrDefault(compte.getNumeroCompte(), 0L);
            int movementsToCreate = (int) (MIN_HISTORY_PER_ACCOUNT - existingCount);

            if (movementsToCreate <= 0) {
                continue;
            }

            batch.addAll(createHistoryForAccount(compte, movementsToCreate, random));

            if (batch.size() >= 1000) {
                mouvementRepository.saveAll(batch);
                inserted += batch.size();
                batch.clear();
            }
        }

        if (!batch.isEmpty()) {
            mouvementRepository.saveAll(batch);
            inserted += batch.size();
        }

        System.out.println("🎉 " + inserted + " mouvements d'historique ajoutés pour couvrir tous les comptes.");
    }

    private List<Mouvement> createHistoryForAccount(Compte compte, int movementsToCreate, Random random) {
        List<Mouvement> mouvements = new ArrayList<>(movementsToCreate);

        LocalDate openingDate = compte.getDateOuverture() != null ? compte.getDateOuverture() : LocalDate.now().minusYears(5);
        if (openingDate.isAfter(LocalDate.now())) {
            openingDate = LocalDate.now().minusMonths(6);
        }

        BigDecimal openingAmount = safeAmount(compte.getSoldeIndicatif() != null ? compte.getSoldeIndicatif() : compte.getSoldeComptable());
        mouvements.add(buildMovement(compte, openingDate, openingAmount, true, "SOLDE D'OUVERTURE", "DEP", random));

        for (int i = 1; i < movementsToCreate; i++) {
            boolean credit = random.nextBoolean();
            LocalDate movementDate = randomDateBetween(openingDate.plusDays(1), LocalDate.now(), random);
            BigDecimal amount = BigDecimal.valueOf(500L + random.nextInt(75_000)).setScale(2);

            mouvements.add(buildMovement(
                    compte,
                    movementDate,
                    amount,
                    credit,
                    credit ? CREDIT_LIBELLES[random.nextInt(CREDIT_LIBELLES.length)] : DEBIT_LIBELLES[random.nextInt(DEBIT_LIBELLES.length)],
                    credit ? CREDIT_OPERATIONS[random.nextInt(CREDIT_OPERATIONS.length)] : DEBIT_OPERATIONS[random.nextInt(DEBIT_OPERATIONS.length)],
                    random
            ));
        }

        return mouvements;
    }

    private Mouvement buildMovement(
            Compte compte,
            LocalDate dateComptable,
            BigDecimal montant,
            boolean credit,
            String libelle,
            String codeOperation,
            Random random
    ) {
        Mouvement mouvement = new Mouvement();
        String agence = compte.getAgence() != null ? compte.getAgence() : AGENCES[random.nextInt(AGENCES.length)];

        mouvement.setAgence(agence);
        mouvement.setCodeAgenceEmetrice(agence);
        mouvement.setCodeAgenceDestinatrice(AGENCES[random.nextInt(AGENCES.length)]);
        mouvement.setChapitreComptable("HIST" + (100 + random.nextInt(900)));
        mouvement.setDateComptable(dateComptable);
        mouvement.setDateValeur(dateComptable.plusDays(random.nextInt(3)));
        mouvement.setCodeDevise(compte.getCodeDevise() != null ? compte.getCodeDevise() : DEVISES[random.nextInt(DEVISES.length)]);
        mouvement.setLibelle(libelle);
        mouvement.setMontant(montant);
        mouvement.setNumeroCompte(compte.getNumeroCompte());
        mouvement.setNumeroCompteRapprochement(compte.getNumeroCompte());
        mouvement.setCodeOperation(codeOperation);
        mouvement.setSens(credit ? "C" : "D");
        mouvement.setCodeUtilisateur(compte.getCodeUtilisateur() != null ? compte.getCodeUtilisateur() : "SYS");
        return mouvement;
    }

    private LocalDate randomDateBetween(LocalDate startInclusive, LocalDate endInclusive, Random random) {
        LocalDate safeStart = startInclusive != null ? startInclusive : LocalDate.now().minusYears(1);
        LocalDate safeEnd = endInclusive != null ? endInclusive : LocalDate.now();

        if (safeEnd.isBefore(safeStart)) {
            safeEnd = safeStart.plusDays(30);
        }

        long days = Math.max(1, ChronoUnit.DAYS.between(safeStart, safeEnd));
        long offset = random.nextInt((int) Math.min(Integer.MAX_VALUE, days + 1));
        return safeStart.plusDays(offset);
    }

    private BigDecimal safeAmount(BigDecimal value) {
        if (value == null || value.signum() <= 0) {
            return BigDecimal.valueOf(50_000L).setScale(2);
        }

        return value.setScale(2, java.math.RoundingMode.HALF_UP);
    }
}