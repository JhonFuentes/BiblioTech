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
@Table(name = "ROLUSU")
@IdClass(RolUsuId.class)
public class RolUsu {

    @Id
    @Column(name = "codr")
    private Integer codr;

    @Id
    @Column(name = "login", length = 15)
    private String login;

    // Cardinalidad N a 1: Pertenece a un Rol
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codr", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Rol rol;

    // Cardinalidad N a 1: Pertenece a un Usuario
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "login", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Usuario usuario;

    public RolUsu(Integer codr, String login) {
        this.codr = codr;
        this.login = login;
    }
}
