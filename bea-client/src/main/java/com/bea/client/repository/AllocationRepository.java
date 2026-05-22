package com.bea.client.repository;

import com.bea.client.model.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, String> {

	List<Allocation> findByAddByOrderByDateSaisieDesc(String addBy);

	List<Allocation> findByAddByAndDateSaisieBetweenOrderByDateSaisieDesc(String addBy, LocalDate start, LocalDate end);

	boolean existsByNinAndDateSaisieBetween(String nin, LocalDate start, LocalDate end);

	Allocation findTopByAddByOrderByDateSaisieDesc(String addBy);
}
