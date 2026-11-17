package com.bibliotech.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class DevolucionDTO {
    private Integer codd;
    private LocalDate fecha;
    private Integer estado; // 1=Activo, 0=Anulado
    private String login;
    private Integer codp;

    // Datos del préstamo referenciado
    private Integer ci;
    private String estudianteNombre;
    private LocalDate fechaPrestamo;

    // Lista de ejemplares que se devolvieron
    private List<Integer> ejemplaresIds;
    private List<String> ejemplaresTitulos;
}
