package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

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
    @JsonIgnore
    private Dato dato;

    // Cardinalidad 1 a N: Una persona tiene varios teléfonos
    @OneToMany(mappedBy = "persona", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Telefono> telefonos;

    // Cardinalidad 1 a N: Una persona puede tener cuentas de usuario
    @OneToMany(mappedBy = "persona", fetch = FetchType.LAZY)
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

    public Persona() {
    }

    public Persona(Integer codper, String nombre, String ap, String am, String genero, Integer estado, String tipoper, String foto, Dato dato, List<Telefono> telefonos, List<Usuario> usuarios) {
        this.codper = codper;
        this.nombre = nombre;
        this.ap = ap;
        this.am = am;
        this.genero = genero;
        this.estado = estado;
        this.tipoper = tipoper;
        this.foto = foto;
        this.dato = dato;
        this.telefonos = telefonos;
        this.usuarios = usuarios;
    }

    public Integer getCodper() {
        return codper;
    }

    public void setCodper(Integer codper) {
        this.codper = codper;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getAp() {
        return ap;
    }

    public void setAp(String ap) {
        this.ap = ap;
    }

    public String getAm() {
        return am;
    }

    public void setAm(String am) {
        this.am = am;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public String getTipoper() {
        return tipoper;
    }

    public void setTipoper(String tipoper) {
        this.tipoper = tipoper;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Dato getDato() {
        return dato;
    }

    public void setDato(Dato dato) {
        this.dato = dato;
    }

    public List<Telefono> getTelefonos() {
        return telefonos;
    }

    public void setTelefonos(List<Telefono> telefonos) {
        this.telefonos = telefonos;
    }

    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}
