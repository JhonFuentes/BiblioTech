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
@Table(name = "PROCESOS")
public class Proceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codp;

    @Column(name = "nombre", length = 40, nullable = false)
    private String nombre;

    @Column(name = "enlace", length = 60, nullable = false)
    private String enlace;

    @Column(name = "estado", nullable = false)
    private Integer estado = 1;

    // Cardinalidad 1 a N: Un proceso puede estar en varios menús a través de MEPRO
    @OneToMany(mappedBy = "proceso", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<MePro> mePros;

    public Proceso(Integer codp, String nombre, String enlace, Integer estado) {
        this.codp = codp;
        this.nombre = nombre;
        this.enlace = enlace;
        this.estado = estado;
    }
}
