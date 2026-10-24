package com.bibliotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonaDTO {
    private Integer codper;
    private Integer ci;
    private String nombre;
    private String ap;
    private String am;
    private String genero;
    private Integer estado;
    private String tipoper;
    private String foto;
    private List<String> telefonos;
    private boolean hasLogin;
    private String login;
}
