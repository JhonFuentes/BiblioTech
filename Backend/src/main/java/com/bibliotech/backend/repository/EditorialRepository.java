package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Editorial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EditorialRepository extends JpaRepository<Editorial, Integer> {

    @Query("SELECT e FROM Editorial e WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(e.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR e.estado = :estado) " +
           "ORDER BY e.code ASC")
    Page<Editorial> findByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("SELECT e FROM Editorial e WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(e.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR e.estado = :estado) " +
           "ORDER BY e.code ASC")
    List<Editorial> findListByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado
    );
}
