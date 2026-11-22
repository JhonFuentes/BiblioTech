package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "telefonos")
@IdClass(TelefonoId.class)
public class Telefono {

    @Id
    @Column(name = "codper")
    private Integer codper;

    @Id
    @Column(name = "numero")
    private String numero;

    // Cardinalidad N a 1: Cada teléfono pertenece a una Persona
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codper", referencedColumnName = "codper", insertable = false, updatable = false)
    @JsonIgnore
    private Persona persona;

    public Telefono(Integer codper, String numero) {
        this.codper = codper;
        this.numero = numero;
    }

    public Telefono() {
    }

    public Telefono(Integer codper, String numero, Persona persona) {
        this.codper = codper;
        this.numero = numero;
        this.persona = persona;
    }

    public Integer getCodper() {
        return codper;
    }

    public void setCodper(Integer codper) {
        this.codper = codper;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }
}
