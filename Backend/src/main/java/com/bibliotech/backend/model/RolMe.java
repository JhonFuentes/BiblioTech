package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ROLME")
@IdClass(RolMeId.class)
public class RolMe {

    @Id
    @Column(name = "codr")
    private Integer codr;

    @Id
    @Column(name = "codm")
    private Integer codm;

    // Cardinalidad N a 1: Pertenece a un Rol
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codr", insertable = false, updatable = false)
    @JsonIgnore
    private Rol rol;

    // Cardinalidad N a 1: Pertenece a un Menú
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codm", insertable = false, updatable = false)
    @JsonIgnore
    private Menu menu;

    public RolMe(Integer codr, Integer codm) {
        this.codr = codr;
        this.codm = codm;
    }

    public RolMe() {
    }

    public RolMe(Integer codr, Integer codm, Rol rol, Menu menu) {
        this.codr = codr;
        this.codm = codm;
        this.rol = rol;
        this.menu = menu;
    }

    public Integer getCodr() {
        return codr;
    }

    public void setCodr(Integer codr) {
        this.codr = codr;
    }

    public Integer getCodm() {
        return codm;
    }

    public void setCodm(Integer codm) {
        this.codm = codm;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }
}
