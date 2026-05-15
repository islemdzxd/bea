package com.bea.client.seeder;

import com.bea.client.model.Allocation;
import com.bea.client.model.Client;
import com.bea.client.repository.AllocationRepository;
import com.bea.client.repository.ClientRepository;
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
@Order(3)
@RequiredArgsConstructor
public class AllocationSeeder implements CommandLineRunner {

    private final AllocationRepository allocationRepository;
    private final ClientRepository clientRepository;

    private static final String[] PAYS = {
        "FR", "ES", "IT", "DE", "TR", "TN", "MA", "EG", "SA", "AE",
        "GB", "BE", "NL", "PT", "CH", "US", "CA", "CN", "JP", "BR"
    };

    private static final String[] NOM_PAYS = {
        "FRANCE", "ESPAGNE", "ITALIE", "ALLEMAGNE", "TURQUIE", "TUNISIE",
        "MAROC", "EGYPTE", "ARABIE SAOUDITE", "EMIRATS ARABES UNIS",
        "GRANDE BRETAGNE", "BELGIQUE", "PAYS BAS", "PORTUGAL", "SUISSE",
        "ETATS UNIS", "CANADA", "CHINE", "JAPON", "BRESIL"
    };

    private static final String[] MOYENS_TRANSPORT = {"AIR", "MAR", "TER"};
    private static final String[] MONNAIES = {"EUR", "USD"};
    private static final String[] POSTES_FRONTALIERS = {"ALGER", "ORAN", "ANNABA", "CONSTANTINE", "TLEMCEN"};
    private static final String[] POSTES_CODES = {"ALG", "ORA", "ANN", "CNT", "TLE"}; // Codes raccourcis (max 10 chars)
    private static final String[] ETATS = {"EN_ATTENTE", "APPROUVE", "REJETE", "EN_COURS"};
    private static final String[] CIVILITES = {"Mr", "Mme", "Mlle"};

    @Override
    public void run(String... args) {
        if (allocationRepository.count() > 0) {
            System.out.println("✅ Table allocation déjà remplie. Seeder ignoré.");
            return;
        }

        System.out.println("🚀 Génération des allocations...");

        Random random = new Random();
        List<Client> clients = clientRepository.findAll();
        List<Allocation> allocations = new ArrayList<>();

        if (clients.isEmpty()) {
            System.out.println("⚠️ Aucun client trouvé. Seeder allocations annulé.");
            return;
        }

        for (int i = 1; i <= 5000; i++) {
            Client client = clients.get(random.nextInt(clients.size()));
            int paysIndex = random.nextInt(PAYS.length);
            int posteIndex = random.nextInt(POSTES_FRONTALIERS.length);
            String monnaie = MONNAIES[random.nextInt(MONNAIES.length)];

            int age = LocalDate.now().getYear() - client.getDateNaissance().getYear();
            BigDecimal montant = age >= 19
                    ? BigDecimal.valueOf((random.nextInt(15) + 1) * 50L)
                    : BigDecimal.valueOf((random.nextInt(6) + 1) * 50L);

            LocalDate dateAller = LocalDate.now().plusDays(10 + random.nextInt(180));
            LocalDate dateRetour = dateAller.plusDays(7 + random.nextInt(30));

            Allocation allocation = new Allocation();
            allocation.setCodeDeclaration(String.format("DEC%010d", i));
            allocation.setDateArrete(LocalDate.now());
            allocation.setCodeAgence(client.getAgence());
            allocation.setEtablissementDec("BEA");
            allocation.setNin(client.getNin());
            allocation.setDateOctroi(LocalDate.now());
            allocation.setNomBenefi(client.getNom());
            allocation.setPrenom(client.getPrenom());
            allocation.setNumPasseport("P" + String.format("%08d", random.nextInt(99_999_999)));
            allocation.setDateNaissanceBenf(client.getDateNaissance());
            allocation.setCdMoyenTrans(MOYENS_TRANSPORT[random.nextInt(MOYENS_TRANSPORT.length)]);
            allocation.setMoyenTrans("AERIEN");
            allocation.setCodePostFrontalier(POSTES_CODES[posteIndex]);
            allocation.setDesignationPostFr(POSTES_FRONTALIERS[posteIndex]);
            allocation.setDateAllez(dateAller);
            allocation.setDateRetour(dateRetour);
            allocation.setCodePays(PAYS[paysIndex]);
            allocation.setNomPays(NOM_PAYS[paysIndex]);
            allocation.setMoannaie(monnaie);
            allocation.setMontantEur(montant);
            allocation.setCours(BigDecimal.valueOf(145.50 + random.nextDouble() * 10).setScale(4, BigDecimal.ROUND_HALF_UP));
            allocation.setContreValeur(montant.multiply(BigDecimal.valueOf(145.50)));
            allocation.setNomTuteur(null);
            allocation.setNinTuteur(null);
            allocation.setPrenomTuteur(null);
            allocation.setAddBy(client.getCli());
            allocation.setEtat(ETATS[random.nextInt(ETATS.length)]);
            allocation.setEve("EVE");
            allocation.setStatu(ETATS[random.nextInt(ETATS.length)]);
            allocation.setCodeMonnaie(monnaie);
            allocation.setDelivPassp(LocalDate.now().minusYears(2 + random.nextInt(5)));
            allocation.setMonChiffre(montant);
            allocation.setDExpPassp(LocalDate.now().plusYears(1 + random.nextInt(8)));
            allocation.setCivility(CIVILITES[random.nextInt(CIVILITES.length)]);
            allocation.setNorDre(String.format("ORD%06d", i));
            allocation.setMontantLettre(montant + " " + monnaie);
            allocation.setMonTotalLettre(montant + " " + monnaie);
            allocation.setMontantTotal(montant);
            allocation.setPhone("0554" + String.format("%06d", random.nextInt(999_999)));
            String emailStr = (client.getNom().substring(0, Math.min(5, client.getNom().length())) + i).toLowerCase();
            allocation.setEmail(emailStr.substring(0, Math.min(10, emailStr.length())));
            allocation.setDateSaisie(LocalDate.now().minusDays(random.nextInt(30)));
            allocation.setDateVerif(null);
            allocation.setDateVers(null);
            allocation.setObservation(null);
            allocation.setVerifBy(null);
            allocation.setValidBy(null);
            allocation.setDateAb(null);
            allocation.setAbBy(null);

            allocations.add(allocation);

            if (allocations.size() == 500) {
                allocationRepository.saveAll(allocations);
                allocations.clear();
                System.out.println("✅ " + i + " allocations insérées...");
            }
        }

        if (!allocations.isEmpty()) {
            allocationRepository.saveAll(allocations);
        }

        System.out.println("🎉 5000 allocations générées avec succès !");
    }
}