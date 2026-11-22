package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "DDEVOL")
@IdClass(DdevolId.class)
public class Ddevol {

    @Id
    @Column(name = "codd")
    private Integer codd;

    @Id
    @Column(name = "codinv")
    private Integer codinv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codd", insertable = false, updatable = false)
    @JsonIgnore
    private Mdevol devolucion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codinv", insertable = false, updatable = false)
    private Ejemplar ejemplar;

    public Ddevol(Integer codd, Integer codinv) {
        this.codd = codd;
        this.codinv = codinv;
    }

    public Ddevol() {
    }

    public Ddevol(Integer codd, Integer codinv, Mdevol devolucion, Ejemplar ejemplar) {
        this.codd = codd;
        this.codinv = codinv;
        this.devolucion = devolucion;
        this.ejemplar = ejemplar;
    }

    public Integer getCodd() {
        return codd;
    }

    public void setCodd(Integer codd) {
        this.codd = codd;
    }

    public Integer getCodinv() {
        return codinv;
    }

    public void setCodinv(Integer codinv) {
        this.codinv = codinv;
    }

    public Mdevol getDevolucion() {
        return devolucion;
    }

    public void setDevolucion(Mdevol devolucion) {
        this.devolucion = devolucion;
    }

    public Ejemplar getEjemplar() {
        return ejemplar;
    }

    public void setEjemplar(Ejemplar ejemplar) {
        this.ejemplar = ejemplar;
    }
}
