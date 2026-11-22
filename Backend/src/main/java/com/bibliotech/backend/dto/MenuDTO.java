package com.bibliotech.backend.dto;


import java.util.ArrayList;
import java.util.List;


public class MenuDTO {
    private Integer codm;
    private String nombre;
    private Integer estado;
    private List<ProcesoDTO> procesos = new ArrayList<>();

    public MenuDTO() {
    }

    public Integer getCodm() {
        return codm;
    }

    public void setCodm(Integer codm) {
        this.codm = codm;
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

    public List<ProcesoDTO> getProcesos() {
        return procesos;
    }

    public void setProcesos(List<ProcesoDTO> procesos) {
        this.procesos = procesos;
    }
}
