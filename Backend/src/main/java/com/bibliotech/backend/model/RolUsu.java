package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ROLUSU")
@IdClass(RolUsuId.class)
public class RolUsu {

    @Id
    @Column(name = "codr")
    private Integer codr;

    @Id
    @Column(name = "login", length = 15)
    private String login;

    // Cardinalidad N a 1: Pertenece a un Rol
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codr", insertable = false, updatable = false)
    @JsonIgnore
    private Rol rol;

    // Cardinalidad N a 1: Pertenece a un Usuario
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "login", insertable = false, updatable = false)
    @JsonIgnore
    private Usuario usuario;

    public RolUsu(Integer codr, String login) {
        this.codr = codr;
        this.login = login;
    }

    public RolUsu() {
    }

    public RolUsu(Integer codr, String login, Rol rol, Usuario usuario) {
        this.codr = codr;
        this.login = login;
        this.rol = rol;
        this.usuario = usuario;
    }

    public Integer getCodr() {
        return codr;
    }

    public void setCodr(Integer codr) {
        this.codr = codr;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
