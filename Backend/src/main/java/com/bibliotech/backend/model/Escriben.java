package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
