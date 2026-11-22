package com.bibliotech.backend.model;

import jakarta.persistence.*;



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

    public Tipo() {
    }

    public Integer getCodtipo() {
        return codtipo;
    }

    public void setCodtipo(Integer codtipo) {
        this.codtipo = codtipo;
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

    public Integer getSw() {
        return sw;
    }

    public void setSw(Integer sw) {
        this.sw = sw;
    }
}
