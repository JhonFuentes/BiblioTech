package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {
    
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Persona p WHERE " +
            "(cast(:nombre as string) IS NULL " +
            " OR LOWER(CONCAT(COALESCE(p.nombre, ''), ' ', COALESCE(p.ap, ''), ' ', COALESCE(p.am, ''))) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%')) " +
            " OR LOWER(CONCAT(COALESCE(p.ap, ''), ' ', COALESCE(p.am, ''), ' ', COALESCE(p.nombre, ''))) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
            "(:estado IS NULL OR p.estado = :estado) AND " +
            "(cast(:tipoper as string) IS NULL OR p.tipoper = cast(:tipoper as string)) " +
            "ORDER BY p.codper ASC")
    org.springframework.data.domain.Page<Persona> findByFilters(
            @org.springframework.data.repository.query.Param("nombre") String nombre, 
            @org.springframework.data.repository.query.Param("estado") Integer estado, 
            @org.springframework.data.repository.query.Param("tipoper") String tipoper, 
            org.springframework.data.domain.Pageable pageable);
}
