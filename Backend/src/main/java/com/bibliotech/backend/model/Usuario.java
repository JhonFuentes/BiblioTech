package com.bibliotech.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    private String login;

    private String passwd;
    
    private Integer estado;

    // Cardinalidad N a 1: Varios usuarios pueden asociarse a una Persona
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codper", referencedColumnName = "codper")
    private Persona persona;

    // Cardinalidad 1 a N: Un usuario tiene roles asignados a través de ROLUSU
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RolUsu> rolUsus;

    public Usuario(String login, String passwd, Integer estado, Persona persona) {
        this.login = login;
        this.passwd = passwd;
        this.estado = estado;
        this.persona = persona;
    }

    public Usuario() {
    }

    public Usuario(String login, String passwd, Integer estado, Persona persona, List<RolUsu> rolUsus) {
        this.login = login;
        this.passwd = passwd;
        this.estado = estado;
        this.persona = persona;
        this.rolUsus = rolUsus;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public List<RolUsu> getRolUsus() {
        return rolUsus;
    }

    public void setRolUsus(List<RolUsu> rolUsus) {
        this.rolUsus = rolUsus;
    }
}
