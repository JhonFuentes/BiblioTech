package com.bibliotech.backend.model;

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

    @ManyToOne
    @JoinColumn(name = "codr", insertable = false, updatable = false)
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "codm", insertable = false, updatable = false)
    private Menu menu;

    public Integer getCodr() { return codr; }
    public void setCodr(Integer codr) { this.codr = codr; }

    public Integer getCodm() { return codm; }
    public void setCodm(Integer codm) { this.codm = codm; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public Menu getMenu() { return menu; }
    public void setMenu(Menu menu) { this.menu = menu; }
}
