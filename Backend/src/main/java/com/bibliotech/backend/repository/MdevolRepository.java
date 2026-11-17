package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Mdevol;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MdevolRepository extends JpaRepository<Mdevol, Integer> {

    @Query("""
        SELECT DISTINCT d FROM Mdevol d
        LEFT JOIN d.prestamo m
        LEFT JOIN m.dato dt
        LEFT JOIN Persona p ON p.codper = dt.codper
        WHERE (cast(:fechaInicio as LocalDate) IS NULL OR d.fecha >= :fechaInicio)
          AND (cast(:fechaFin as LocalDate) IS NULL OR d.fecha <= :fechaFin)
          AND (cast(:filtroEstudiante as string) IS NULL
               OR CAST(m.ci as string) LIKE CONCAT('%', cast(:filtroEstudiante as string), '%')
               OR LOWER(CONCAT(COALESCE(p.nombre, ''), ' ', COALESCE(p.ap, ''), ' ', COALESCE(p.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtroEstudiante as string), '%')))
          AND (:estado IS NULL OR d.estado = :estado)
        ORDER BY d.codd DESC
    """)
    Page<Mdevol> findByFilters(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("filtroEstudiante") String filtroEstudiante,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT d FROM Mdevol d
        LEFT JOIN d.prestamo m
        LEFT JOIN m.dato dt
        LEFT JOIN Persona p ON p.codper = dt.codper
        WHERE (cast(:fechaInicio as LocalDate) IS NULL OR d.fecha >= :fechaInicio)
          AND (cast(:fechaFin as LocalDate) IS NULL OR d.fecha <= :fechaFin)
          AND (cast(:filtroEstudiante as string) IS NULL
               OR CAST(m.ci as string) LIKE CONCAT('%', cast(:filtroEstudiante as string), '%')
               OR LOWER(CONCAT(COALESCE(p.nombre, ''), ' ', COALESCE(p.ap, ''), ' ', COALESCE(p.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtroEstudiante as string), '%')))
          AND (:estado IS NULL OR d.estado = :estado)
        ORDER BY d.codd DESC
    """)
    List<Mdevol> findListByFilters(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("filtroEstudiante") String filtroEstudiante,
            @Param("estado") Integer estado
    );
}
