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
@Table(name = "DDEVOL")
@IdClass(DdevolId.class)
public class Ddevol {

    @Id
    @Column(name = "codd")
    private Integer codd;

    @Id
    @Column(name = "codinv")
    private Integer codinv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codd", insertable = false, updatable = false)
    @JsonIgnore
    private Mdevol devolucion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codinv", insertable = false, updatable = false)
    private Ejemplar ejemplar;

    public Ddevol(Integer codd, Integer codinv) {
        this.codd = codd;
        this.codinv = codinv;
    }
}
