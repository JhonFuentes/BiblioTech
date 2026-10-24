package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.MenuDTO;
import com.bibliotech.backend.dto.ProcesoDTO;
import com.bibliotech.backend.dto.RolDTO;
import com.bibliotech.backend.model.*;
import com.bibliotech.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private RolUsuRepository rolUsuRepository;

    @Autowired
    private RolMeRepository rolMeRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MeProRepository meProRepository;

    @Autowired
    private ProcesoRepository procesoRepository;

    @GetMapping("/roles")
    public ResponseEntity<List<RolDTO>> listarRoles() {
        List<RolDTO> roles = rolRepository.findAll().stream()
                .filter(r -> r.getEstado() != null && r.getEstado() == 1)
                .map(r -> new RolDTO(r.getCodr(), r.getNombre(), r.getEstado()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/usuario/{login}/roles")
    public ResponseEntity<List<RolDTO>> obtenerRolesUsuario(@PathVariable String login) {
        List<RolUsu> rolUsus = rolUsuRepository.findByLogin(login);
        List<RolDTO> roles = new ArrayList<>();
        for (RolUsu ru : rolUsus) {
            Rol r = ru.getRol();
            if (r != null && r.getEstado() != null && r.getEstado() == 1) {
                roles.add(new RolDTO(r.getCodr(), r.getNombre(), r.getEstado()));
            }
        }
        // If user has no roles assigned directly in database, return all active roles by default
        if (roles.isEmpty()) {
            roles = rolRepository.findAll().stream()
                    .filter(r -> r.getEstado() != null && r.getEstado() == 1)
                    .map(r -> new RolDTO(r.getCodr(), r.getNombre(), r.getEstado()))
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/rol/{codr}")
    public ResponseEntity<List<MenuDTO>> obtenerMenusPorRol(@PathVariable Integer codr) {
        List<RolMe> rolMes = rolMeRepository.findByCodr(codr);
        List<MenuDTO> result = new ArrayList<>();

        for (RolMe rm : rolMes) {
            Menu m = rm.getMenu();
            if (m != null && m.getEstado() != null && m.getEstado() == 1) {
                MenuDTO dto = new MenuDTO();
                dto.setCodm(m.getCodm());
                dto.setNombre(m.getNombre());
                dto.setEstado(m.getEstado());

                List<MePro> mePros = meProRepository.findByCodm(m.getCodm());
                List<ProcesoDTO> procesos = new ArrayList<>();
                for (MePro mp : mePros) {
                    Proceso p = mp.getProceso();
                    if (p != null && p.getEstado() != null && p.getEstado() == 1) {
                        procesos.add(new ProcesoDTO(p.getCodp(), p.getNombre(), p.getEnlace(), p.getEstado()));
                    }
                }
                dto.setProcesos(procesos);
                result.add(dto);
            }
        }

        // If no specific assignment exists yet, fallback to all active menus
        if (result.isEmpty()) {
            return listarTodosLosMenus();
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<MenuDTO>> listarTodosLosMenus() {
        List<Menu> menus = menuRepository.findAll().stream()
                .filter(m -> m.getEstado() != null && m.getEstado() == 1)
                .collect(Collectors.toList());

        List<MenuDTO> result = new ArrayList<>();
        for (Menu m : menus) {
            MenuDTO dto = new MenuDTO();
            dto.setCodm(m.getCodm());
            dto.setNombre(m.getNombre());
            dto.setEstado(m.getEstado());

            List<MePro> mePros = meProRepository.findByCodm(m.getCodm());
            List<ProcesoDTO> procesos = new ArrayList<>();
            for (MePro mp : mePros) {
                Proceso p = mp.getProceso();
                if (p != null && p.getEstado() != null && p.getEstado() == 1) {
                    procesos.add(new ProcesoDTO(p.getCodp(), p.getNombre(), p.getEnlace(), p.getEstado()));
                }
            }
            dto.setProcesos(procesos);
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }
}
