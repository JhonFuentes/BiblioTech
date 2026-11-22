package com.bibliotech.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "AREAS")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coda")
    private Integer coda;

    @Column(name = "nombre", length = 40, nullable = false)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    public Area() {
    }

    public Integer getCoda() {
        return coda;
    }

    public void setCoda(Integer coda) {
        this.coda = coda;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}
