package com.bea.client.seeder;

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
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Profile("seed")
@Order(4)
@RequiredArgsConstructor
public class MouvementSeeder implements CommandLineRunner {

    private final MouvementRepository mouvementRepository;
    private final CompteRepository compteRepository;

    private static final String[] AGENCES = {
        "00001","00002","00004","00005","00006","00008","00010","00012",
        "00020","00030","00036","00050","00060","00040","00054"
    };

    private static final String[] DEVISES = {"DZD", "EUR", "USD"};

    private static final String[] LIBELLES = {
        "VIREMENT BANCAIRE", "RETRAIT DAB", "DEPOT ESPECES",
        "PAIEMENT FACTURE", "VIREMENT SALAIRE", "REMBOURSEMENT CREDIT",
        "PAIEMENT IMPOTS", "ACHAT EN LIGNE", "VIREMENT INTER AGENCE",
        "REMISE CHEQUE", "PAIEMENT ASSURANCE", "COTISATION SOCIALE"
    };

    private static final String[] CODES_OPERATION = {"VIR", "RET", "DEP", "PAI", "SAL", "RMB", "IMP", "ACH"};

    @Override
    public void run(String... args) {
        if (mouvementRepository.count() > 0) {
            System.out.println("✅ Table mouvements déjà remplie. Seeder ignoré.");
            return;
        }

        System.out.println("🚀 Génération des mouvements...");

        Random random = new Random();
        List<String> numComptes = compteRepository.findAll()
                .stream()
                .map(compte -> compte.getNumeroCompte())
                .toList();

        if (numComptes.isEmpty()) {
            System.out.println("⚠️ Aucun compte trouvé. Seeder mouvements annulé.");
            return;
        }

        List<Mouvement> mouvements = new ArrayList<>();

        for (int i = 1; i <= 50_000; i++) {
            String agence = AGENCES[random.nextInt(AGENCES.length)];
            String agenceDest = AGENCES[random.nextInt(AGENCES.length)];
            String numCompte = numComptes.get(random.nextInt(numComptes.size()));
            String numCompteRapproch = numComptes.get(random.nextInt(numComptes.size()));

            LocalDate dateComptable = LocalDate.of(
                    2020 + random.nextInt(5),
                    1 + random.nextInt(12),
                    1 + random.nextInt(28)
            );

            Mouvement mouvement = new Mouvement();
            mouvement.setAgence(agence);
            mouvement.setCodeAgenceDestinatrice(agenceDest);
            mouvement.setCodeAgenceEmetrice(agence);
            mouvement.setChapitreComptable("CHAP" + (100 + random.nextInt(900)));
            mouvement.setDateComptable(dateComptable);
            mouvement.setCodeDevise(DEVISES[random.nextInt(DEVISES.length)]);
            mouvement.setDateValeur(dateComptable.plusDays(random.nextInt(3)));
            mouvement.setLibelle(LIBELLES[random.nextInt(LIBELLES.length)]);
            mouvement.setMontant(BigDecimal.valueOf(1000 + random.nextInt(500000)));
            mouvement.setNumeroCompte(numCompte);
            mouvement.setNumeroCompteRapprochement(numCompteRapproch);
            mouvement.setCodeOperation(CODES_OPERATION[random.nextInt(CODES_OPERATION.length)]);
            mouvement.setSens(random.nextBoolean() ? "D" : "C");
            mouvement.setCodeUtilisateur("SYS");

            mouvements.add(mouvement);

            if (mouvements.size() == 1000) {
                mouvementRepository.saveAll(mouvements);
                mouvements.clear();
                System.out.println("✅ " + i + " mouvements insérés...");
            }
        }

        if (!mouvements.isEmpty()) {
            mouvementRepository.saveAll(mouvements);
        }

        System.out.println("🎉 50 000 mouvements générés avec succès !");
    }
}