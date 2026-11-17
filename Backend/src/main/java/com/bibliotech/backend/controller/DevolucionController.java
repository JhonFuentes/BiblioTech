package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.DevolucionDTO;
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
@RequestMapping("/api/devoluciones")
@CrossOrigin(origins = "*")
public class DevolucionController {

    @Autowired
    private MdevolRepository mdevolRepository;
    @Autowired
    private DdevolRepository ddevolRepository;
    @Autowired
    private MprestamoRepository mprestamoRepository;
    @Autowired
    private DprestamoRepository dprestamoRepository;
    @Autowired
    private EjemplarRepository ejemplarRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/prestamos-pendientes")
    public ResponseEntity<List<PrestamoDTO>> listarPrestamosPendientes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String filtroEstudiante,
            @RequestParam(required = false) Integer codinv) {

        String f = (filtroEstudiante != null && !filtroEstudiante.trim().isEmpty()) ? filtroEstudiante.trim() : null;
        List<Mprestamo> prestamos = mprestamoRepository.findListByFilters(fechaInicio, fechaFin, f, 1);

        List<PrestamoDTO> result = new ArrayList<>();
        for (Mprestamo m : prestamos) {
            List<Dprestamo> dets = dprestamoRepository.findByCodp(m.getCodp());
            // Filtrar solo ejemplares pendientes de devolver (estado = 1)
            List<Dprestamo> pendientes = dets.stream().filter(d -> d.getEstado() == 1).toList();

            if (codinv != null) {
                pendientes = pendientes.stream().filter(d -> d.getCodinv().equals(codinv)).toList();
            }

            if (!pendientes.isEmpty()) {
                PrestamoDTO dto = new PrestamoDTO();
                dto.setCodp(m.getCodp());
                dto.setFecha(m.getFecha());
                dto.setFini(m.getFini());
                dto.setFfin(m.getFfin());
                dto.setTipopres(m.getTipopres());
                dto.setEstado(m.getEstado());
                dto.setCi(m.getCi());
                dto.setLogin(m.getLogin());

                if (m.getDato() != null && m.getDato().getPersona() != null) {
                    Persona p = m.getDato().getPersona();
                    dto.setEstudianteNombre((p.getNombre() + " " + (p.getAp() != null ? p.getAp() : "") + " " + (p.getAm() != null ? p.getAm() : "")).trim());
                } else {
                    dto.setEstudianteNombre("CI: " + m.getCi());
                }

                dto.setDetalles(pendientes.stream().map(d -> {
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

                result.add(dto);
            }
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<DevolucionDTO>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String filtroEstudiante,
            @RequestParam(required = false) Integer estado) {

        Pageable pageable = PageRequest.of(page, size);
        String f = (filtroEstudiante != null && !filtroEstudiante.trim().isEmpty()) ? filtroEstudiante.trim() : null;
        Integer est = (estado != null && estado != -1) ? estado : null;

        Page<DevolucionDTO> paged = mdevolRepository.findByFilters(fechaInicio, fechaFin, f, est, pageable)
                .map(this::mapToDTO);
        return ResponseEntity.ok(paged);
    }

    private DevolucionDTO mapToDTO(Mdevol d) {
        DevolucionDTO dto = new DevolucionDTO();
        dto.setCodd(d.getCodd());
        dto.setFecha(d.getFecha());
        dto.setEstado(d.getEstado());
        dto.setLogin(d.getLogin());
        dto.setCodp(d.getCodp());

        if (d.getPrestamo() != null) {
            dto.setFechaPrestamo(d.getPrestamo().getFecha());
            dto.setCi(d.getPrestamo().getCi());
            if (d.getPrestamo().getDato() != null && d.getPrestamo().getDato().getPersona() != null) {
                Persona p = d.getPrestamo().getDato().getPersona();
                dto.setEstudianteNombre((p.getNombre() + " " + (p.getAp() != null ? p.getAp() : "") + " " + (p.getAm() != null ? p.getAm() : "")).trim());
            }
        }

        List<Ddevol> dets = ddevolRepository.findByCodd(d.getCodd());
        dto.setEjemplaresIds(dets.stream().map(Ddevol::getCodinv).collect(Collectors.toList()));
        dto.setEjemplaresTitulos(dets.stream().map(dd -> {
            if (dd.getEjemplar() != null && dd.getEjemplar().getTexto() != null) {
                return dd.getEjemplar().getTexto().getTitulo();
            }
            return "Ejemplar #" + dd.getCodinv();
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
    public ResponseEntity<?> registrarDevolucion(@RequestBody DevolucionDTO dto) {
        if (dto.getCodp() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debe seleccionar un préstamo a devolver"));
        }
        if (dto.getEjemplaresIds() == null || dto.getEjemplaresIds().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debe seleccionar al menos un ejemplar a devolver"));
        }

        Optional<Mprestamo> prestamoOpt = mprestamoRepository.findById(dto.getCodp());
        if (prestamoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El préstamo especificado no existe"));
        }

        Mdevol m = new Mdevol();
        m.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        m.setEstado(1);
        m.setLogin(getUsuarioActual());
        m.setCodp(dto.getCodp());
        m = mdevolRepository.save(m);

        for (Integer codinv : dto.getEjemplaresIds()) {
            Ddevol dd = new Ddevol(m.getCodd(), codinv);
            ddevolRepository.save(dd);

            // Actualizar estado en DPRESTAMO: 0 = Devuelto
            dprestamoRepository.findById(new DprestamoId(dto.getCodp(), codinv)).ifPresent(dp -> {
                dp.setEstado(0);
                dprestamoRepository.save(dp);
            });

            // Actualizar disponibilidad en EJEMPLARES: 1 = Libre
            ejemplarRepository.findById(codinv).ifPresent(ej -> {
                ej.setDisponible(1);
                ejemplarRepository.save(ej);
            });
        }

        return ResponseEntity.ok(mapToDTO(m));
    }

    @PostMapping("/{codd}/anular")
    @Transactional
    public ResponseEntity<?> anularDevolucion(@PathVariable Integer codd) {
        Optional<Mdevol> opt = mdevolRepository.findById(codd);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Mdevol d = opt.get();
        d.setEstado(0); // Anulado
        mdevolRepository.save(d);

        // Revertir ejemplares: marcar de nuevo como prestados
        List<Ddevol> dets = ddevolRepository.findByCodd(codd);
        for (Ddevol dd : dets) {
            // Revertir en DPRESTAMO: 1 = Prestado
            dprestamoRepository.findById(new DprestamoId(d.getCodp(), dd.getCodinv())).ifPresent(dp -> {
                dp.setEstado(1);
                dprestamoRepository.save(dp);
            });

            // Revertir en EJEMPLARES: 0 = Ocupado
            ejemplarRepository.findById(dd.getCodinv()).ifPresent(ej -> {
                ej.setDisponible(0);
                ejemplarRepository.save(ej);
            });
        }

        return ResponseEntity.ok().build();
    }
}
