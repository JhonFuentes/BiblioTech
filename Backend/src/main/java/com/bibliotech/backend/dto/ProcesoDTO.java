package com.bibliotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcesoDTO {
    private Integer codp;
    private String nombre;
    private String enlace;
    private Integer estado;
}
