package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Escriben;
import com.bibliotech.backend.model.EscribenId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscribenRepository extends JpaRepository<Escriben, EscribenId> {
    List<Escriben> findByCodt(Integer codt);
    void deleteByCodt(Integer codt);
}
