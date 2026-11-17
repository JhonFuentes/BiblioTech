package com.bibliotech.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class TextoDTO {
    private Integer codt;
    private String titulo;
    private String resumen;
    private String isbn;
    private Integer edicion;
    private LocalDate fechapub;
    private Integer coda;
    private String areaNombre;
    private Integer code;
    private String editorialNombre;
    private Integer estado;

    // Relaciones N a M
    private List<Integer> autorIds;
    private List<String> autoresNombres;

    // Tipos y documentos
    private List<TipoTextoDTO> tipos;

    @Data
    @NoArgsConstructor
    public static class TipoTextoDTO {
        private Integer codtipo;
        private String tipoNombre;
        private Integer sw;
        private String docum;
    }
}
