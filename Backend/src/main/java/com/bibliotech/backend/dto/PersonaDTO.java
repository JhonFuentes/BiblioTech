package com.bibliotech.backend.dto;

import lombok.Data;
import java.util.List;

@Data
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
