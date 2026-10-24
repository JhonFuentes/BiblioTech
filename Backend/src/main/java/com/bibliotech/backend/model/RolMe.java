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
@Table(name = "ROLME")
@IdClass(RolMeId.class)
public class RolMe {

    @Id
    @Column(name = "codr")
    private Integer codr;

    @Id
    @Column(name = "codm")
    private Integer codm;

    // Cardinalidad N a 1: Pertenece a un Rol
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codr", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Rol rol;

    // Cardinalidad N a 1: Pertenece a un Menú
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codm", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Menu menu;

    public RolMe(Integer codr, Integer codm) {
        this.codr = codr;
        this.codm = codm;
    }
}
