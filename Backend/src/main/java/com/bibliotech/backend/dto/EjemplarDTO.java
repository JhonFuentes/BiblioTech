package com.bibliotech.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EjemplarDTO {
    private Integer codinv;
    private Integer disponible; // 1=Libre, 0=Ocupado
    private Integer estado; // 1=Activo, 0=Anulado
    private Integer codt;
    private String tituloTexto;
    private String per_resp;
    private String per_anula;
}
