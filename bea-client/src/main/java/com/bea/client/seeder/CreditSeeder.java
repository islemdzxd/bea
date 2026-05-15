package com.bea.client.seeder;

import com.bea.client.model.Client;
import com.bea.client.model.Credit;
import com.bea.client.repository.ClientRepository;
import com.bea.client.repository.CreditRepository;
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
@Order(5)
@RequiredArgsConstructor
public class CreditSeeder implements CommandLineRunner {

    private final CreditRepository creditRepository;
    private final ClientRepository clientRepository;

    private static final String[] TYPES_PRET = {"AUTOMOBILE", "IMMOBILIER", "ELECTROMENAGER"};
    private static final String[] ETATS_DOSSIER = {"EN_ATTENTE", "APPROUVE", "REJETE", "EN_COURS"};
    private static final String[] MOTIFS_REJET = {
        "Dossier incomplet",
        "Salaire insuffisant",
        "Taux d'endettement élevé",
        "Historique de crédit défavorable",
        null, null, null
    };

    @Override
    public void run(String... args) {
        if (creditRepository.count() > 0) {
            System.out.println("✅ Table credit déjà remplie. Seeder ignoré.");
            return;
        }

        System.out.println("🚀 Génération des crédits...");

        Random random = new Random();
        List<Client> clients = clientRepository.findAll();
        List<Credit> credits = new ArrayList<>();

        if (clients.isEmpty()) {
            System.out.println("⚠️ Aucun client trouvé. Seeder crédits annulé.");
            return;
        }

        for (int i = 1; i <= 3000; i++) {
            Client client = clients.get(random.nextInt(clients.size()));

            String etat = ETATS_DOSSIER[random.nextInt(ETATS_DOSSIER.length)];
            String motifRejet = "REJETE".equals(etat)
                    ? MOTIFS_REJET[random.nextInt(4)]
                    : null;

            LocalDate dateOuverture = LocalDate.of(
                    2018 + random.nextInt(7),
                    1 + random.nextInt(12),
                    1 + random.nextInt(28)
            );

            Credit credit = new Credit();
            credit.setNumeroDossier(String.format("DOS%010d", i));
            credit.setAgence(client.getAgence());
            credit.setCodeClient(client.getCli());
            credit.setNumeroConvention(String.format("CONV%08d", i));
            credit.setTypePret(TYPES_PRET[random.nextInt(TYPES_PRET.length)]);
            credit.setMontantPret(BigDecimal.valueOf(100000 + random.nextInt(9_900_000)));
            credit.setCodeUtilisateur("SYS");
            credit.setDateOuvertureDossier(dateOuverture);
            credit.setDateModificationDossier(dateOuverture.plusDays(random.nextInt(30)));
            credit.setMotifRejet(motifRejet);
            credit.setEtatDossier(etat);
            credit.setDateDernierEtat(dateOuverture.plusDays(random.nextInt(60)));

            credits.add(credit);

            if (credits.size() == 500) {
                creditRepository.saveAll(credits);
                credits.clear();
                System.out.println("✅ " + i + " crédits insérés...");
            }
        }

        if (!credits.isEmpty()) {
            creditRepository.saveAll(credits);
        }

        System.out.println("🎉 3000 crédits générés avec succès !");
    }
}