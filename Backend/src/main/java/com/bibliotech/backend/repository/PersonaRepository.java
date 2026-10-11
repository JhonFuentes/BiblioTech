package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {
    
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Persona p WHERE " +
            "(:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) OR LOWER(p.ap) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
            "(:estado IS NULL OR p.estado = :estado) AND " +
            "(:tipoper IS NULL OR p.tipoper = :tipoper)")
    org.springframework.data.domain.Page<Persona> findByFilters(
            @org.springframework.data.repository.query.Param("nombre") String nombre, 
            @org.springframework.data.repository.query.Param("estado") Integer estado, 
            @org.springframework.data.repository.query.Param("tipoper") String tipoper, 
            org.springframework.data.domain.Pageable pageable);
}
