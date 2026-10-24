package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.MePro;
import com.bibliotech.backend.model.MeProId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeProRepository extends JpaRepository<MePro, MeProId> {
    List<MePro> findByCodm(Integer codm);
}
