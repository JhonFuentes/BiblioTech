package com.bibliotech.backend.model;

import jakarta.persistence.*;



@Entity
@Table(name = "AUTORES")
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coda")
    private Integer coda;

    @Column(name = "nombre", length = 60, nullable = false)
    private String nombre;

    @Column(name = "ap", length = 40)
    private String ap;

    @Column(name = "am", length = 40)
    private String am;

    @Column(name = "genero", length = 1, nullable = false)
    private String genero; // F=femenino, M=masculino

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    public Autor() {
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

    public String getAp() {
        return ap;
    }

    public void setAp(String ap) {
        this.ap = ap;
    }

    public String getAm() {
        return am;
    }

    public void setAm(String am) {
        this.am = am;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}
