package com.bibliotech.backend.model;

import jakarta.persistence.*;



@Entity
@Table(name = "EDITORIALES")
public class Editorial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code")
    private Integer code;

    @Column(name = "nombre", length = 40, nullable = false)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    public Editorial() {
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
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
