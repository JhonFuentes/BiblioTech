package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Ejemplar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EjemplarRepository extends JpaRepository<Ejemplar, Integer> {

    @Query("""
        SELECT e FROM Ejemplar e
        WHERE (:codt IS NULL OR e.codt = :codt)
          AND (:estado IS NULL OR e.estado = :estado)
        ORDER BY e.codinv ASC
    """)
    Page<Ejemplar> findByFilters(
            @Param("codt") Integer codt,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("""
        SELECT e FROM Ejemplar e
        WHERE (:codt IS NULL OR e.codt = :codt)
          AND (:estado IS NULL OR e.estado = :estado)
        ORDER BY e.codinv ASC
    """)
    List<Ejemplar> findListByFilters(
            @Param("codt") Integer codt,
            @Param("estado") Integer estado
    );

    List<Ejemplar> findByCodt(Integer codt);

    @Query("SELECT e FROM Ejemplar e WHERE e.disponible = 1 AND e.estado = 1 ORDER BY e.codinv ASC")
    List<Ejemplar> findLibres();

    @Query("SELECT COALESCE(MAX(e.codinv), 0) + 1 FROM Ejemplar e")
    Integer getNextCodinv();
}
