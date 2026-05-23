package com.bea.client.repository;

import com.bea.client.model.Allocation;
import com.bea.client.model.Client;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

	@Query("""
		select c.cli
		from Client c
		where not exists (
			select 1
			from Allocation a
			where a.addBy = c.cli
			and a.dateSaisie between :start and :end
		)
		order by c.cli
	""")
	List<String> findCliWithoutTouristAllocationBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
