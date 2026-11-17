package com.bibliotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsignacionItemDTO {
    private String id; // Codigo o Login
    private String nombre;
    private String detalle;
    private boolean asignado;
}
