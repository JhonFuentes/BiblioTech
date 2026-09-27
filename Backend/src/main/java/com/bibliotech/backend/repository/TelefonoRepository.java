package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Telefono;
import com.bibliotech.backend.model.TelefonoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelefonoRepository extends JpaRepository<Telefono, TelefonoId> {
    List<Telefono> findByCodper(Integer codper);
    void deleteByCodper(Integer codper);
}
