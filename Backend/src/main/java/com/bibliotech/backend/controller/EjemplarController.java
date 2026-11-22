package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.EjemplarDTO;
import com.bibliotech.backend.model.Ejemplar;
import com.bibliotech.backend.model.Texto;
import com.bibliotech.backend.model.Usuario;
import com.bibliotech.backend.repository.DdevolRepository;
import com.bibliotech.backend.repository.DprestamoRepository;
import com.bibliotech.backend.repository.EjemplarRepository;
import com.bibliotech.backend.repository.TextoRepository;
import com.bibliotech.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ejemplares")
@CrossOrigin(origins = "*")
public class EjemplarController {

    @Autowired
    private EjemplarRepository ejemplarRepository;
    @Autowired
    private TextoRepository textoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private DprestamoRepository dprestamoRepository;
    @Autowired
    private DdevolRepository ddevolRepository;

    @GetMapping
    public ResponseEntity<List<EjemplarDTO>> listar(
            @RequestParam(required = false) Integer codt,
            @RequestParam(required = false) Integer estado) {
        Integer est = (estado != null && estado != -1) ? estado : null;
        List<EjemplarDTO> dtos = ejemplarRepository.findListByFilters(codt, est)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<EjemplarDTO>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer codt,
            @RequestParam(required = false) Integer estado) {
        Pageable pageable = PageRequest.of(page, size);
        Integer est = (estado != null && estado != -1) ? estado : null;
        Page<EjemplarDTO> paged = ejemplarRepository.findByFilters(codt, est, pageable)
                .map(this::mapToDTO);
        return ResponseEntity.ok(paged);
    }

    @GetMapping("/libres")
    public ResponseEntity<List<EjemplarDTO>> listarLibres() {
        List<EjemplarDTO> dtos = ejemplarRepository.findLibres()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EjemplarDTO> obtenerPorId(@PathVariable Integer id) {
        return ejemplarRepository.findById(id)
                .map(e -> ResponseEntity.ok(this.mapToDTO(e)))
                .orElse(ResponseEntity.notFound().build());
    }

    private EjemplarDTO mapToDTO(Ejemplar e) {
        EjemplarDTO dto = new EjemplarDTO();
        dto.setCodinv(e.getCodinv());
        dto.setDisponible(e.getDisponible());
        dto.setEstado(e.getEstado());
        dto.setCodt(e.getCodt());
        dto.setTituloTexto(e.getTexto() != null ? e.getTexto().getTitulo() : "");
        dto.setPer_resp(e.getPer_resp());
        dto.setPer_anula(e.getPer_anula());
        return dto;
    }

    private String getUsuarioActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")
                && usuarioRepository.existsById(auth.getName())) {
            return auth.getName();
        }
        return usuarioRepository.findAll().stream().map(Usuario::getLogin).findFirst().orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EjemplarDTO dto) {
        if (dto.getCodt() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debe seleccionar un texto para registrar el ejemplar"));
        }
        Optional<Texto> textoOpt = textoRepository.findById(dto.getCodt());
        if (textoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El texto especificado no existe"));
        }

        // Si se envió un codinv manual, verificar si ya existe
        if (dto.getCodinv() != null && ejemplarRepository.existsById(dto.getCodinv())) {
            return ResponseEntity.badRequest().body(Map.of("message", "El número de inventario " + dto.getCodinv() + " ya está registrado"));
        }

        Ejemplar e = new Ejemplar();
        if (dto.getCodinv() != null) {
            e.setCodinv(dto.getCodinv());
        } else {
            e.setCodinv(ejemplarRepository.getNextCodinv());
        }
        e.setCodt(dto.getCodt());
        e.setDisponible(1); // Libre
        e.setEstado(1); // Activo
        e.setPer_resp(getUsuarioActual());

        Ejemplar guardado = ejemplarRepository.save(e);
        return ResponseEntity.ok(mapToDTO(guardado));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> modificar(@PathVariable Integer id, @RequestBody EjemplarDTO dto) {
        Optional<Ejemplar> opt = ejemplarRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Ejemplar e = opt.get();

        // B-11.2: Permitir modificar el Nro. de Inventario (codinv) validando si está repetido
        if (dto.getCodinv() != null && !dto.getCodinv().equals(id)) {
            if (ejemplarRepository.existsById(dto.getCodinv())) {
                return ResponseEntity.badRequest().body(Map.of("message", "El número de inventario " + dto.getCodinv() + " ya está registrado"));
            }

            Ejemplar nuevo = new Ejemplar();
            nuevo.setCodinv(dto.getCodinv());
            nuevo.setCodt(dto.getCodt() != null ? dto.getCodt() : e.getCodt());
            nuevo.setDisponible(dto.getDisponible() != null ? dto.getDisponible() : e.getDisponible());
            nuevo.setEstado(dto.getEstado() != null ? dto.getEstado() : e.getEstado());
            nuevo.setPer_resp(e.getPer_resp());
            nuevo.setPer_anula(e.getPer_anula());

            Ejemplar guardadoNuevo = ejemplarRepository.saveAndFlush(nuevo);
            dprestamoRepository.actualizarCodinv(id, dto.getCodinv());
            ddevolRepository.actualizarCodinv(id, dto.getCodinv());
            ejemplarRepository.delete(e);
            ejemplarRepository.flush();
            return ResponseEntity.ok(mapToDTO(guardadoNuevo));
        }

        if (dto.getDisponible() != null) e.setDisponible(dto.getDisponible());
        if (dto.getEstado() != null) e.setEstado(dto.getEstado());

        Ejemplar guardado = ejemplarRepository.save(e);
        return ResponseEntity.ok(mapToDTO(guardado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Optional<Ejemplar> opt = ejemplarRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Ejemplar e = opt.get();
        e.setEstado(0); // Baja lógica
        e.setPer_anula(getUsuarioActual());
        ejemplarRepository.save(e);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> activar(@PathVariable Integer id) {
        Optional<Ejemplar> opt = ejemplarRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Ejemplar e = opt.get();
        e.setEstado(1); // Reactivar
        e.setPer_anula(null);
        ejemplarRepository.save(e);
        return ResponseEntity.ok().build();
    }
}
