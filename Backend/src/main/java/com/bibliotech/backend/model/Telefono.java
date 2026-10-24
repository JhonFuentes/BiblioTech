package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Persona persona;

    public Telefono(Integer codper, String numero) {
        this.codper = codper;
        this.numero = numero;
    }
}
