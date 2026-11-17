package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "MPRESTAMO")
public class Mprestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codp")
    private Integer codp;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "fini", nullable = false)
    private LocalDate fini;

    @Column(name = "ffin", nullable = false)
    private LocalDate ffin;

    @Column(name = "tipopres", nullable = false)
    private Integer tipopres; // 1=Dom, 2=Sala

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1=Activo, 0=Anulado

    @Column(name = "ci", nullable = false)
    private Integer ci;

    @Column(name = "login", length = 15, nullable = false)
    private String login;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ci", referencedColumnName = "ci", insertable = false, updatable = false)
    private Dato dato;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "login", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "prestamo", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("prestamo")
    private List<Dprestamo> detalles;
}
