package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.TextoDTO;
import com.bibliotech.backend.model.*;
import com.bibliotech.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/textos")
@CrossOrigin(origins = "*")
public class TextoController {

    @Autowired
    private TextoRepository textoRepository;
    @Autowired
    private EscribenRepository escribenRepository;
    @Autowired
    private TipotexRepository tipotexRepository;
    @Autowired
    private AutorRepository autorRepository;
    @Autowired
    private TipoRepository tipoRepository;

    private static final String DOCS_DIR = "uploads/documentos/";

    @GetMapping
    public ResponseEntity<List<TextoDTO>> listar(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) Integer coda,
            @RequestParam(required = false) Integer code,
            @RequestParam(required = false) Integer codtipo,
            @RequestParam(required = false) Integer estado) {

        String f = (filtro != null && !filtro.trim().isEmpty()) ? filtro.trim() : null;
        Integer est = (estado != null && estado != -1) ? estado : null;
        List<TextoDTO> dtos = textoRepository.findListByFilters(f, coda, code, codtipo, est)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<TextoDTO>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) Integer coda,
            @RequestParam(required = false) Integer code,
            @RequestParam(required = false) Integer codtipo,
            @RequestParam(required = false) Integer estado) {

        Pageable pageable = PageRequest.of(page, size);
        String f = (filtro != null && !filtro.trim().isEmpty()) ? filtro.trim() : null;
        Integer est = (estado != null && estado != -1) ? estado : null;

        Page<TextoDTO> paged = textoRepository.findByFilters(f, coda, code, codtipo, est, pageable)
                .map(this::mapToDTO);
        return ResponseEntity.ok(paged);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TextoDTO> obtenerPorId(@PathVariable Integer id) {
        return textoRepository.findById(id)
                .map(t -> ResponseEntity.ok(this.mapToDTO(t)))
                .orElse(ResponseEntity.notFound().build());
    }

    private TextoDTO mapToDTO(Texto t) {
        TextoDTO dto = new TextoDTO();
        dto.setCodt(t.getCodt());
        dto.setTitulo(t.getTitulo());
        dto.setResumen(t.getResumen());
        dto.setIsbn(t.getIsbn());
        dto.setEdicion(t.getEdicion());
        dto.setFechapub(t.getFechapub());
        dto.setCoda(t.getCoda());
        dto.setAreaNombre(t.getArea() != null ? t.getArea().getNombre() : "");
        dto.setCode(t.getCode());
        dto.setEditorialNombre(t.getEditorial() != null ? t.getEditorial().getNombre() : "");
        dto.setEstado(t.getEstado());

        // Autores
        List<Escriben> escList = escribenRepository.findByCodt(t.getCodt());
        dto.setAutorIds(escList.stream().map(Escriben::getCoda).collect(Collectors.toList()));
        dto.setAutoresNombres(escList.stream().map(e -> {
            if (e.getAutor() != null) {
                return (e.getAutor().getNombre() + " " + (e.getAutor().getAp() != null ? e.getAutor().getAp() : "")).trim();
            }
            return "";
        }).collect(Collectors.toList()));

        // Tipos
        List<Tipotex> tipotexList = tipotexRepository.findByCodt(t.getCodt());
        dto.setTipos(tipotexList.stream().map(tx -> {
            TextoDTO.TipoTextoDTO tt = new TextoDTO.TipoTextoDTO();
            tt.setCodtipo(tx.getCodtipo());
            tt.setDocum(tx.getDocum());
            if (tx.getTipo() != null) {
                tt.setTipoNombre(tx.getTipo().getNombre());
                tt.setSw(tx.getTipo().getSw());
            }
            return tt;
        }).collect(Collectors.toList()));

        return dto;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> crear(@RequestBody TextoDTO dto) {
        if (dto.getTitulo() == null || dto.getTitulo().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El título del texto es requerido"));
        }
        if (dto.getCoda() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debe seleccionar un área temática"));
        }
        if (dto.getCode() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debe seleccionar una editorial"));
        }

        String titulo = dto.getTitulo().trim();
        Integer edicion = dto.getEdicion() != null ? dto.getEdicion() : 1;
        List<Texto> existentes = textoRepository.findByTituloAndEdicion(titulo, edicion);
        if (!existentes.isEmpty()) {
            boolean activo = existentes.stream().anyMatch(x -> x.getEstado() == 1);
            if (activo) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un texto activo con el título '" + titulo + "' y edición " + edicion));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe este texto pero se encuentra dado de baja. Puede habilitarlo en el listado."));
            }
        }

        Texto t = new Texto();
        t.setTitulo(titulo);
        t.setResumen(dto.getResumen());
        t.setIsbn(dto.getIsbn());
        t.setEdicion(edicion);
        t.setFechapub(dto.getFechapub());
        t.setCoda(dto.getCoda());
        t.setCode(dto.getCode());
        t.setEstado(1);
        t = textoRepository.save(t);

        guardarRelaciones(t.getCodt(), dto);

        return ResponseEntity.ok(mapToDTO(t));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> modificar(@PathVariable Integer id, @RequestBody TextoDTO dto) {
        Optional<Texto> opt = textoRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        if (dto.getTitulo() == null || dto.getTitulo().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El título del texto es requerido"));
        }
        String titulo = dto.getTitulo().trim();
        Integer edicion = dto.getEdicion() != null ? dto.getEdicion() : 1;

        List<Texto> existentes = textoRepository.findByTituloAndEdicionExcluding(titulo, edicion, id);
        if (!existentes.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro texto con el título '" + titulo + "' y edición " + edicion));
        }

        Texto t = opt.get();
        t.setTitulo(titulo);
        t.setResumen(dto.getResumen());
        t.setIsbn(dto.getIsbn());
        t.setEdicion(edicion);
        t.setFechapub(dto.getFechapub());
        if (dto.getCoda() != null) t.setCoda(dto.getCoda());
        if (dto.getCode() != null) t.setCode(dto.getCode());
        if (dto.getEstado() != null) t.setEstado(dto.getEstado());
        t = textoRepository.save(t);

        // Actualizar relaciones N a M
        escribenRepository.deleteByCodt(id);
        tipotexRepository.deleteByCodt(id);
        guardarRelaciones(id, dto);

        return ResponseEntity.ok(mapToDTO(t));
    }

    private void guardarRelaciones(Integer codt, TextoDTO dto) {
        if (dto.getAutorIds() != null) {
            for (Integer coda : dto.getAutorIds()) {
                if (coda != null) {
                    escribenRepository.save(new Escriben(coda, codt));
                }
            }
        }
        if (dto.getTipos() != null) {
            for (TextoDTO.TipoTextoDTO tt : dto.getTipos()) {
                if (tt.getCodtipo() != null) {
                    tipotexRepository.save(new Tipotex(codt, tt.getCodtipo(), tt.getDocum()));
                }
            }
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Optional<Texto> opt = textoRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Texto t = opt.get();
        t.setEstado(0);
        textoRepository.save(t);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> activar(@PathVariable Integer id) {
        Optional<Texto> opt = textoRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Texto t = opt.get();
        t.setEstado(1);
        textoRepository.save(t);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/uploadDocumento")
    public ResponseEntity<?> uploadDocumento(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Por favor seleccione un archivo PDF."));
        }
        try {
            File dir = new File(DOCS_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            }

            if (!extension.equals(".pdf") && !extension.equals(".epub")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Solo se permiten documentos en formato PDF o EPUB."));
            }

            String fileName = UUID.randomUUID().toString() + extension;
            Path path = Paths.get(DOCS_DIR + fileName);
            Files.write(path, file.getBytes());

            return ResponseEntity.ok(Map.of("success", true, "fileName", fileName, "originalName", originalFilename != null ? originalFilename : fileName));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al guardar el documento digital."));
        }
    }
}
