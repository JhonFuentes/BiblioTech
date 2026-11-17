package com.bibliotech.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipotexId implements Serializable {
    private Integer codt;
    private Integer codtipo;
}
