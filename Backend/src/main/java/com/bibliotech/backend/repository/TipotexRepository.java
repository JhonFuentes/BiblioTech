package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Tipotex;
import com.bibliotech.backend.model.TipotexId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipotexRepository extends JpaRepository<Tipotex, TipotexId> {
    List<Tipotex> findByCodt(Integer codt);
    void deleteByCodt(Integer codt);
    List<Tipotex> findByDocumIsNotNull();
}
