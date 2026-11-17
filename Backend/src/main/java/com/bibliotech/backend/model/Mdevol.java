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
@Table(name = "MDEVOL")
public class Mdevol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codd")
    private Integer codd;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1=Activo, 0=Anulado

    @Column(name = "login", length = 15, nullable = false)
    private String login;

    @Column(name = "codp", nullable = false)
    private Integer codp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "login", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codp", referencedColumnName = "codp", insertable = false, updatable = false)
    private Mprestamo prestamo;

    @OneToMany(mappedBy = "devolucion", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("devolucion")
    private List<Ddevol> detalles;
}
