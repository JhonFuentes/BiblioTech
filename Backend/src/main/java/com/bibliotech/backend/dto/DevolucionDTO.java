package com.bibliotech.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class DevolucionDTO {
    private Integer codd;
    private LocalDate fecha;
    private Integer estado; // 1=Activo, 0=Anulado
    private String login;
    private Integer codp;

    // Datos del préstamo referenciado
    private Integer ci;
    private String estudianteNombre;
    private LocalDate fechaPrestamo;

    // Lista de ejemplares que se devolvieron
    private List<Integer> ejemplaresIds;
    private List<String> ejemplaresTitulos;

    public DevolucionDTO() {
    }

    public Integer getCodd() {
        return codd;
    }

    public void setCodd(Integer codd) {
        this.codd = codd;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    public Integer getCi() {
        return ci;
    }

    public void setCi(Integer ci) {
        this.ci = ci;
    }

    public String getEstudianteNombre() {
        return estudianteNombre;
    }

    public void setEstudianteNombre(String estudianteNombre) {
        this.estudianteNombre = estudianteNombre;
    }

    public LocalDate getFechaPrestamo() {
        return fechaPrestamo;
    }

    public void setFechaPrestamo(LocalDate fechaPrestamo) {
        this.fechaPrestamo = fechaPrestamo;
    }

    public List<Integer> getEjemplaresIds() {
        return ejemplaresIds;
    }

    public void setEjemplaresIds(List<Integer> ejemplaresIds) {
        this.ejemplaresIds = ejemplaresIds;
    }

    public List<String> getEjemplaresTitulos() {
        return ejemplaresTitulos;
    }

    public void setEjemplaresTitulos(List<String> ejemplaresTitulos) {
        this.ejemplaresTitulos = ejemplaresTitulos;
    }
}
