package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Ddevol;
import com.bibliotech.backend.model.DdevolId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DdevolRepository extends JpaRepository<Ddevol, DdevolId> {
    List<Ddevol> findByCodd(Integer codd);

    @Modifying
    @Query(value = "UPDATE ddevol SET codinv = :nuevoCodinv WHERE codinv = :oldCodinv", nativeQuery = true)
    void actualizarCodinv(@Param("oldCodinv") Integer oldCodinv, @Param("nuevoCodinv") Integer nuevoCodinv);
}
