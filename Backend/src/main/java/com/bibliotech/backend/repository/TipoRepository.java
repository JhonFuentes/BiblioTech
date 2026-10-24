package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Tipo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoRepository extends JpaRepository<Tipo, Integer> {

    @Query("SELECT t FROM Tipo t WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(t.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR t.estado = :estado) " +
           "ORDER BY t.codtipo ASC")
    Page<Tipo> findByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("SELECT t FROM Tipo t WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(t.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR t.estado = :estado) " +
           "ORDER BY t.codtipo ASC")
    List<Tipo> findListByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado
    );
}
