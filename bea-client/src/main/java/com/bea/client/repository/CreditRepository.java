package com.bea.client.repository;

import com.bea.client.model.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CreditRepository extends JpaRepository<Credit, String> {

	List<Credit> findByCodeUtilisateurOrderByDateOuvertureDossierDesc(String codeUtilisateur);

	List<Credit> findByCodeUtilisateurAndDateOuvertureDossierBetweenOrderByDateOuvertureDossierDesc(String codeUtilisateur, LocalDate start, LocalDate end);
}
