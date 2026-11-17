package com.bibliotech.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "TEXTOS")
public class Texto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codt")
    private Integer codt;

    @Column(name = "titulo", length = 150, nullable = false)
    private String titulo;

    @Column(name = "resumen", length = 1000)
    private String resumen;

    @Column(name = "isbn", length = 20)
    private String isbn;

    @Column(name = "edicion")
    private Integer edicion;

    @Column(name = "fechapub")
    private LocalDate fechapub;

    @Column(name = "coda", nullable = false)
    private Integer coda;

    @Column(name = "code", nullable = false)
    private Integer code;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coda", insertable = false, updatable = false)
    private Area area;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "code", insertable = false, updatable = false)
    private Editorial editorial;
}
