package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.AuthRequest;
import com.bibliotech.backend.dto.AuthResponse;
import com.bibliotech.backend.model.Usuario;
import com.bibliotech.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permitir llamadas desde Angular
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // En una app real la contraseña iría encriptada, aquí seguimos el requerimiento básico para B-3.1
        Optional<Usuario> userOpt = usuarioRepository.findByLoginAndPasswdAndEstado(request.getLogin(), request.getPassword(), 1);

        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            String nombreCompleto = user.getPersona() != null ? 
                    user.getPersona().getNombre() + " " + user.getPersona().getAp() : "Usuario";
            
            return ResponseEntity.ok(new AuthResponse(true, "Login exitoso", nombreCompleto, "Administrativo"));
        } else {
            return ResponseEntity.status(401).body(new AuthResponse(false, "Credenciales incorrectas o usuario inactivo", null, null));
        }
    }
}
