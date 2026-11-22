package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "MPRESTAMO")
public class Mprestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codp")
    private Integer codp;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "fini", nullable = false)
    private LocalDate fini;

    @Column(name = "ffin", nullable = false)
    private LocalDate ffin;

    @Column(name = "tipopres", nullable = false)
    private Integer tipopres; // 1=Dom, 2=Sala

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1=Activo, 0=Anulado

    @Column(name = "ci", nullable = false)
    private Integer ci;

    @Column(name = "login", length = 15, nullable = false)
    private String login;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ci", referencedColumnName = "ci", insertable = false, updatable = false)
    private Dato dato;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "login", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "prestamo", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("prestamo")
    private List<Dprestamo> detalles;

    public Mprestamo() {
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

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Dato getDato() {
        return dato;
    }

    public void setDato(Dato dato) {
        this.dato = dato;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<Dprestamo> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<Dprestamo> detalles) {
        this.detalles = detalles;
    }
}
