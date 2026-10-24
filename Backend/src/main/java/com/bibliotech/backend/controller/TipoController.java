package com.bibliotech.backend.controller;

import com.bibliotech.backend.model.Tipo;
import com.bibliotech.backend.repository.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipos")
@CrossOrigin(origins = "*")
public class TipoController {

    @Autowired
    private TipoRepository tipoRepository;

    @GetMapping
    public ResponseEntity<List<Tipo>> listar(
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(tipoRepository.findListByFilters(nombre, estado));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Tipo>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        Pageable pageable = PageRequest.of(page, size);
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(tipoRepository.findByFilters(nombre, estado, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tipo> obtenerPorId(@PathVariable Integer id) {
        return tipoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Tipo tipo) {
        if (tipo.getNombre() == null || tipo.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre del tipo es requerido\"}");
        }
        tipo.setNombre(tipo.getNombre().trim());
        tipo.setEstado(1);
        if (tipo.getSw() == null) {
            tipo.setSw(0);
        }
        Tipo guardado = tipoRepository.save(tipo);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Integer id, @RequestBody Tipo tipo) {
        Optional<Tipo> opt = tipoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (tipo.getNombre() == null || tipo.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre del tipo es requerido\"}");
        }
        Tipo actual = opt.get();
        actual.setNombre(tipo.getNombre().trim());
        if (tipo.getSw() != null) {
            actual.setSw(tipo.getSw());
        }
        if (tipo.getEstado() != null) {
            actual.setEstado(tipo.getEstado());
        }
        Tipo guardado = tipoRepository.save(actual);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLogicamente(@PathVariable Integer id) {
        Optional<Tipo> opt = tipoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Tipo actual = opt.get();
        actual.setEstado(0);
        tipoRepository.save(actual);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> habilitar(@PathVariable Integer id) {
        Optional<Tipo> opt = tipoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Tipo actual = opt.get();
        actual.setEstado(1);
        tipoRepository.save(actual);
        return ResponseEntity.ok().build();
    }
}
