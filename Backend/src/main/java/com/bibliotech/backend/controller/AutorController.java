package com.bibliotech.backend.controller;

import com.bibliotech.backend.model.Autor;
import com.bibliotech.backend.repository.AutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/autores")
@CrossOrigin(origins = "*")
public class AutorController {

    @Autowired
    private AutorRepository autorRepository;

    @GetMapping
    public ResponseEntity<List<Autor>> listar(
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        String filtro = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(autorRepository.findListByFilters(filtro, estado));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Autor>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado) {
        Pageable pageable = PageRequest.of(page, size);
        String filtro = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre.trim() : null;
        Integer estado = (filtroEstado != null && filtroEstado != -1) ? filtroEstado : null;
        return ResponseEntity.ok(autorRepository.findByFilters(filtro, estado, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Autor> obtenerPorId(@PathVariable Integer id) {
        return autorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Autor autor) {
        if (autor.getNombre() == null || autor.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre del autor es requerido\"}");
        }
        if (autor.getGenero() == null || (!autor.getGenero().equals("M") && !autor.getGenero().equals("F"))) {
            autor.setGenero("M");
        }
        autor.setNombre(autor.getNombre().trim());
        if (autor.getAp() != null) autor.setAp(autor.getAp().trim());
        if (autor.getAm() != null) autor.setAm(autor.getAm().trim());
        autor.setEstado(1);
        Autor guardado = autorRepository.save(autor);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Integer id, @RequestBody Autor autor) {
        Optional<Autor> opt = autorRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (autor.getNombre() == null || autor.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\": \"El nombre del autor es requerido\"}");
        }
        Autor actual = opt.get();
        actual.setNombre(autor.getNombre().trim());
        actual.setAp(autor.getAp() != null ? autor.getAp().trim() : null);
        actual.setAm(autor.getAm() != null ? autor.getAm().trim() : null);
        if (autor.getGenero() != null) {
            actual.setGenero(autor.getGenero());
        }
        if (autor.getEstado() != null) {
            actual.setEstado(autor.getEstado());
        }
        Autor guardado = autorRepository.save(actual);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLogicamente(@PathVariable Integer id) {
        Optional<Autor> opt = autorRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Autor actual = opt.get();
        actual.setEstado(0);
        autorRepository.save(actual);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> habilitar(@PathVariable Integer id) {
        Optional<Autor> opt = autorRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Autor actual = opt.get();
        actual.setEstado(1);
        autorRepository.save(actual);
        return ResponseEntity.ok().build();
    }
}
