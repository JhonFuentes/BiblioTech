package com.bibliotech.backend.model;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

@Entity
@Table(name = "TIPOS")
public class Tipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codtipo")
    private Integer codtipo;

    @Column(name = "nombre", length = 40, nullable = false)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    @Column(name = "sw", nullable = false)
    private Integer sw = 0; // 1=Que suba el libro digital, 0=Es por defecto
}
