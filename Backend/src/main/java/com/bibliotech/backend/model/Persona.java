package com.bibliotech.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "personas")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codper;

    private String nombre;
    private String ap;
    private String am;
    private String genero;
    private Integer estado;
    private String tipoper;
    private String foto;
}
