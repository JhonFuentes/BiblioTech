package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "MDEVOL")
public class Mdevol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codd")
    private Integer codd;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1; // 1=Activo, 0=Anulado

    @Column(name = "login", length = 15, nullable = false)
    private String login;

    @Column(name = "codp", nullable = false)
    private Integer codp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "login", referencedColumnName = "login", insertable = false, updatable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codp", referencedColumnName = "codp", insertable = false, updatable = false)
    private Mprestamo prestamo;

    @OneToMany(mappedBy = "devolucion", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("devolucion")
    private List<Ddevol> detalles;

    public Mdevol() {
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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Mprestamo getPrestamo() {
        return prestamo;
    }

    public void setPrestamo(Mprestamo prestamo) {
        this.prestamo = prestamo;
    }

    public List<Ddevol> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<Ddevol> detalles) {
        this.detalles = detalles;
    }
}
