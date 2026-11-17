package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.AsignacionItemDTO;
import com.bibliotech.backend.model.*;
import com.bibliotech.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "*")
public class AsignacionController {

    @Autowired
    private ProcesoRepository procesoRepository;
    @Autowired
    private MenuRepository menuRepository;
    @Autowired
    private MeProRepository meProRepository;

    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private RolMeRepository rolMeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolUsuRepository rolUsuRepository;

    // ==========================================
    // B-17: MEPRO (Procesos asignados a un Menú)
    // ==========================================
    @GetMapping("/mepro/menu/{codm}")
    public ResponseEntity<List<AsignacionItemDTO>> listarProcesosPorMenu(@PathVariable Integer codm) {
        Set<Integer> asignados = meProRepository.findByCodm(codm).stream()
                .map(MePro::getCodp).collect(Collectors.toSet());

        List<AsignacionItemDTO> result = procesoRepository.findAll().stream()
                .filter(p -> p.getEstado() != null && p.getEstado() == 1)
                .map(p -> new AsignacionItemDTO(
                        String.valueOf(p.getCodp()),
                        p.getNombre(),
                        p.getEnlace(),
                        asignados.contains(p.getCodp())
                )).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/mepro/toggle")
    @Transactional
    public ResponseEntity<?> toggleMePro(@RequestBody Map<String, Object> body) {
        Integer codm = Integer.parseInt(body.get("codm").toString());
        Integer codp = Integer.parseInt(body.get("codp").toString());
        boolean asignar = Boolean.parseBoolean(body.get("asignar").toString());

        MeProId id = new MeProId(codm, codp);
        if (asignar) {
            if (!meProRepository.existsById(id)) {
                meProRepository.save(new MePro(codm, codp));
            }
        } else {
            if (meProRepository.existsById(id)) {
                meProRepository.deleteById(id);
            }
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    // ==========================================
    // B-18: ROLME (Menús asignados a un Rol)
    // ==========================================
    @GetMapping("/rolme/rol/{codr}")
    public ResponseEntity<List<AsignacionItemDTO>> listarMenusPorRol(@PathVariable Integer codr) {
        Set<Integer> asignados = rolMeRepository.findByCodr(codr).stream()
                .map(RolMe::getCodm).collect(Collectors.toSet());

        List<AsignacionItemDTO> result = menuRepository.findAll().stream()
                .filter(m -> m.getEstado() != null && m.getEstado() == 1)
                .map(m -> new AsignacionItemDTO(
                        String.valueOf(m.getCodm()),
                        m.getNombre(),
                        "Menú del sistema",
                        asignados.contains(m.getCodm())
                )).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/rolme/toggle")
    @Transactional
    public ResponseEntity<?> toggleRolMe(@RequestBody Map<String, Object> body) {
        Integer codr = Integer.parseInt(body.get("codr").toString());
        Integer codm = Integer.parseInt(body.get("codm").toString());
        boolean asignar = Boolean.parseBoolean(body.get("asignar").toString());

        RolMeId id = new RolMeId(codr, codm);
        if (asignar) {
            if (!rolMeRepository.existsById(id)) {
                rolMeRepository.save(new RolMe(codr, codm));
            }
        } else {
            if (rolMeRepository.existsById(id)) {
                rolMeRepository.deleteById(id);
            }
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    // ==========================================
    // B-19: ROLUSU (Roles asignados a un Usuario)
    // ==========================================
    @GetMapping("/rolusu/usuario/{login}")
    public ResponseEntity<List<AsignacionItemDTO>> listarRolesPorUsuario(@PathVariable String login) {
        Set<Integer> asignados = rolUsuRepository.findByLogin(login).stream()
                .map(RolUsu::getCodr).collect(Collectors.toSet());

        List<AsignacionItemDTO> result = rolRepository.findAll().stream()
                .filter(r -> r.getEstado() != null && r.getEstado() == 1)
                .map(r -> new AsignacionItemDTO(
                        String.valueOf(r.getCodr()),
                        r.getNombre(),
                        "Rol de acceso",
                        asignados.contains(r.getCodr())
                )).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/rolusu/toggle")
    @Transactional
    public ResponseEntity<?> toggleRolUsu(@RequestBody Map<String, Object> body) {
        String login = body.get("login").toString();
        Integer codr = Integer.parseInt(body.get("codr").toString());
        boolean asignar = Boolean.parseBoolean(body.get("asignar").toString());

        RolUsuId id = new RolUsuId(codr, login);
        if (asignar) {
            if (!rolUsuRepository.existsById(id)) {
                rolUsuRepository.save(new RolUsu(codr, login));
            }
        } else {
            if (rolUsuRepository.existsById(id)) {
                rolUsuRepository.deleteById(id);
            }
        }
        return ResponseEntity.ok(Map.of("success", true));
    }
}
