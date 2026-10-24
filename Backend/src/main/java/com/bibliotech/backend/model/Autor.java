package com.bibliotech.backend.model;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

@Entity
@Table(name = "AUTORES")
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coda")
    private Integer coda;

    @Column(name = "nombre", length = 60, nullable = false)
    private String nombre;

    @Column(name = "ap", length = 40)
    private String ap;

    @Column(name = "am", length = 40)
    private String am;

    @Column(name = "genero", length = 1, nullable = false)
    private String genero; // F=femenino, M=masculino

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;
}
