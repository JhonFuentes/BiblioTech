package com.bibliotech.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class PrestamoDTO {
    private Integer codp;
    private LocalDate fecha;
    private LocalDate fini;
    private LocalDate ffin;
    private Integer tipopres; // 1=Dom, 2=Sala
    private Integer estado; // 1=Activo, 0=Anulado
    private Integer ci;
    private String estudianteNombre;
    private String login;

    private List<DetallePrestamoDTO> detalles;

    @Data
    @NoArgsConstructor
    public static class DetallePrestamoDTO {
        private Integer codinv;
        private String titulo;
        private Integer estado; // 1=Prestado, 0=Devuelto
    }
}
