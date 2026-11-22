package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ESCRIBEN")
@IdClass(EscribenId.class)
public class Escriben {

    @Id
    @Column(name = "coda")
    private Integer coda;

    @Id
    @Column(name = "codt")
    private Integer codt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coda", insertable = false, updatable = false)
    private Autor autor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codt", insertable = false, updatable = false)
    @JsonIgnore
    private Texto texto;

    public Escriben(Integer coda, Integer codt) {
        this.coda = coda;
        this.codt = codt;
    }

    public Escriben() {
    }

    public Escriben(Integer coda, Integer codt, Autor autor, Texto texto) {
        this.coda = coda;
        this.codt = codt;
        this.autor = autor;
        this.texto = texto;
    }

    public Integer getCoda() {
        return coda;
    }

    public void setCoda(Integer coda) {
        this.coda = coda;
    }

    public Integer getCodt() {
        return codt;
    }

    public void setCodt(Integer codt) {
        this.codt = codt;
    }

    public Autor getAutor() {
        return autor;
    }

    public void setAutor(Autor autor) {
        this.autor = autor;
    }

    public Texto getTexto() {
        return texto;
    }

    public void setTexto(Texto texto) {
        this.texto = texto;
    }
}
