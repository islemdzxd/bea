package com.bea.client.repository;

import com.bea.client.model.Mouvement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface MouvementRepository extends JpaRepository<Mouvement, Long> {

	Page<Mouvement> findByNumeroCompteIn(Collection<String> numeroComptes, Pageable pageable);
}
