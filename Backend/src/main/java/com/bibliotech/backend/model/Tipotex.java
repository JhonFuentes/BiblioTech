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
}
