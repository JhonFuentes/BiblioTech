package com.bibliotech.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor

public class MenuDTO {
    private Integer codm;
    private String nombre;
    private Integer estado;
    private List<ProcesoDTO> procesos = new ArrayList<>();
}
