package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Dato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DatoRepository extends JpaRepository<Dato, Integer> {
    Optional<Dato> findByCodper(Integer codper);
}
