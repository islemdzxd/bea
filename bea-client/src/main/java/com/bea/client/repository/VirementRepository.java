package com.bea.client.repository;

import com.bea.client.model.Virement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VirementRepository extends JpaRepository<Virement, String> {

    List<Virement> findByCodeUtilisateurOrderBySubmittedAtDesc(String codeUtilisateur);
}