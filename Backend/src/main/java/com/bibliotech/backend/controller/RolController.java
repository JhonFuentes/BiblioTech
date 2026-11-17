package com.bibliotech.backend.controller;

import com.bibliotech.backend.model.Rol;
import com.bibliotech.backend.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RolController {

    @Autowired
    private RolRepository rolRepository;

    @GetMapping
    public ResponseEntity<List<Rol>> listar(
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(rolRepository.findListByFilters(nombre, estado));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Rol>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        Pageable pageable = PageRequest.of(page, size);
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(rolRepository.findByFilters(nombre, estado, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rol> obtenerPorId(@PathVariable Integer id) {
        return rolRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Rol rol) {
        if (rol.getNombre() == null || rol.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del rol es requerido"));
        }
        String nombre = rol.getNombre().trim();
        List<Rol> existentes = rolRepository.findByNombreIgnoreCaseTrimmed(nombre);
        if (!existentes.isEmpty()) {
            boolean activo = existentes.stream().anyMatch(r -> r.getEstado() != null && r.getEstado() == 1);
            if (activo) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un rol activo con el nombre '" + nombre + "'"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un rol con el nombre '" + nombre + "', pero se encuentra dado de baja. Puede habilitarlo en el listado."));
            }
        }
        rol.setNombre(nombre);
        rol.setEstado(1);
        Rol guardado = rolRepository.save(rol);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Integer id, @RequestBody Rol rol) {
        Optional<Rol> opt = rolRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        if (rol.getNombre() == null || rol.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del rol es requerido"));
        }
        String nombre = rol.getNombre().trim();
        List<Rol> existentes = rolRepository.findByNombreIgnoreCaseTrimmedAndCodrNot(nombre, id);
        if (!existentes.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro rol activo con el nombre '" + nombre + "'"));
        }

        Rol actual = opt.get();
        actual.setNombre(nombre);
        if (rol.getEstado() != null) actual.setEstado(rol.getEstado());
        Rol guardado = rolRepository.save(actual);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Optional<Rol> opt = rolRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Rol actual = opt.get();
        actual.setEstado(0);
        rolRepository.save(actual);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> activar(@PathVariable Integer id) {
        Optional<Rol> opt = rolRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Rol actual = opt.get();
        actual.setEstado(1);
        rolRepository.save(actual);
        return ResponseEntity.ok().build();
    }
}
