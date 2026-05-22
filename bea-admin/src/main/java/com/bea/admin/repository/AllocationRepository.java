package com.bea.admin.repository;

import com.bea.admin.model.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, String> {

    List<Allocation> findAllByOrderByDateSaisieDesc();
}
