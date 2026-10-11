package com.bibliotech.backend.model;

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

    @ManyToOne
    @JoinColumn(name = "codr", insertable = false, updatable = false)
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "login", insertable = false, updatable = false)
    private Usuario usuario;

    public Integer getCodr() { return codr; }
    public void setCodr(Integer codr) { this.codr = codr; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
