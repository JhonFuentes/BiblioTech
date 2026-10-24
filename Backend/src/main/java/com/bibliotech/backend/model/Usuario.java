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
@Table(name = "usuarios")
public class Usuario {

    @Id
    private String login;

    private String passwd;
    
    private Integer estado;

    // Cardinalidad N a 1: Varios usuarios pueden asociarse a una Persona
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codper", referencedColumnName = "codper")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Persona persona;

    // Cardinalidad 1 a N: Un usuario tiene roles asignados a través de ROLUSU
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private List<RolUsu> rolUsus;

    public Usuario(String login, String passwd, Integer estado, Persona persona) {
        this.login = login;
        this.passwd = passwd;
        this.estado = estado;
        this.persona = persona;
    }
}
