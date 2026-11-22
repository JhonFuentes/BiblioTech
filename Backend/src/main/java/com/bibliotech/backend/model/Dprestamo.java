package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

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

    public Dprestamo() {
    }

    public Dprestamo(Integer codp, Integer codinv, Integer estado, Mprestamo prestamo, Ejemplar ejemplar) {
        this.codp = codp;
        this.codinv = codinv;
        this.estado = estado;
        this.prestamo = prestamo;
        this.ejemplar = ejemplar;
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    public Integer getCodinv() {
        return codinv;
    }

    public void setCodinv(Integer codinv) {
        this.codinv = codinv;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public Mprestamo getPrestamo() {
        return prestamo;
    }

    public void setPrestamo(Mprestamo prestamo) {
        this.prestamo = prestamo;
    }

    public Ejemplar getEjemplar() {
        return ejemplar;
    }

    public void setEjemplar(Ejemplar ejemplar) {
        this.ejemplar = ejemplar;
    }
}
