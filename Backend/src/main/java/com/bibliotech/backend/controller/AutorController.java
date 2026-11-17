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
import java.util.Map;

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
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del autor es requerido"));
        }
        String nombre = autor.getNombre().trim();
        String ap = (autor.getAp() != null && !autor.getAp().trim().isEmpty()) ? autor.getAp().trim() : "";
        String am = (autor.getAm() != null && !autor.getAm().trim().isEmpty()) ? autor.getAm().trim() : "";

        List<Autor> existentes = autorRepository.findDuplicate(nombre, ap, am);
        if (!existentes.isEmpty()) {
            String nombreCompleto = String.join(" ", java.util.Arrays.asList(nombre, ap, am).stream().filter(s -> !s.isEmpty()).toList());
            boolean activa = existentes.stream().anyMatch(a -> a.getEstado() != null && a.getEstado() == 1);
            if (activa) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un autor activo con el nombre '" + nombreCompleto + "'"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un autor con el nombre '" + nombreCompleto + "', pero se encuentra dado de baja. Puede habilitarlo en el listado."));
            }
        }

        if (autor.getGenero() == null || (!autor.getGenero().equals("M") && !autor.getGenero().equals("F"))) {
            autor.setGenero("M");
        }
        autor.setNombre(nombre);
        autor.setAp(ap.isEmpty() ? null : ap);
        autor.setAm(am.isEmpty() ? null : am);
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
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre del autor es requerido"));
        }
        String nombre = autor.getNombre().trim();
        String ap = (autor.getAp() != null && !autor.getAp().trim().isEmpty()) ? autor.getAp().trim() : "";
        String am = (autor.getAm() != null && !autor.getAm().trim().isEmpty()) ? autor.getAm().trim() : "";

        List<Autor> existentes = autorRepository.findDuplicateExcludingCoda(nombre, ap, am, id);
        if (!existentes.isEmpty()) {
            String nombreCompleto = String.join(" ", java.util.Arrays.asList(nombre, ap, am).stream().filter(s -> !s.isEmpty()).toList());
            boolean activa = existentes.stream().anyMatch(a -> a.getEstado() != null && a.getEstado() == 1);
            if (activa) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro autor activo con el nombre '" + nombreCompleto + "'"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro autor con el nombre '" + nombreCompleto + "', pero se encuentra dado de baja."));
            }
        }

        Autor actual = opt.get();
        actual.setNombre(nombre);
        actual.setAp(ap.isEmpty() ? null : ap);
        actual.setAm(am.isEmpty() ? null : am);
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
