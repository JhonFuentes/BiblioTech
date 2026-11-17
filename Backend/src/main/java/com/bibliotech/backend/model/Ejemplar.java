package com.bibliotech.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "EJEMPLARES")
public class Ejemplar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codinv")
    private Integer codinv;

    @Column(name = "disponible", nullable = false)
    private Integer disponible = 1; // 1=Libre, 0=Ocupado

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1=Activo, 0=Anulado

    @Column(name = "codt", nullable = false)
    private Integer codt;

    @Column(name = "per_resp", length = 15, nullable = false)
    private String per_resp;

    @Column(name = "per_anula", length = 15)
    private String per_anula;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codt", insertable = false, updatable = false)
    private Texto texto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "per_resp", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuarioResp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "per_anula", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuarioAnula;
}
