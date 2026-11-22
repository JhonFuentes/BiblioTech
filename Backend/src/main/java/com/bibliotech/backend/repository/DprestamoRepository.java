package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Dprestamo;
import com.bibliotech.backend.model.DprestamoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DprestamoRepository extends JpaRepository<Dprestamo, DprestamoId> {
    List<Dprestamo> findByCodp(Integer codp);
    List<Dprestamo> findByCodinv(Integer codinv);

    @Modifying
    @Query(value = "UPDATE dprestamo SET codinv = :nuevoCodinv WHERE codinv = :oldCodinv", nativeQuery = true)
    void actualizarCodinv(@Param("oldCodinv") Integer oldCodinv, @Param("nuevoCodinv") Integer nuevoCodinv);
}
