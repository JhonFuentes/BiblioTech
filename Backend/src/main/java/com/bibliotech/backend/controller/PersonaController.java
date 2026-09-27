package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.PersonaDTO;
import com.bibliotech.backend.dto.AccesoDTO;
import com.bibliotech.backend.model.Persona;
import com.bibliotech.backend.model.Dato;
import com.bibliotech.backend.model.Telefono;
import com.bibliotech.backend.model.Usuario;
import com.bibliotech.backend.repository.PersonaRepository;
import com.bibliotech.backend.repository.DatoRepository;
import com.bibliotech.backend.repository.TelefonoRepository;
import com.bibliotech.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "*")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private DatoRepository datoRepository;
    @Autowired
    private TelefonoRepository telefonoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<PersonaDTO>> listarPersonas() {
        List<PersonaDTO> lista = personaRepository.findAll().stream().map(p -> {
            PersonaDTO dto = new PersonaDTO();
            dto.setCodper(p.getCodper());
            dto.setNombre(p.getNombre());
            dto.setAp(p.getAp());
            dto.setAm(p.getAm());
            dto.setGenero(p.getGenero());
            dto.setEstado(p.getEstado());
            dto.setTipoper(p.getTipoper());
            dto.setFoto(p.getFoto());

            datoRepository.findByCodper(p.getCodper()).ifPresent(d -> dto.setCi(d.getCi()));

            List<String> tels = telefonoRepository.findByCodper(p.getCodper())
                .stream().map(Telefono::getNumero).collect(Collectors.toList());
            dto.setTelefonos(tels);

            // Fetch user (assuming list is small or this is for demonstration. In prod, better to use joins)
            Optional<Usuario> userOpt = usuarioRepository.findAll().stream()
                .filter(u -> u.getPersona() != null && u.getPersona().getCodper().equals(p.getCodper())).findFirst();
            if (userOpt.isPresent()) {
                dto.setHasLogin(true);
                dto.setLogin(userOpt.get().getLogin());
            } else {
                dto.setHasLogin(false);
            }

            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<PersonaDTO> crearPersona(@RequestBody PersonaDTO dto) {
        Persona p = new Persona();
        p.setNombre(dto.getNombre());
        p.setAp(dto.getAp());
        p.setAm(dto.getAm());
        p.setGenero(dto.getGenero());
        p.setEstado(1);
        p.setTipoper(dto.getTipoper());
        p.setFoto(dto.getFoto());
        p = personaRepository.save(p);

        if (dto.getCi() != null) {
            Dato d = new Dato();
            d.setCi(dto.getCi());
            d.setCodper(p.getCodper());
            datoRepository.save(d);
        }

        if (dto.getTelefonos() != null) {
            for (String tel : dto.getTelefonos()) {
                Telefono t = new Telefono(p.getCodper(), tel);
                telefonoRepository.save(t);
            }
        }
        
        dto.setCodper(p.getCodper());
        dto.setEstado(1);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<PersonaDTO> modificarPersona(@PathVariable Integer id, @RequestBody PersonaDTO dto) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        Persona p = pOpt.get();
        p.setNombre(dto.getNombre());
        p.setAp(dto.getAp());
        p.setAm(dto.getAm());
        p.setGenero(dto.getGenero());
        p.setTipoper(dto.getTipoper());
        personaRepository.save(p);

        datoRepository.findByCodper(id).ifPresent(datoRepository::delete);
        if (dto.getCi() != null) {
            Dato d = new Dato();
            d.setCi(dto.getCi());
            d.setCodper(id);
            datoRepository.save(d);
        }

        telefonoRepository.deleteByCodper(id);
        if (dto.getTelefonos() != null) {
            for (String tel : dto.getTelefonos()) {
                Telefono t = new Telefono(id, tel);
                telefonoRepository.save(t);
            }
        }
        
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPersona(@PathVariable Integer id) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        Persona p = pOpt.get();
        p.setEstado(0);
        personaRepository.save(p);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> activarPersona(@PathVariable Integer id) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        Persona p = pOpt.get();
        p.setEstado(1);
        personaRepository.save(p);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/acceso")
    public ResponseEntity<?> asignarAcceso(@PathVariable Integer id, @RequestBody AccesoDTO acceso) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Usuario u = new Usuario();
        u.setLogin(acceso.getLogin());
        u.setPasswd(acceso.getPassword());
        u.setEstado(1);
        u.setPersona(pOpt.get());
        usuarioRepository.save(u);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/acceso")
    public ResponseEntity<?> modificarAcceso(@PathVariable Integer id, @RequestBody AccesoDTO acceso) {
        // En un caso real buscariamos por login o el usuario asociado a persona
        Optional<Usuario> userOpt = usuarioRepository.findAll().stream()
                .filter(u -> u.getPersona() != null && u.getPersona().getCodper().equals(id)).findFirst();
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Usuario u = userOpt.get();
        u.setPasswd(acceso.getPassword());
        usuarioRepository.save(u);
        return ResponseEntity.ok().build();
    }
}
