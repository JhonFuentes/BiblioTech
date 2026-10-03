package com.bibliotech.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "datos")
public class Dato {

    @Id
    private Integer ci;

    @Column(name = "codper")
    private Integer codper;

    @OneToOne
    @JoinColumn(name = "codper", insertable = false, updatable = false)
    private Persona persona;
}
