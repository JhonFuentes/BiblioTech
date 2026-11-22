package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.PrestamoDTO;
import com.bibliotech.backend.model.*;
import com.bibliotech.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prestamos")
@CrossOrigin(origins = "*")
public class PrestamoController {

    @Autowired
    private MprestamoRepository mprestamoRepository;
    @Autowired
    private DprestamoRepository dprestamoRepository;
    @Autowired
    private EjemplarRepository ejemplarRepository;
    @Autowired
    private DatoRepository datoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<PrestamoDTO>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String filtroEstudiante,
            @RequestParam(required = false) Integer estado) {

        String f = (filtroEstudiante != null && !filtroEstudiante.trim().isEmpty()) ? filtroEstudiante.trim() : null;
        Integer est = (estado != null && estado != -1) ? estado : null;

        List<PrestamoDTO> dtos = mprestamoRepository.findListByFilters(fechaInicio, fechaFin, f, est)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<PrestamoDTO>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String filtroEstudiante,
            @RequestParam(required = false) Integer estado) {

        Pageable pageable = PageRequest.of(page, size);
        String f = (filtroEstudiante != null && !filtroEstudiante.trim().isEmpty()) ? filtroEstudiante.trim() : null;
        Integer est = (estado != null && estado != -1) ? estado : null;

        Page<PrestamoDTO> paged = mprestamoRepository.findByFilters(fechaInicio, fechaFin, f, est, pageable)
                .map(this::mapToDTO);
        return ResponseEntity.ok(paged);
    }

    @GetMapping("/{codp}")
    public ResponseEntity<PrestamoDTO> obtenerPorId(@PathVariable Integer codp) {
        return mprestamoRepository.findById(codp)
                .map(m -> ResponseEntity.ok(this.mapToDTO(m)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 8.1 Módulo Aplicación Móvil: Listar préstamos de un usuario con detalle de libros
    @GetMapping("/usuario/{login}")
    public ResponseEntity<List<PrestamoDTO>> listarPorUsuario(@PathVariable String login) {
        Optional<Usuario> uOpt = usuarioRepository.findByLogin(login);
        Integer ciUsuario = null;
        if (uOpt.isPresent() && uOpt.get().getPersona() != null) {
            Optional<Dato> dOpt = datoRepository.findByCodper(uOpt.get().getPersona().getCodper());
            if (dOpt.isPresent()) {
                ciUsuario = dOpt.get().getCi();
            }
        }
        final Integer targetCi = ciUsuario;
        List<PrestamoDTO> dtos = mprestamoRepository.findAll().stream()
                .filter(m -> (targetCi != null && targetCi.equals(m.getCi())) || login.equalsIgnoreCase(m.getLogin()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private PrestamoDTO mapToDTO(Mprestamo m) {
        PrestamoDTO dto = new PrestamoDTO();
        dto.setCodp(m.getCodp());
        dto.setFecha(m.getFecha());
        dto.setFini(m.getFini());
        dto.setFfin(m.getFfin());
        dto.setTipopres(m.getTipopres());
        dto.setEstado(m.getEstado());
        dto.setCi(m.getCi());
        dto.setLogin(m.getLogin());

        // Nombre del estudiante
        if (m.getDato() != null && m.getDato().getPersona() != null) {
            Persona p = m.getDato().getPersona();
            dto.setEstudianteNombre((p.getNombre() + " " + (p.getAp() != null ? p.getAp() : "") + " " + (p.getAm() != null ? p.getAm() : "")).trim());
        } else {
            dto.setEstudianteNombre("CI: " + m.getCi());
        }

        // Detalles
        List<Dprestamo> dets = dprestamoRepository.findByCodp(m.getCodp());
        dto.setDetalles(dets.stream().map(d -> {
            PrestamoDTO.DetallePrestamoDTO dd = new PrestamoDTO.DetallePrestamoDTO();
            dd.setCodinv(d.getCodinv());
            dd.setEstado(d.getEstado());
            if (d.getEjemplar() != null && d.getEjemplar().getTexto() != null) {
                dd.setTitulo(d.getEjemplar().getTexto().getTitulo());
            } else {
                dd.setTitulo("Ejemplar #" + d.getCodinv());
            }
            return dd;
        }).collect(Collectors.toList()));

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
    @Transactional
    public ResponseEntity<?> crear(@RequestBody PrestamoDTO dto) {
        if (dto.getCi() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debe ingresar el CI del estudiante/lector"));
        }
        if (dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debe agregar al menos un ejemplar al préstamo"));
        }
        if (dto.getFini() == null || dto.getFfin() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Las fechas de inicio y fin son obligatorias"));
        }
        if (dto.getFfin().isBefore(dto.getFini())) {
            return ResponseEntity.badRequest().body(Map.of("message", "La fecha de fin no puede ser anterior a la fecha de inicio"));
        }

        Optional<Dato> datoOpt = datoRepository.findById(dto.getCi());
        if (datoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El número de CI " + dto.getCi() + " no está registrado como usuario/lector"));
        }

        // Validar que los ejemplares estén disponibles, activos y sin duplicados
        Set<Integer> codinvsVistos = new HashSet<>();
        for (PrestamoDTO.DetallePrestamoDTO item : dto.getDetalles()) {
            if (item.getCodinv() == null || !codinvsVistos.add(item.getCodinv())) {
                return ResponseEntity.badRequest().body(Map.of("message", "No puede incluir el mismo ejemplar más de una vez en el mismo préstamo"));
            }
            Optional<Ejemplar> ejOpt = ejemplarRepository.findById(item.getCodinv());
            if (ejOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El ejemplar con código " + item.getCodinv() + " no existe"));
            }
            Ejemplar ej = ejOpt.get();
            if (ej.getEstado() != 1 || ej.getDisponible() != 1) {
                return ResponseEntity.badRequest().body(Map.of("message", "El ejemplar " + ej.getCodinv() + " no está disponible para préstamo"));
            }
        }

        Mprestamo m = new Mprestamo();
        m.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        m.setFini(dto.getFini());
        m.setFfin(dto.getFfin());
        m.setTipopres(dto.getTipopres() != null ? dto.getTipopres() : 1);
        m.setEstado(1);
        m.setCi(dto.getCi());
        m.setLogin(getUsuarioActual());
        m = mprestamoRepository.save(m);

        for (PrestamoDTO.DetallePrestamoDTO item : dto.getDetalles()) {
            Dprestamo d = new Dprestamo(m.getCodp(), item.getCodinv(), 1); // 1 = Prestado
            dprestamoRepository.save(d);

            // Marcar ejemplar como ocupado
            Ejemplar ej = ejemplarRepository.findById(item.getCodinv()).get();
            ej.setDisponible(0); // 0 = Ocupado
            ejemplarRepository.save(ej);
        }

        return ResponseEntity.ok(mapToDTO(m));
    }

    @DeleteMapping("/{codp}")
    @Transactional
    public ResponseEntity<?> eliminar(@PathVariable Integer codp) {
        Optional<Mprestamo> opt = mprestamoRepository.findById(codp);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Mprestamo m = opt.get();
        m.setEstado(0); // Baja lógica
        mprestamoRepository.save(m);

        // Liberar ejemplares si estaban marcados como prestados en este préstamo
        List<Dprestamo> dets = dprestamoRepository.findByCodp(codp);
        for (Dprestamo d : dets) {
            if (d.getEstado() == 1) {
                d.setEstado(0);
                dprestamoRepository.save(d);
                ejemplarRepository.findById(d.getCodinv()).ifPresent(ej -> {
                    ej.setDisponible(1);
                    ejemplarRepository.save(ej);
                });
            }
        }

        return ResponseEntity.ok().build();
    }
}
