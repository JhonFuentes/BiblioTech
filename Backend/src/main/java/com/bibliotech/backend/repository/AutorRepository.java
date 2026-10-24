package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Autor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutorRepository extends JpaRepository<Autor, Integer> {

    @Query("SELECT a FROM Autor a WHERE " +
           "(cast(:filtro as string) IS NULL OR LOWER(CONCAT(COALESCE(a.nombre, ''), ' ', COALESCE(a.ap, ''), ' ', COALESCE(a.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtro as string), '%'))) AND " +
           "(:estado IS NULL OR a.estado = :estado) " +
           "ORDER BY a.coda ASC")
    Page<Autor> findByFilters(
            @Param("filtro") String filtro,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("SELECT a FROM Autor a WHERE " +
           "(cast(:filtro as string) IS NULL OR LOWER(CONCAT(COALESCE(a.nombre, ''), ' ', COALESCE(a.ap, ''), ' ', COALESCE(a.am, ''))) LIKE LOWER(CONCAT('%', cast(:filtro as string), '%'))) AND " +
           "(:estado IS NULL OR a.estado = :estado) " +
           "ORDER BY a.coda ASC")
    List<Autor> findListByFilters(
            @Param("filtro") String filtro,
            @Param("estado") Integer estado
    );
}
