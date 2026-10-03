package com.bibliotech.backend.controller;

import com.bibliotech.backend.model.Persona;
import com.bibliotech.backend.model.Usuario;
import com.bibliotech.backend.repository.PersonaRepository;
import com.bibliotech.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UploadController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PersonaRepository personaRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/uploadFoto")
    public ResponseEntity<?> uploadFoto(@RequestParam("file") MultipartFile file, @RequestParam("login") String login) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Por favor seleccione un archivo.");
        }

        try {
            Optional<Usuario> userOpt = usuarioRepository.findById(login);
            if (userOpt.isEmpty() || userOpt.get().getPersona() == null) {
                return ResponseEntity.badRequest().body("Usuario no encontrado.");
            }

            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            Usuario user = userOpt.get();
            Persona persona = user.getPersona();

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = persona.getCodper() + extension;
            
            // Eliminar foto anterior si tiene un nombre distinto (distinta extensión)
            if (persona.getFoto() != null) {
                File oldFile = new File(UPLOAD_DIR + persona.getFoto());
                if (oldFile.exists() && !persona.getFoto().equals(fileName)) {
                    oldFile.delete();
                }
            }

            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());

            persona.setFoto(fileName);
            personaRepository.save(persona);

            return ResponseEntity.ok().body("{\"success\":true, \"message\":\"Foto actualizada con éxito\", \"foto\":\"" + fileName + "\"}");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al subir el archivo.");
        }
    }
}
