package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "TIPOTEX")
@IdClass(TipotexId.class)
public class Tipotex {

    @Id
    @Column(name = "codt")
    private Integer codt;

    @Id
    @Column(name = "codtipo")
    private Integer codtipo;

    @Column(name = "docum", length = 200)
    private String docum;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codtipo", insertable = false, updatable = false)
    private Tipo tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codt", insertable = false, updatable = false)
    @JsonIgnore
    private Texto texto;

    public Tipotex(Integer codt, Integer codtipo, String docum) {
        this.codt = codt;
        this.codtipo = codtipo;
        this.docum = docum;
    }

    public Tipotex() {
    }

    public Tipotex(Integer codt, Integer codtipo, String docum, Tipo tipo, Texto texto) {
        this.codt = codt;
        this.codtipo = codtipo;
        this.docum = docum;
        this.tipo = tipo;
        this.texto = texto;
    }

    public Integer getCodt() {
        return codt;
    }

    public void setCodt(Integer codt) {
        this.codt = codt;
    }

    public Integer getCodtipo() {
        return codtipo;
    }

    public void setCodtipo(Integer codtipo) {
        this.codtipo = codtipo;
    }

    public String getDocum() {
        return docum;
    }

    public void setDocum(String docum) {
        this.docum = docum;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public Texto getTexto() {
        return texto;
    }

    public void setTexto(Texto texto) {
        this.texto = texto;
    }
}
