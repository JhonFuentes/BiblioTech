package com.bibliotech.backend.dto;


public class RolDTO {
    private Integer codr;
    private String nombre;
    private Integer estado;

    public RolDTO() {
    }

    public RolDTO(Integer codr, String nombre, Integer estado) {
        this.codr = codr;
        this.nombre = nombre;
        this.estado = estado;
    }

    public Integer getCodr() {
        return codr;
    }

    public void setCodr(Integer codr) {
        this.codr = codr;
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
