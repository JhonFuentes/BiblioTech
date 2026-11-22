package com.bibliotech.backend.dto;


public class AsignacionItemDTO {
    private String id; // Codigo o Login
    private String nombre;
    private String detalle;
    private boolean asignado;

    public AsignacionItemDTO() {
    }

    public AsignacionItemDTO(String id, String nombre, String detalle, boolean asignado) {
        this.id = id;
        this.nombre = nombre;
        this.detalle = detalle;
        this.asignado = asignado;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public boolean isAsignado() {
        return asignado;
    }

    public void setAsignado(boolean asignado) {
        this.asignado = asignado;
    }
}
