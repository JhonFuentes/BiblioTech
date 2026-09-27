package com.bibliotech.backend.model;

import java.io.Serializable;
import lombok.Data;

@Data
public class TelefonoId implements Serializable {
    private Integer codper;
    private String numero;
}
