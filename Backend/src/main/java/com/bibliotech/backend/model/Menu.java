package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor

@Entity
@Table(name = "MENUS")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codm;

    @Column(name = "nombre", length = 40, nullable = false)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    // Cardinalidad 1 a N: Un menú asignado a roles en ROLME
    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<RolMe> rolMes;

    // Cardinalidad 1 a N: Un menú agrupa procesos en MEPRO
    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<MePro> mePros;

    public Menu(Integer codm, String nombre, Integer estado) {
        this.codm = codm;
        this.nombre = nombre;
        this.estado = estado;
    }
}
