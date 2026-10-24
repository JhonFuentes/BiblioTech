package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ROLES")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codr;

    @Column(name = "nombre", length = 40, nullable = false)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    // Cardinalidad 1 a N: Un rol asignado a usuarios en ROLUSU
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<RolUsu> rolUsus;

    // Cardinalidad 1 a N: Un rol asignado a menús en ROLME
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<RolMe> rolMes;

    public Rol(Integer codr, String nombre, Integer estado) {
        this.codr = codr;
        this.nombre = nombre;
        this.estado = estado;
    }
}
