package com.bibliotech.backend.model;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TelefonoId implements Serializable {
    private Integer codper;
    private String numero;
}
