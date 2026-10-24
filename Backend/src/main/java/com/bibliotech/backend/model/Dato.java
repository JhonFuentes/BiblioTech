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
@Table(name = "datos")
public class Dato {

    @Id
    private Integer ci;

    @Column(name = "codper")
    private Integer codper;

    // Cardinalidad 1 a 1 con Persona
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codper", referencedColumnName = "codper", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Persona persona;

    public Dato(Integer ci, Integer codper) {
        this.ci = ci;
        this.codper = codper;
    }
}
