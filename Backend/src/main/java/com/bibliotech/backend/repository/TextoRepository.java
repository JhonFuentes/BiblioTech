package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Texto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TextoRepository extends JpaRepository<Texto, Integer> {

    @Query("""
        SELECT DISTINCT t FROM Texto t
        LEFT JOIN Escriben e ON e.codt = t.codt
        LEFT JOIN Autor a ON a.coda = e.coda
        LEFT JOIN Tipotex tx ON tx.codt = t.codt
        WHERE (cast(:filtro as string) IS NULL OR LOWER(t.titulo) LIKE LOWER(CONCAT('%', cast(:filtro as string), '%'))
               OR LOWER(CONCAT(COALESCE(a.nombre, ''), ' ', COALESCE(a.ap, ''), ' ', COALESCE(a.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtro as string), '%')))
          AND (:coda IS NULL OR t.coda = :coda)
          AND (:code IS NULL OR t.code = :code)
          AND (:codtipo IS NULL OR tx.codtipo = :codtipo)
          AND (:estado IS NULL OR t.estado = :estado)
        ORDER BY t.codt ASC
    """)
    Page<Texto> findByFilters(
            @Param("filtro") String filtro,
            @Param("coda") Integer coda,
            @Param("code") Integer code,
            @Param("codtipo") Integer codtipo,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT t FROM Texto t
        LEFT JOIN Escriben e ON e.codt = t.codt
        LEFT JOIN Autor a ON a.coda = e.coda
        LEFT JOIN Tipotex tx ON tx.codt = t.codt
        WHERE (cast(:filtro as string) IS NULL OR LOWER(t.titulo) LIKE LOWER(CONCAT('%', cast(:filtro as string), '%'))
               OR LOWER(CONCAT(COALESCE(a.nombre, ''), ' ', COALESCE(a.ap, ''), ' ', COALESCE(a.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtro as string), '%')))
          AND (:coda IS NULL OR t.coda = :coda)
          AND (:code IS NULL OR t.code = :code)
          AND (:codtipo IS NULL OR tx.codtipo = :codtipo)
          AND (:estado IS NULL OR t.estado = :estado)
        ORDER BY t.codt ASC
    """)
    List<Texto> findListByFilters(
            @Param("filtro") String filtro,
            @Param("coda") Integer coda,
            @Param("code") Integer code,
            @Param("codtipo") Integer codtipo,
            @Param("estado") Integer estado
    );

    @Query("SELECT t FROM Texto t WHERE LOWER(TRIM(t.titulo)) = LOWER(TRIM(:titulo)) AND t.edicion = :edicion")
    List<Texto> findByTituloAndEdicion(@Param("titulo") String titulo, @Param("edicion") Integer edicion);

    @Query("SELECT t FROM Texto t WHERE LOWER(TRIM(t.titulo)) = LOWER(TRIM(:titulo)) AND t.edicion = :edicion AND t.codt != :codt")
    List<Texto> findByTituloAndEdicionExcluding(@Param("titulo") String titulo, @Param("edicion") Integer edicion, @Param("codt") Integer codt);
}
