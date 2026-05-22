package com.bea.client.service;

import com.bea.client.dto.AuthResponse;
import com.bea.client.dto.LoginRequest;
import com.bea.client.dto.RegisterRequest;
import com.bea.client.model.Client;
import com.bea.client.model.Compte;
import com.bea.client.model.Mouvement;
import com.bea.client.repository.ClientRepository;
import com.bea.client.repository.CompteRepository;
import com.bea.client.repository.MouvementRepository;
import com.bea.client.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ClientRepository clientRepository;
    private final CompteRepository compteRepository;
    private final MouvementRepository mouvementRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private static final String[] AGENCES = {
        "00001", "00002", "00004", "00005", "00006", "00008", "00010", "00012",
        "00020", "00030", "00036", "00050", "00060", "00040", "00054"
    };

    private static final String[] DEVISES = {"DZD", "EUR", "USD"};
    private static final String[] HISTORY_LIBELLES = {
        "VERSEMENT INITIAL", "VIREMENT SALAIRE", "RETRAIT DAB", "PAIEMENT CARTE", "REMBOURSEMENT"
    };

    public AuthResponse login(LoginRequest request) {
        // 1. Vérifier que le client existe
        Client client = clientRepository.findByCli(request.getCli())
                .orElseThrow(() -> new RuntimeException("Login incorrect"));

        // 2. Vérifier que le client a un mot de passe (accès activé par la BEA)
        if (client.getPassword() == null) {
            throw new RuntimeException("Accès non activé, contactez votre agence");
        }

        // 3. Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), client.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // 4. Générer le token JWT
        String token = jwtUtil.generateToken(client.getCli());

        return new AuthResponse(token, client.getNom(), client.getPrenom(), client.getCli());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        validateRegistration(request);

        Client client = new Client();
        client.setCli(generateCli());
        client.setAgence(randomItem(AGENCES));
        client.setNom(request.getLastName().trim().toUpperCase());
        client.setPrenom(request.getFirstName().trim());
        client.setDateNaissance(request.getDateOfBirth());
        client.setDateCreation(LocalDate.now());
        client.setLieuNaissance("ALGER");
        client.setNin(generateNin());
        client.setIntitule("Monsieur");
        client.setTypePieceIdentite("Carte Nationale d'Identité");
        client.setDateValiditePiece(LocalDate.now().plusYears(10));
        client.setRaisonSociale(request.getLastName().trim() + " " + request.getFirstName().trim());
        client.setCodePaysResidence("DZ");
        client.setCodeNationalite("DZ");
        client.setEmail(request.getEmail().trim().toLowerCase());
        client.setPhone(request.getPhone().trim());
        client.setPassword(passwordEncoder.encode(request.getPassword()));

        clientRepository.save(client);

        Compte compte = createInitialAccount(client);
        compteRepository.save(compte);

        List<Mouvement> mouvements = createInitialHistory(client, compte);
        mouvementRepository.saveAll(mouvements);

        String token = jwtUtil.generateToken(client.getCli());
        return new AuthResponse(token, client.getNom(), client.getPrenom(), client.getCli());
    }

    private void validateRegistration(RegisterRequest request) {
        if (request == null
                || request.getFirstName() == null || request.getFirstName().isBlank()
                || request.getLastName() == null || request.getLastName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPhone() == null || request.getPhone().isBlank()
                || request.getPassword() == null || request.getPassword().length() < 6
                || request.getDateOfBirth() == null) {
            throw new RuntimeException("Invalid registration data");
        }
    }

    private Compte createInitialAccount(Client client) {
        long nextAccountNumber = compteRepository.findAll().stream()
                .map(Compte::getNumeroCompte)
                .filter(numeroCompte -> numeroCompte != null && numeroCompte.matches("\\d+"))
                .mapToLong(Long::parseLong)
                .max()
                .orElse(0L) + 1;

        BigDecimal soldeComptable = BigDecimal.valueOf(250_000L).setScale(2);
        BigDecimal soldeIndicatif = BigDecimal.valueOf(255_000L).setScale(2);

        Compte compte = new Compte();
        compte.setNumeroCompte(String.format("%010d", nextAccountNumber));
        compte.setAgence(client.getAgence());
        compte.setCompteFerme("N");
        compte.setCodeDevise("DZD");
        compte.setDateOuverture(LocalDate.now().minusDays(3));
        compte.setDateFermeture(null);
        compte.setSoldeComptable(soldeComptable);
        compte.setSoldeIndicatif(soldeIndicatif);
        compte.setCleRib(String.valueOf(10 + new Random().nextInt(90)));
        compte.setCodeUtilisateur(client.getCli());
        compte.setSensCompte("D");
        return compte;
    }

    private List<Mouvement> createInitialHistory(Client client, Compte compte) {
        Random random = new Random();
        List<Mouvement> mouvements = new ArrayList<>();

        mouvements.add(buildMovement(client, compte, LocalDate.now().minusDays(3), BigDecimal.valueOf(250_000L).setScale(2), "C", "SOLDE D'OUVERTURE", "DEP", random));
        mouvements.add(buildMovement(client, compte, LocalDate.now().minusDays(2), BigDecimal.valueOf(42_000L).setScale(2), "C", "VERSEMENT INITIAL", "DEP", random));
        mouvements.add(buildMovement(client, compte, LocalDate.now().minusDays(1), BigDecimal.valueOf(15_500L).setScale(2), "D", "PAIEMENT CARTE", "PAI", random));
        mouvements.add(buildMovement(client, compte, LocalDate.now(), BigDecimal.valueOf(8_000L).setScale(2), "D", "RETRAIT DAB", "RET", random));

        return mouvements;
    }

    private Mouvement buildMovement(Client client, Compte compte, LocalDate date, BigDecimal amount, String sens, String libelle, String operation, Random random) {
        Mouvement mouvement = new Mouvement();
        mouvement.setAgence(compte.getAgence());
        mouvement.setCodeAgenceDestinatrice(randomItem(AGENCES));
        mouvement.setCodeAgenceEmetrice(compte.getAgence());
        mouvement.setChapitreComptable("HIST" + (100 + random.nextInt(900)));
        mouvement.setDateComptable(date);
        mouvement.setCodeDevise(compte.getCodeDevise());
        mouvement.setDateValeur(date);
        mouvement.setLibelle(libelle);
        mouvement.setMontant(amount);
        mouvement.setNumeroCompte(compte.getNumeroCompte());
        mouvement.setNumeroCompteRapprochement(compte.getNumeroCompte());
        mouvement.setCodeOperation(operation);
        mouvement.setSens(sens);
        mouvement.setCodeUtilisateur(client.getCli());
        return mouvement;
    }

    private String generateCli() {
        long nextId = clientRepository.count() + 1;
        return "WEB" + String.format("%010d", nextId);
    }

    private String generateNin() {
        StringBuilder nin = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 18; i++) {
            nin.append(random.nextInt(10));
        }
        return nin.toString();
    }

    private String randomItem(String[] values) {
        return values[new Random().nextInt(values.length)];
    }
}