package com.bea.client.repository;

import com.bea.client.model.AchatActions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchatActionsRepository extends JpaRepository<AchatActions, String> {
}
