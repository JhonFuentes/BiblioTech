package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Rol;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    @Query("SELECT r FROM Rol r WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(r.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR r.estado = :estado) " +
           "ORDER BY r.codr ASC")
    Page<Rol> findByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado,
            Pageable pageable
    );

    @Query("SELECT r FROM Rol r WHERE " +
           "(cast(:nombre as string) IS NULL OR LOWER(r.nombre) LIKE LOWER(CONCAT('%', cast(:nombre as string), '%'))) AND " +
           "(:estado IS NULL OR r.estado = :estado) " +
           "ORDER BY r.codr ASC")
    List<Rol> findListByFilters(
            @Param("nombre") String nombre,
            @Param("estado") Integer estado
    );

    @Query("SELECT r FROM Rol r WHERE LOWER(TRIM(r.nombre)) = LOWER(TRIM(:nombre))")
    List<Rol> findByNombreIgnoreCaseTrimmed(@Param("nombre") String nombre);

    @Query("SELECT r FROM Rol r WHERE LOWER(TRIM(r.nombre)) = LOWER(TRIM(:nombre)) AND r.codr != :codr")
    List<Rol> findByNombreIgnoreCaseTrimmedAndCodrNot(@Param("nombre") String nombre, @Param("codr") Integer codr);
}
