package com.bibliotech.backend.repository;

import com.bibliotech.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Optional<Usuario> findByLoginAndPasswdAndEstado(String login, String passwd, Integer estado);
}
