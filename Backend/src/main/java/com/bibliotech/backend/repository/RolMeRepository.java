package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.RolMe;
import com.bibliotech.backend.model.RolMeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolMeRepository extends JpaRepository<RolMe, RolMeId> {
}
