package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


import java.util.List;


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
    @JsonIgnore
    private List<RolMe> rolMes;

    // Cardinalidad 1 a N: Un menú agrupa procesos en MEPRO
    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MePro> mePros;

    public Menu(Integer codm, String nombre, Integer estado) {
        this.codm = codm;
        this.nombre = nombre;
        this.estado = estado;
    }

    public Menu() {
    }

    public Integer getCodm() {
        return codm;
    }

    public void setCodm(Integer codm) {
        this.codm = codm;
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

    public List<RolMe> getRolMes() {
        return rolMes;
    }

    public void setRolMes(List<RolMe> rolMes) {
        this.rolMes = rolMes;
    }

    public List<MePro> getMePros() {
        return mePros;
    }

    public void setMePros(List<MePro> mePros) {
        this.mePros = mePros;
    }
}
