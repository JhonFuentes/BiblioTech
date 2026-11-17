package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer> {

    @Query("SELECT m FROM Menu m WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR m.estado = :estado) " +
           "ORDER BY m.codm ASC")
    Page<Menu> findByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("SELECT m FROM Menu m WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR m.estado = :estado) " +
           "ORDER BY m.codm ASC")
    List<Menu> findListByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado
    );

    @Query("SELECT m FROM Menu m WHERE LOWER(TRIM(m.nombre)) = LOWER(TRIM(:nombre))")
    List<Menu> findByNombreIgnoreCaseTrimmed(@Param("nombre") String nombre);

    @Query("SELECT m FROM Menu m WHERE LOWER(TRIM(m.nombre)) = LOWER(TRIM(:nombre)) AND m.codm != :codm")
    List<Menu> findByNombreIgnoreCaseTrimmedAndCodmNot(@Param("nombre") String nombre, @Param("codm") Integer codm);
}
