package com.bibliotech.backend.controller;

import com.bibliotech.backend.model.Area;
import com.bibliotech.backend.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "*")
public class AreaController {

    @Autowired
    private AreaRepository areaRepository;

    @GetMapping
    public ResponseEntity<List<Area>> listar(
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(areaRepository.findListByFilters(nombre, estado));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Area>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        Pageable pageable = PageRequest.of(page, size);
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(areaRepository.findByFilters(nombre, estado, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Area> obtenerPorId(@PathVariable Integer id) {
        return areaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Area area) {
        if (area.getNombre() == null || area.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del área es requerido"));
        }
        String nombre = area.getNombre().trim();
        List<Area> existentes = areaRepository.findByNombreIgnoreCaseTrimmed(nombre);
        if (!existentes.isEmpty()) {
            boolean activa = existentes.stream().anyMatch(a -> a.getEstado() != null && a.getEstado() == 1);
            if (activa) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un área activa con el nombre '" + nombre + "'"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un área con el nombre '" + nombre + "', pero se encuentra dada de baja. Puede habilitarla en el listado."));
            }
        }
        area.setNombre(nombre);
        area.setEstado(1);
        Area guardada = areaRepository.save(area);
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Integer id, @RequestBody Area area) {
        Optional<Area> opt = areaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (area.getNombre() == null || area.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del área es requerido"));
        }
        String nombre = area.getNombre().trim();
        List<Area> existentes = areaRepository.findByNombreIgnoreCaseTrimmedAndCodaNot(nombre, id);
        if (!existentes.isEmpty()) {
            boolean activa = existentes.stream().anyMatch(a -> a.getEstado() != null && a.getEstado() == 1);
            if (activa) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otra área activa con el nombre '" + nombre + "'"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otra área con el nombre '" + nombre + "', pero se encuentra dada de baja."));
            }
        }
        Area actual = opt.get();
        actual.setNombre(nombre);
        if (area.getEstado() != null) {
            actual.setEstado(area.getEstado());
        }
        Area guardada = areaRepository.save(actual);
        return ResponseEntity.ok(guardada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLogicamente(@PathVariable Integer id) {
        Optional<Area> opt = areaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Area actual = opt.get();
        actual.setEstado(0);
        areaRepository.save(actual);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> habilitar(@PathVariable Integer id) {
        Optional<Area> opt = areaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Area actual = opt.get();
        actual.setEstado(1);
        areaRepository.save(actual);
        return ResponseEntity.ok().build();
    }
}
