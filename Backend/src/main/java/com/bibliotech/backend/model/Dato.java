package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "datos")
public class Dato {

    @Id
    private Integer ci;

    @Column(name = "codper")
    private Integer codper;

    // Cardinalidad 1 a 1 con Persona
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codper", referencedColumnName = "codper", insertable = false, updatable = false)
    @JsonIgnore
    private Persona persona;

    public Dato(Integer ci, Integer codper) {
        this.ci = ci;
        this.codper = codper;
    }

    public Dato() {
    }

    public Dato(Integer ci, Integer codper, Persona persona) {
        this.ci = ci;
        this.codper = codper;
        this.persona = persona;
    }

    public Integer getCi() {
        return ci;
    }

    public void setCi(Integer ci) {
        this.ci = ci;
    }

    public Integer getCodper() {
        return codper;
    }

    public void setCodper(Integer codper) {
        this.codper = codper;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }
}
