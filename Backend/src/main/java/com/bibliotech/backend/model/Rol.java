package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

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
    @JsonIgnore
    private List<RolUsu> rolUsus;

    // Cardinalidad 1 a N: Un rol asignado a menús en ROLME
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RolMe> rolMes;

    public Rol(Integer codr, String nombre, Integer estado) {
        this.codr = codr;
        this.nombre = nombre;
        this.estado = estado;
    }

    public Rol() {
    }

    public Rol(Integer codr, String nombre, Integer estado, List<RolUsu> rolUsus, List<RolMe> rolMes) {
        this.codr = codr;
        this.nombre = nombre;
        this.estado = estado;
        this.rolUsus = rolUsus;
        this.rolMes = rolMes;
    }

    public Integer getCodr() {
        return codr;
    }

    public void setCodr(Integer codr) {
        this.codr = codr;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public List<RolUsu> getRolUsus() {
        return rolUsus;
    }

    public void setRolUsus(List<RolUsu> rolUsus) {
        this.rolUsus = rolUsus;
    }

    public List<RolMe> getRolMes() {
        return rolMes;
    }

    public void setRolMes(List<RolMe> rolMes) {
        this.rolMes = rolMes;
    }
}
