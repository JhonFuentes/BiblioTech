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
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre del área es requerido\"}");
        }
        area.setNombre(area.getNombre().trim());
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
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre del área es requerido\"}");
        }
        Area actual = opt.get();
        actual.setNombre(area.getNombre().trim());
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
