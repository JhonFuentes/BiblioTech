package com.bibliotech.backend.controller;

import com.bibliotech.backend.model.Editorial;
import com.bibliotech.backend.repository.EditorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/editoriales")
@CrossOrigin(origins = "*")
public class EditorialController {

    @Autowired
    private EditorialRepository editorialRepository;

    @GetMapping
    public ResponseEntity<List<Editorial>> listar(
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(editorialRepository.findListByFilters(nombre, estado));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Editorial>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        Pageable pageable = PageRequest.of(page, size);
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(editorialRepository.findByFilters(nombre, estado, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Editorial> obtenerPorId(@PathVariable Integer id) {
        return editorialRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Editorial editorial) {
        /*if (editorial.getNombre() == null || editorial.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre de la editorial es requerido\"}");
        }*/
    	if (editorial.getNombre() == null || editorial.getNombre().trim().isEmpty() || editorial.getNivel() == null ) {
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre de la editorial y el nivel son requerido\"}");
        }
        editorial.setNombre(editorial.getNombre().trim());
        editorial.setEstado(1);
        editorial.setNivel(editorial.getNivel());
        Editorial guardada = editorialRepository.save(editorial);
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Integer id, @RequestBody Editorial editorial) {
        Optional<Editorial> opt = editorialRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (editorial.getNombre() == null || editorial.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre de la editorial es requerido\"}");
        }
        Editorial actual = opt.get();
        actual.setNombre(editorial.getNombre().trim());
        if (editorial.getEstado() != null) {
            actual.setEstado(editorial.getEstado());
        }
        Editorial guardada = editorialRepository.save(actual);
        return ResponseEntity.ok(guardada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLogicamente(@PathVariable Integer id) {
        Optional<Editorial> opt = editorialRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Editorial actual = opt.get();
        actual.setEstado(0);
        editorialRepository.save(actual);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> habilitar(@PathVariable Integer id) {
        Optional<Editorial> opt = editorialRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Editorial actual = opt.get();
        actual.setEstado(1);
        editorialRepository.save(actual);
        return ResponseEntity.ok().build();
    }
}
