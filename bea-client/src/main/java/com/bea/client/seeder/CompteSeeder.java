package com.bea.client.seeder;

import com.bea.client.model.Compte;
import com.bea.client.repository.ClientRepository;
import com.bea.client.repository.CompteRepository;
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
@Order(2)
@RequiredArgsConstructor
public class CompteSeeder implements CommandLineRunner {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;

    private static final String[] AGENCES = {
        "00001","00002","00004","00005","00006","00008","00010","00012","00013","00015",
        "00016","00017","00018","00019","00020","00022","00024","00025","00026","00027",
        "00028","00029","00030","00031","00032","00033","00034","00035","00036","00037",
        "00038","00039","00040","00041","00042","00043","00044","00046","00047","00048",
        "00050","00051","00052","00053","00054","00055","00056","00057","00058","00060"
    };

    private static final String[] DEVISES = {"DZD", "EUR", "USD"};
    private static final String[] SENS = {"D", "C"};

    @Override
    public void run(String... args) {
        if (compteRepository.count() > 0) {
            System.out.println("✅ Table comptes déjà remplie. Seeder ignoré.");
            return;
        }

        System.out.println("🚀 Génération des comptes...");

        Random random = new Random();
        List<Compte> comptes = new ArrayList<>();

        List<String> clis = clientRepository.findAll()
                .stream()
                .map(client -> client.getCli())
                .toList();

        if (clis.isEmpty()) {
            System.out.println("⚠️ Aucun client trouvé. Seeder comptes annulé.");
            return;
        }

        for (int i = 1; i <= 10000; i++) {
            String agence = AGENCES[random.nextInt(AGENCES.length)];
            String numeroCompte = String.format("%010d", i);

            LocalDate dateOuverture = LocalDate.of(
                    2005 + random.nextInt(18),
                    1 + random.nextInt(12),
                    1 + random.nextInt(28)
            );

            BigDecimal soldeComptable = BigDecimal.valueOf(10_000 + random.nextInt(9_000_000)).setScale(2);
            BigDecimal soldeIndicatif = soldeComptable.add(BigDecimal.valueOf(random.nextInt(50_000))).setScale(2);
            String cli = clis.get(random.nextInt(clis.size()));

            Compte compte = new Compte();
            compte.setNumeroCompte(numeroCompte);
            compte.setAgence(agence);
            compte.setCompteFerme("N");
            compte.setCodeDevise(DEVISES[random.nextInt(DEVISES.length)]);
            compte.setDateOuverture(dateOuverture);
            compte.setDateFermeture(null);
            compte.setSoldeComptable(soldeComptable);
            compte.setSoldeIndicatif(soldeIndicatif);
            compte.setCleRib(String.valueOf(10 + random.nextInt(90)));
            compte.setCodeUtilisateur(cli);
            compte.setSensCompte(SENS[random.nextInt(SENS.length)]);

            comptes.add(compte);

            if (comptes.size() == 500) {
                compteRepository.saveAll(comptes);
                comptes.clear();
                System.out.println("✅ " + i + " comptes insérés...");
            }
        }

        if (!comptes.isEmpty()) {
            compteRepository.saveAll(comptes);
        }

        System.out.println("🎉 10 000 comptes générés avec succès !");
    }
}