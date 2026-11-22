package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

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
    @JsonIgnore
    private List<MePro> mePros;

    public Proceso(Integer codp, String nombre, String enlace, Integer estado) {
        this.codp = codp;
        this.nombre = nombre;
        this.enlace = enlace;
        this.estado = estado;
    }

    public Proceso() {
    }

    public Proceso(Integer codp, String nombre, String enlace, Integer estado, List<MePro> mePros) {
        this.codp = codp;
        this.nombre = nombre;
        this.enlace = enlace;
        this.estado = estado;
        this.mePros = mePros;
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEnlace() {
        return enlace;
    }

    public void setEnlace(String enlace) {
        this.enlace = enlace;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public List<MePro> getMePros() {
        return mePros;
    }

    public void setMePros(List<MePro> mePros) {
        this.mePros = mePros;
    }
}
