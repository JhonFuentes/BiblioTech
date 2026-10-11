package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.RolUsu;
import com.bibliotech.backend.model.RolUsuId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolUsuRepository extends JpaRepository<RolUsu, RolUsuId> {
}
