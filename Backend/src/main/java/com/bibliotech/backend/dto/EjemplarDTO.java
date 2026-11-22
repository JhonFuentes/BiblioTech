package com.bibliotech.backend.dto;


public class EjemplarDTO {
    private Integer codinv;
    private Integer disponible; // 1=Libre, 0=Ocupado
    private Integer estado; // 1=Activo, 0=Anulado
    private Integer codt;
    private String tituloTexto;
    private String per_resp;
    private String per_anula;

    public EjemplarDTO() {
    }

    public Integer getCodinv() {
        return codinv;
    }

    public void setCodinv(Integer codinv) {
        this.codinv = codinv;
    }

    public Integer getDisponible() {
        return disponible;
    }

    public void setDisponible(Integer disponible) {
        this.disponible = disponible;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public Integer getCodt() {
        return codt;
    }

    public void setCodt(Integer codt) {
        this.codt = codt;
    }

    public String getTituloTexto() {
        return tituloTexto;
    }

    public void setTituloTexto(String tituloTexto) {
        this.tituloTexto = tituloTexto;
    }

    public String getPer_resp() {
        return per_resp;
    }

    public void setPer_resp(String per_resp) {
        this.per_resp = per_resp;
    }

    public String getPer_anula() {
        return per_anula;
    }

    public void setPer_anula(String per_anula) {
        this.per_anula = per_anula;
    }
}
