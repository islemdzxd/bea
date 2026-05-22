package com.bea.admin.repository;

import com.bea.admin.model.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditRepository extends JpaRepository<Credit, String> {

    List<Credit> findAllByOrderByDateOuvertureDossierDesc();
}
