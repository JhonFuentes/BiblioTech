package com.bibliotech.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    private String login;

    private String passwd;
    
    private Integer estado;

    @ManyToOne
    @JoinColumn(name = "codper", referencedColumnName = "codper")
    private Persona persona;
}
