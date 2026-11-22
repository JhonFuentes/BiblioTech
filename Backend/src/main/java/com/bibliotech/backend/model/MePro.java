package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "MEPRO")
@IdClass(MeProId.class)
public class MePro {

    @Id
    @Column(name = "codm")
    private Integer codm;

    @Id
    @Column(name = "codp")
    private Integer codp;

    // Cardinalidad N a 1: Pertenece a un Menú
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codm", insertable = false, updatable = false)
    @JsonIgnore
    private Menu menu;

    // Cardinalidad N a 1: Pertenece a un Proceso
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codp", insertable = false, updatable = false)
    @JsonIgnore
    private Proceso proceso;

    public MePro(Integer codm, Integer codp) {
        this.codm = codm;
        this.codp = codp;
    }

    public MePro() {
    }

    public MePro(Integer codm, Integer codp, Menu menu, Proceso proceso) {
        this.codm = codm;
        this.codp = codp;
        this.menu = menu;
        this.proceso = proceso;
    }

    public Integer getCodm() {
        return codm;
    }

    public void setCodm(Integer codm) {
        this.codm = codm;
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public Proceso getProceso() {
        return proceso;
    }

    public void setProceso(Proceso proceso) {
        this.proceso = proceso;
    }
}
