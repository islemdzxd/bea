package com.bea.client.seeder;

import com.bea.client.model.AchatActions;
import com.bea.client.model.Client;
import com.bea.client.repository.AchatActionsRepository;
import com.bea.client.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Profile("seed")
@Order(6)
@RequiredArgsConstructor
public class AchatActionsSeeder implements CommandLineRunner {

    private final AchatActionsRepository achatActionsRepository;
    private final ClientRepository clientRepository;

    private static final String[] VALEURS = {
        "SONATRACH", "SAIDAL", "ALLIANCE ASSURANCES",
        "BIOPHARM", "NCA ROUIBA", "EGH EL AURASSI",
        "SALIM", "TONIC INDUSTRIES", "ERIAD SETIF"
    };

    private static final String[] WILAYAS = {
        "ALGER", "ORAN", "CONSTANTINE", "ANNABA",
        "BLIDA", "SETIF", "BEJAIA", "TIZI OUZOU"
    };

    @Override
    public void run(String... args) {
        if (achatActionsRepository.count() > 0) {
            System.out.println("✅ Table achat_actions déjà remplie. Seeder ignoré.");
            return;
        }

        System.out.println("🚀 Génération des achats d'actions...");

        Random random = new Random();
        List<Client> clients = clientRepository.findAll();
        List<AchatActions> achats = new ArrayList<>();

        if (clients.isEmpty()) {
            System.out.println("⚠️ Aucun client trouvé. Seeder achats d'actions annulé.");
            return;
        }

        for (int i = 1; i <= 2000; i++) {
            Client client = clients.get(random.nextInt(clients.size()));
            String numeroCompte = String.format("%010d", i);

            LocalDate dateDemande = LocalDate.of(
                    2020 + random.nextInt(5),
                    1 + random.nextInt(12),
                    1 + random.nextInt(28)
            );

            AchatActions achat = new AchatActions();
            achat.setNumeroCompte(numeroCompte);
            achat.setAgence(client.getAgence());
            achat.setNom(client.getNom());
            achat.setPrenom(client.getPrenom());
            achat.setNin(client.getNin());
            achat.setDelivreLe(LocalDate.now().minusYears(2 + random.nextInt(5)));
            achat.setLieuDelivrance(WILAYAS[random.nextInt(WILAYAS.length)]);
            achat.setAdresse(random.nextInt(100) + " Rue " + random.nextInt(50) + ", " + WILAYAS[random.nextInt(WILAYAS.length)]);
            achat.setValeur(VALEURS[random.nextInt(VALEURS.length)]);
            achat.setQuantite(10 + random.nextInt(990));
            achat.setDateValidite(dateDemande.plusMonths(1));
            achat.setDateDemande(dateDemande);

            achats.add(achat);

            if (achats.size() == 500) {
                achatActionsRepository.saveAll(achats);
                achats.clear();
                System.out.println("✅ " + i + " achats d'actions insérés...");
            }
        }

        if (!achats.isEmpty()) {
            achatActionsRepository.saveAll(achats);
        }

        System.out.println("🎉 2000 achats d'actions générés avec succès !");
    }
}