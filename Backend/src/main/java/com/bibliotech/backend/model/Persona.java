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
@Table(name = "personas")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codper;

    private String nombre;
    private String ap;
    private String am;
    private String genero;
    private Integer estado;
    private String tipoper;
    private String foto;

    // Cardinalidad 1 a 1: Una persona tiene un Dato (CI)
    @OneToOne(mappedBy = "persona", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Dato dato;

    // Cardinalidad 1 a N: Una persona tiene varios teléfonos
    @OneToMany(mappedBy = "persona", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Telefono> telefonos;

    // Cardinalidad 1 a N: Una persona puede tener cuentas de usuario
    @OneToMany(mappedBy = "persona", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<Usuario> usuarios;

    public Persona(Integer codper, String nombre, String ap, String am, String genero, Integer estado, String tipoper, String foto) {
        this.codper = codper;
        this.nombre = nombre;
        this.ap = ap;
        this.am = am;
        this.genero = genero;
        this.estado = estado;
        this.tipoper = tipoper;
        this.foto = foto;
    }
}
