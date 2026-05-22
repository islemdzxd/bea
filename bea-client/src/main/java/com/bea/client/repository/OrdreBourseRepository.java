package com.bea.client.repository;

import com.bea.client.model.OrdreBourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdreBourseRepository extends JpaRepository<OrdreBourse, String> {

    List<OrdreBourse> findByCodeUtilisateurOrderBySubmittedAtDesc(String codeUtilisateur);

    List<OrdreBourse> findByCodeUtilisateurAndNumeroCompteAndSymbolOrderBySubmittedAtDesc(String codeUtilisateur, String numeroCompte, String symbol);
}