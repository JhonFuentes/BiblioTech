package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.AuthRequest;
import com.bibliotech.backend.dto.AuthResponse;
import com.bibliotech.backend.model.Usuario;
import com.bibliotech.backend.repository.UsuarioRepository;
import com.bibliotech.backend.repository.DatoRepository;
import com.bibliotech.backend.model.Dato;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import com.bibliotech.backend.exception.UserNotFoundException;
import com.bibliotech.backend.exception.InvalidCredentialsException;
import com.bibliotech.backend.exception.InactiveUserException;

import com.bibliotech.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DatoRepository datoRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Optional<Usuario> userOpt = usuarioRepository.findByLogin(request.getLogin());

        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("El usuario no existe");
        }

        Usuario user = userOpt.get();

        if (user.getPasswd() == null || !user.getPasswd().equals(request.getPassword())) {
            throw new InvalidCredentialsException("Contraseña incorrecta");
        }

        if (user.getEstado() == null || user.getEstado() != 1) {
            throw new InactiveUserException("Usuario inactivo");
        }

        String nombreCompleto = user.getPersona() != null ? 
                user.getPersona().getNombre() + " " + user.getPersona().getAp() : "Usuario";
        String foto = user.getPersona() != null ? user.getPersona().getFoto() : null;
        
        // Generar el token JWT
        String token = jwtUtil.generateToken(user.getLogin());

        // Generar fecha en formato dd-MM-yyyy
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        
        String cedula = "";
        if (user.getPersona() != null) {
            Optional<Dato> datoOpt = datoRepository.findByCodper(user.getPersona().getCodper());
            if (datoOpt.isPresent()) {
                cedula = String.valueOf(datoOpt.get().getCi());
            }
        }
        
        return ResponseEntity.ok(new AuthResponse(true, "Login exitoso", nombreCompleto, "Administrativo", user.getLogin(), foto, token, fecha, cedula, user.getLogin(), nombreCompleto));
    }
}
