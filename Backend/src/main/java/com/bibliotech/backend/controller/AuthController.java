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

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Optional<Usuario> userOpt = usuarioRepository.findByLogin(request.getLogin());

        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("El usuario no existe");
        }

        Usuario user = userOpt.get();

        boolean passwordMatches = false;
        if (user.getPasswd() != null && request.getPassword() != null) {
            String stored = user.getPasswd();
            if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
                passwordMatches = passwordEncoder.matches(request.getPassword(), stored);
            } else {
                passwordMatches = request.getPassword().equals(stored) || passwordEncoder.matches(request.getPassword(), stored);
            }
        }

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Contraseña incorrecta");
        }

        if (user.getEstado() == null || user.getEstado() != 1
                || (user.getPersona() != null && user.getPersona().getEstado() != null && user.getPersona().getEstado() != 1)) {
            throw new InactiveUserException("Usuario inactivo");
        }

        String nombreCompleto = "Usuario";
        if (user.getPersona() != null) {
            String nom = user.getPersona().getNombre() != null ? user.getPersona().getNombre() : "";
            String ap = user.getPersona().getAp() != null ? user.getPersona().getAp() : "";
            String am = user.getPersona().getAm() != null ? user.getPersona().getAm() : "";
            nombreCompleto = (nom + " " + ap + " " + am).trim().replaceAll("\\s+", " ");
        }
        String foto = user.getPersona() != null ? user.getPersona().getFoto() : null;
        
        String token = jwtUtil.generateToken(user.getLogin());

        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        
        String cedula = "";
        if (user.getPersona() != null) {
            Optional<Dato> datoOpt = datoRepository.findByCodper(user.getPersona().getCodper());
            if (datoOpt.isPresent()) {
                cedula = String.valueOf(datoOpt.get().getCi());
            }
        }
        String saludos = "Infor";
        
        return ResponseEntity.ok(new AuthResponse(true, "Login exitoso", fecha, cedula, nombreCompleto, foto, token, user.getLogin(), saludos));
    }
}
