package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.TextoDTO;
import com.bibliotech.backend.model.*;
import com.bibliotech.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/catalogo-digital")
@CrossOrigin(origins = "*")
public class CatalogoDigitalController {

    @Autowired
    private TextoRepository textoRepository;
    @Autowired
    private TipotexRepository tipotexRepository;
    @Autowired
    private EscribenRepository escribenRepository;

    @GetMapping("/busqueda")
    public ResponseEntity<Map<String, Object>> buscarMaterialDigital(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) Integer coda,
            @RequestParam(required = false) Integer code,
            @RequestParam(required = false) Integer codtipo) {

        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String fTitulo = (titulo != null && !titulo.trim().isEmpty()) ? titulo.trim().toLowerCase() : null;
        String fAutor = (autor != null && !autor.trim().isEmpty()) ? autor.trim().toLowerCase() : null;

        // Obtener textos que coincidan con los filtros base
        List<Texto> textos = textoRepository.findListByFilters(q, coda, code, codtipo);

        List<TextoDTO> digitales = new ArrayList<>();
        for (Texto t : textos) {
            if (TextoController.obtenerEstadoTexto(t.getCodt()) != 1) {
                continue;
            }
            if (fTitulo != null && (t.getTitulo() == null || !t.getTitulo().toLowerCase().contains(fTitulo))) {
                continue;
            }

            List<Escriben> esc = escribenRepository.findByCodt(t.getCodt());
            List<String> autoresList = esc.stream().map(e -> {
                if (e.getAutor() != null) {
                    Autor a = e.getAutor();
                    return (a.getNombre() + " " + (a.getAp() != null ? a.getAp() : "") + " " + (a.getAm() != null ? a.getAm() : "")).trim().replaceAll("\\s+", " ");
                }
                return "";
            }).filter(s -> !s.isEmpty()).collect(Collectors.toList());

            if (fAutor != null) {
                boolean matchAutor = autoresList.stream().anyMatch(a -> a.toLowerCase().contains(fAutor));
                if (!matchAutor) continue;
            }

            List<Tipotex> txs = tipotexRepository.findByCodt(t.getCodt()).stream()
                    .filter(tx -> tx.getDocum() != null && !tx.getDocum().trim().isEmpty())
                    .filter(tx -> codtipo == null || Objects.equals(tx.getCodtipo(), codtipo))
                    .toList();

            if (!txs.isEmpty()) {
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
                dto.setEstado(1);
                dto.setAutoresNombres(autoresList);

                dto.setTipos(txs.stream().map(tx -> {
                    TextoDTO.TipoTextoDTO tt = new TextoDTO.TipoTextoDTO();
                    tt.setCodtipo(tx.getCodtipo());
                    tt.setDocum(tx.getDocum());
                    if (tx.getTipo() != null) {
                        tt.setTipoNombre(tx.getTipo().getNombre());
                        tt.setSw(tx.getTipo().getSw());
                    }
                    return tt;
                }).collect(Collectors.toList()));

                digitales.add(dto);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("total", digitales.size());
        response.put("items", digitales);
        return ResponseEntity.ok(response);
    }
}
