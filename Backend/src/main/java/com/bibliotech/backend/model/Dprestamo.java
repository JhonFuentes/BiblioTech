package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DPRESTAMO")
@IdClass(DprestamoId.class)
public class Dprestamo {

    @Id
    @Column(name = "codp")
    private Integer codp;

    @Id
    @Column(name = "codinv")
    private Integer codinv;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1=Prestado/Activo, 0=Devuelto

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codp", insertable = false, updatable = false)
    @JsonIgnore
    private Mprestamo prestamo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codinv", insertable = false, updatable = false)
    private Ejemplar ejemplar;

    public Dprestamo(Integer codp, Integer codinv, Integer estado) {
        this.codp = codp;
        this.codinv = codinv;
        this.estado = estado;
    }
}
