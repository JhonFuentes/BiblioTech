package com.bibliotech.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    @Transient
    private Integer estado = 1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coda", insertable = false, updatable = false)
    private Area area;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "code", insertable = false, updatable = false)
    private Editorial editorial;

    public Texto() {
    }

    public Integer getCodt() {
        return codt;
    }

    public void setCodt(Integer codt) {
        this.codt = codt;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getResumen() {
        return resumen;
    }

    public void setResumen(String resumen) {
        this.resumen = resumen;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Integer getEdicion() {
        return edicion;
    }

    public void setEdicion(Integer edicion) {
        this.edicion = edicion;
    }

    public LocalDate getFechapub() {
        return fechapub;
    }

    public void setFechapub(LocalDate fechapub) {
        this.fechapub = fechapub;
    }

    public Integer getCoda() {
        return coda;
    }

    public void setCoda(Integer coda) {
        this.coda = coda;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public Area getArea() {
        return area;
    }

    public void setArea(Area area) {
        this.area = area;
    }

    public Editorial getEditorial() {
        return editorial;
    }

    public void setEditorial(Editorial editorial) {
        this.editorial = editorial;
    }
}
