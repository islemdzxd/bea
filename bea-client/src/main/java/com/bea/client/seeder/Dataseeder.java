package com.bea.client.seeder;

import com.bea.client.model.Client;
import com.bea.client.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Component
@Profile("seed") // ← tourne SEULEMENT avec le profil "seed"
@RequiredArgsConstructor
public class Dataseeder implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    // Hash de "Test1234" — mot de passe par défaut pour tous les clients générés
    private static final String DEFAULT_PASSWORD = "Test1234";

    private static final String[] AGENCES = {
        "00001","00002","00004","00005","00006","00008","00010","00012","00013","00015",
        "00016","00017","00018","00019","00020","00022","00024","00025","00026","00027",
        "00028","00029","00030","00031","00032","00033","00034","00035","00036","00037",
        "00038","00039","00040","00041","00042","00043","00044","00046","00047","00048",
        "00050","00051","00052","00053","00054","00055","00056","00057","00058","00060",
        "00061","00062","00064","00065","00066","00067","00068","00069","00070","00071",
        "00072","00073","00074","00075","00076","00077","00078","00079","00080","00081",
        "00082","00083","00084","00085","00086","00087","00088","00089","00090","00091",
        "00092","00093","00094","00095","00096","00097","00098","00100","00101","00102",
        "00103","00104","00107","00108","00109","00110","00111","00112","00114","00115",
        "00116","00117","00118","00119","00120","00121","00122","00123","00124","00125","00126"
    };

    private static final String[] INTITULES = {
        "Monsieur", "Madame", "Mademoiselle"
    };

    private static final String[] TYPES_PIECE = {
        "Carte Nationale d'Identité",
        "Passeport",
        "Permis de conduire",
        "Carte de résident"
    };

    private static final String[] WILAYAS = {
        "ALGER", "BLIDA", "BOUMERDES", "TIPAZA", "MEDEA",
        "AIN DEFLA", "CHLEF", "ORAN", "TLEMCEN", "SIDI BEL ABBES",
        "MASCARA", "MOSTAGANEM", "RELIZANE", "TIARET", "AIN TEMOUCHENT",
        "CONSTANTINE", "ANNABA", "SETIF", "BEJAIA", "JIJEL",
        "SKIKDA", "GUELMA", "SOUK AHRAS", "TEBESSA", "OUM EL BOUAGHI",
        "BATNA", "BISKRA", "KHENCHELA", "M SILA", "BORDJ BOU ARRERIDJ",
        "BOUIRA", "TIZI OUZOU", "GHARDAIA", "OUARGLA", "TOUGGOURT",
        "EL OUED", "DJELFA", "LAGHOUAT", "ILLIZI", "ADRAR",
        "BECHAR", "SAIDA"
    };

    private static final String[] NOMS = {
        "BENALI","BENSALEM","BOUDIAF","HAMIDI","KHELIF","MEZIANE","FERHAT","OUALI","BRAHIMI","HADJ",
        "BELKACEM","MERZOUGUI","CHABANE","ZIANE","BOUDAOUD","LAOUFI","DJAMAI","AISSAOUI","HAMDANI","KHELFAOUI",
        "SAHRAOUI","BENMOUSSA","OUKIL","GHERAIRI","TOUATI","MAMMERI","BELLAL","YAHI","BENKHELIL","CHABI",
        "AMRANI","BENMAHMOUD","ROUABHI","DJELLOULI","TAHAR","MEDJDOUB","BENABDALLAH","KARA","LARBI","MADANI",
        "BENBRAHIM","CHOUIREF","GHOMARI","TALEB","MEKKI","BENHAMOUDA","RAHMANI","ZERROUKI","DJEDDI","BOUKHALFA",
        "SELLAM","MEBARKI","ARAB","BENYAHIA","MOUSSAOUI","BENKHALED","BOUZIDI","GHOUTI","HADDAD","CHERIFI",
        "DAHMANI","FELLAG","GUERBAS","HADJER","IBRAHIMI","JELLOULI","KEBIR","LEBBAL","MAHDI","NACEUR",
        "OSMANE","PASHA","QADI","REZGUI","SLIMANI","TEBIB","USMAN","VALI","WALI","XALI",
        "YAHIAOUI","ZAIDI","ABDELKADER","BELHADJ","CHEURFI","DRIS","ESSID","FILALI","GUERFI","HASSAN"
    };

    private static final String[] PRENOMS_M = {
        "Mohamed","Ahmed","Karim","Youcef","Bilal","Amine","Sofiane","Khalil","Walid","Hamza",
        "Riad","Sami","Tarek","Omar","Ali","Hichem","Nassim","Mehdi","Lotfi","Samir",
        "Anis","Badis","Chakib","Djamel","Elias","Farid","Ghiles","Houssem","Ilyes","Jamel",
        "Khaled","Lamine","Mounir","Nabil","Oussama","Rachid","Salim","Toufik","Wassim","Yazid",
        "Abdelmalek","Brahim","Cherif","Daoud","Fethi","Ghazi","Hassen","Ismail","Jawed","Kais"
    };

    private static final String[] PRENOMS_F = {
        "Amira","Fatima","Sara","Nadia","Meriem","Asma","Imane","Yasmine","Rania","Lina",
        "Sabrina","Karima","Dalila","Houda","Souad","Naima","Wafa","Lamia","Siham","Djamila",
        "Amel","Baya","Chahra","Dina","Elham","Fatiha","Ghania","Habiba","Ikram","Jamila",
        "Kheira","Leila","Malia","Nour","Ouarda","Rachida","Samia","Tassadit","Wahiba","Zineb",
        "Abla","Bouchra","Chouhra","Dorra","Fella","Ghizlane","Hana","Ilhem","Jihane","Kenza"
    };

    @Override
    public void run(String... args) throws Exception {
        if (clientRepository.count() > 1) {
            System.out.println("✅ La table clients contient déjà des données. Seeder ignoré.");
            return;
        }

        System.out.println("🚀 Démarrage du seeder — génération de 10 000 clients...");

        Random random = new Random();
        String hashedPassword = passwordEncoder.encode(DEFAULT_PASSWORD);
        List<Client> clients = new ArrayList<>();

        for (int i = 1; i <= 10000; i++) {
            boolean isFemale = random.nextBoolean();

            String intitule = isFemale
                    ? (random.nextBoolean() ? "Madame" : "Mademoiselle")
                    : "Monsieur";

            String prenom = isFemale
                    ? PRENOMS_F[random.nextInt(PRENOMS_F.length)]
                    : PRENOMS_M[random.nextInt(PRENOMS_M.length)];

            String nom = NOMS[random.nextInt(NOMS.length)];
            String agence = AGENCES[random.nextInt(AGENCES.length)];
            String wilaya = WILAYAS[random.nextInt(WILAYAS.length)];

            // Date de naissance entre 1950 et 2000
            LocalDate dateNaissance = LocalDate.of(
                    1950 + random.nextInt(50),
                    1 + random.nextInt(12),
                    1 + random.nextInt(28)
            );

            // Date de création entre 2010 et 2026
            LocalDate dateCreation = LocalDate.of(
                    2010 + random.nextInt(16),
                    1 + random.nextInt(12),
                    1 + random.nextInt(28)
            );

            // Date validité pièce entre 2026 et 2036
            LocalDate dateValiditePiece = LocalDate.of(
                    2026 + random.nextInt(10),
                    1 + random.nextInt(12),
                    1 + random.nextInt(28)
            );

            // NIN : 18 chiffres
            StringBuilder nin = new StringBuilder();
            for (int j = 0; j < 18; j++) {
                nin.append(random.nextInt(10));
            }

            // CLI : format AGENCExxxx (15 chars max)
            String cli = agence + String.format("%09d", i);

            Client client = new Client();
            client.setCli(cli);
            client.setAgence(agence);
            client.setNom(nom);
            client.setPrenom(prenom);
            client.setDateNaissance(dateNaissance);
            client.setLieuNaissance(wilaya);
            client.setNin(nin.toString());
            client.setDateCreation(dateCreation);
            client.setIntitule(intitule);
            client.setTypePieceIdentite(TYPES_PIECE[random.nextInt(TYPES_PIECE.length)]);
            client.setDateValiditePiece(dateValiditePiece);
            client.setRaisonSociale(nom + " " + prenom);
            client.setCodePaysResidence("DZ");
            client.setCodeNationalite("DZ");
            client.setPassword(hashedPassword);

            clients.add(client);

            // Sauvegarde par batch de 500
            if (clients.size() == 500) {
                clientRepository.saveAll(clients);
                clients.clear();
                System.out.println("✅ " + i + " clients insérés...");
            }
        }

        // Sauvegarder le reste
        if (!clients.isEmpty()) {
            clientRepository.saveAll(clients);
        }

        System.out.println("🎉 10 000 clients générés avec succès ! Mot de passe par défaut : Test1234");
    }
}