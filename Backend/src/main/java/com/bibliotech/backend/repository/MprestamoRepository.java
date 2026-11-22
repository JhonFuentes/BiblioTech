package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Mprestamo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MprestamoRepository extends JpaRepository<Mprestamo, Integer> {

    List<Mprestamo> findByCi(Integer ci);

    @Modifying
    @Query(value = "UPDATE mprestamo SET ci = :nuevoCi WHERE ci = :oldCi", nativeQuery = true)
    void actualizarCi(@Param("oldCi") Integer oldCi, @Param("nuevoCi") Integer nuevoCi);

    @Query("""
        SELECT DISTINCT m FROM Mprestamo m
        LEFT JOIN m.dato d
        LEFT JOIN Persona p ON p.codper = d.codper
        WHERE (cast(:fechaInicio as LocalDate) IS NULL OR m.fecha >= :fechaInicio)
          AND (cast(:fechaFin as LocalDate) IS NULL OR m.fecha <= :fechaFin)
          AND (cast(:filtroEstudiante as string) IS NULL
               OR CAST(m.ci as string) LIKE CONCAT('%', cast(:filtroEstudiante as string), '%')
               OR LOWER(CONCAT(COALESCE(p.nombre, ''), ' ', COALESCE(p.ap, ''), ' ', COALESCE(p.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtroEstudiante as string), '%')))
          AND (:estado IS NULL OR m.estado = :estado)
        ORDER BY m.codp DESC
    """)
    Page<Mprestamo> findByFilters(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("filtroEstudiante") String filtroEstudiante,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT m FROM Mprestamo m
        LEFT JOIN m.dato d
        LEFT JOIN Persona p ON p.codper = d.codper
        WHERE (cast(:fechaInicio as LocalDate) IS NULL OR m.fecha >= :fechaInicio)
          AND (cast(:fechaFin as LocalDate) IS NULL OR m.fecha <= :fechaFin)
          AND (cast(:filtroEstudiante as string) IS NULL
               OR CAST(m.ci as string) LIKE CONCAT('%', cast(:filtroEstudiante as string), '%')
               OR LOWER(CONCAT(COALESCE(p.nombre, ''), ' ', COALESCE(p.ap, ''), ' ', COALESCE(p.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtroEstudiante as string), '%')))
          AND (:estado IS NULL OR m.estado = :estado)
        ORDER BY m.codp DESC
    """)
    List<Mprestamo> findListByFilters(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("filtroEstudiante") String filtroEstudiante,
            @Param("estado") Integer estado
    );
}
