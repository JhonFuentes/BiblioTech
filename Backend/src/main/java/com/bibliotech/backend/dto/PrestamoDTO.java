package com.bibliotech.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class PrestamoDTO {
    private Integer codp;
    private LocalDate fecha;
    private LocalDate fini;
    private LocalDate ffin;
    private Integer tipopres; // 1=Dom, 2=Sala
    private Integer estado; // 1=Activo, 0=Anulado
    private Integer ci;
    private String estudianteNombre;
    private String login;

    private List<DetallePrestamoDTO> detalles;

    public PrestamoDTO() {
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalDate getFini() {
        return fini;
    }

    public void setFini(LocalDate fini) {
        this.fini = fini;
    }

    public LocalDate getFfin() {
        return ffin;
    }

    public void setFfin(LocalDate ffin) {
        this.ffin = ffin;
    }

    public Integer getTipopres() {
        return tipopres;
    }

    public void setTipopres(Integer tipopres) {
        this.tipopres = tipopres;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
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

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public List<DetallePrestamoDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePrestamoDTO> detalles) {
        this.detalles = detalles;
    }

    public static class DetallePrestamoDTO {
        private Integer codinv;
        private String titulo;
        private Integer estado; // 1=Prestado, 0=Devuelto

        public DetallePrestamoDTO() {
        }

        public Integer getCodinv() {
            return codinv;
        }

        public void setCodinv(Integer codinv) {
            this.codinv = codinv;
        }

        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public Integer getEstado() {
            return estado;
        }

        public void setEstado(Integer estado) {
            this.estado = estado;
        }
    }
}
