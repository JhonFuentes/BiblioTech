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
@Table(name = "MEPRO")
@IdClass(MeProId.class)
public class MePro {

    @Id
    @Column(name = "codm")
    private Integer codm;

    @Id
    @Column(name = "codp")
    private Integer codp;

    // Cardinalidad N a 1: Pertenece a un Menú
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codm", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Menu menu;

    // Cardinalidad N a 1: Pertenece a un Proceso
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codp", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Proceso proceso;

    public MePro(Integer codm, Integer codp) {
        this.codm = codm;
        this.codp = codp;
    }
}
