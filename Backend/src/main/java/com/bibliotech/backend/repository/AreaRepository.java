package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Area;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaRepository extends JpaRepository<Area, Integer> {

    @Query("SELECT a FROM Area a WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(a.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR a.estado = :estado) " +
           "ORDER BY a.coda ASC")
    Page<Area> findByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("SELECT a FROM Area a WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(a.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR a.estado = :estado) " +
           "ORDER BY a.coda ASC")
    List<Area> findListByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado
    );
}
