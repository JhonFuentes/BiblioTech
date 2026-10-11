package com.bibliotech.backend.model;

import jakarta.persistence.*;

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

    public Integer getCodp() { return codp; }
    public void setCodp(Integer codp) { this.codp = codp; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEnlace() { return enlace; }
    public void setEnlace(String enlace) { this.enlace = enlace; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
}
