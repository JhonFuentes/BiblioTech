package com.bibliotech.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "telefonos")
@IdClass(TelefonoId.class)
public class Telefono {

    @Id
    @Column(name = "codper")
    private Integer codper;

    @Id
    @Column(name = "numero")
    private String numero;
}
