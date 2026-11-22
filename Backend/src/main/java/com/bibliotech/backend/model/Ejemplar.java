package com.bibliotech.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "EJEMPLARES")
public class Ejemplar {

    @Id
    @Column(name = "codinv")
    private Integer codinv;

    @Column(name = "disponible", nullable = false)
    private Integer disponible = 1; // 1=Libre, 0=Ocupado

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1=Activo, 0=Anulado

    @Column(name = "codt", nullable = false)
    private Integer codt;

    @Column(name = "per_resp", length = 15, nullable = false)
    private String per_resp;

    @Column(name = "per_anula", length = 15)
    private String per_anula;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codt", insertable = false, updatable = false)
    private Texto texto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "per_resp", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuarioResp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "per_anula", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuarioAnula;

    public Ejemplar() {
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

    public Texto getTexto() {
        return texto;
    }

    public void setTexto(Texto texto) {
        this.texto = texto;
    }

    public Usuario getUsuarioResp() {
        return usuarioResp;
    }

    public void setUsuarioResp(Usuario usuarioResp) {
        this.usuarioResp = usuarioResp;
    }

    public Usuario getUsuarioAnula() {
        return usuarioAnula;
    }

    public void setUsuarioAnula(Usuario usuarioAnula) {
        this.usuarioAnula = usuarioAnula;
    }
}
