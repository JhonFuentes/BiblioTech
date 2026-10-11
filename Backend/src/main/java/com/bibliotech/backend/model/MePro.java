package com.bibliotech.backend.model;

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

    @ManyToOne
    @JoinColumn(name = "codm", insertable = false, updatable = false)
    private Menu menu;

    @ManyToOne
    @JoinColumn(name = "codp", insertable = false, updatable = false)
    private Proceso proceso;

    public Integer getCodm() { return codm; }
    public void setCodm(Integer codm) { this.codm = codm; }

    public Integer getCodp() { return codp; }
    public void setCodp(Integer codp) { this.codp = codp; }

    public Menu getMenu() { return menu; }
    public void setMenu(Menu menu) { this.menu = menu; }

    public Proceso getProceso() { return proceso; }
    public void setProceso(Proceso proceso) { this.proceso = proceso; }
}
