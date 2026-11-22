package com.bibliotech.backend.dto;


public class ProcesoDTO {
    private Integer codp;
    private String nombre;
    private String enlace;
    private Integer estado;

    public ProcesoDTO() {
    }

    public ProcesoDTO(Integer codp, String nombre, String enlace, Integer estado) {
        this.codp = codp;
        this.nombre = nombre;
        this.enlace = enlace;
        this.estado = estado;
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEnlace() {
        return enlace;
    }

    public void setEnlace(String enlace) {
        this.enlace = enlace;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }
}
