package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Ddevol;
import com.bibliotech.backend.model.DdevolId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DdevolRepository extends JpaRepository<Ddevol, DdevolId> {
    List<Ddevol> findByCodd(Integer codd);
}
