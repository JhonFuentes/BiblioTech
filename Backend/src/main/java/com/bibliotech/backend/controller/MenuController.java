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

    // Endpoints CRUD para B-16 Gestión Menús
    @GetMapping("/crud")
    public ResponseEntity<List<Menu>> listarCrud(
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(menuRepository.findListByFilters(nombre, estado));
    }

    @GetMapping("/crud/page")
    public ResponseEntity<org.springframework.data.domain.Page<Menu>> listarCrudPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(menuRepository.findByFilters(nombre, estado, pageable));
    }

    @PostMapping("/crud")
    public ResponseEntity<?> crearMenu(@RequestBody Menu menu) {
        if (menu.getNombre() == null || menu.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del menú es requerido"));
        }
        String nombre = menu.getNombre().trim();
        List<Menu> existentes = menuRepository.findByNombreIgnoreCaseTrimmed(nombre);
        if (!existentes.isEmpty()) {
            boolean activo = existentes.stream().anyMatch(m -> m.getEstado() != null && m.getEstado() == 1);
            if (activo) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un menú activo con el nombre '" + nombre + "'"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un menú con el nombre '" + nombre + "', pero se encuentra dado de baja."));
            }
        }
        menu.setNombre(nombre);
        menu.setEstado(1);
        Menu guardado = menuRepository.save(menu);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/crud/{id}")
    public ResponseEntity<?> modificarMenu(@PathVariable Integer id, @RequestBody Menu menu) {
        Optional<Menu> opt = menuRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        if (menu.getNombre() == null || menu.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del menú es requerido"));
        }
        String nombre = menu.getNombre().trim();
        List<Menu> existentes = menuRepository.findByNombreIgnoreCaseTrimmedAndCodmNot(nombre, id);
        if (!existentes.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro menú activo con el nombre '" + nombre + "'"));
        }

        Menu actual = opt.get();
        actual.setNombre(nombre);
        if (menu.getEstado() != null) actual.setEstado(menu.getEstado());
        Menu guardado = menuRepository.save(actual);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/crud/{id}")
    public ResponseEntity<?> eliminarMenu(@PathVariable Integer id) {
        Optional<Menu> opt = menuRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Menu actual = opt.get();
        actual.setEstado(0);
        menuRepository.save(actual);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/crud/{id}/activar")
    public ResponseEntity<?> activarMenu(@PathVariable Integer id) {
        Optional<Menu> opt = menuRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Menu actual = opt.get();
        actual.setEstado(1);
        menuRepository.save(actual);
        return ResponseEntity.ok().build();
    }
}
