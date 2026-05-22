package com.bea.client.repository;

import com.bea.client.model.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompteRepository extends JpaRepository<Compte, String> {

	List<Compte> findByCodeUtilisateurOrderByDateOuvertureDesc(String codeUtilisateur);

	java.util.Optional<Compte> findByNumeroCompteAndCodeUtilisateur(String numeroCompte, String codeUtilisateur);
}
