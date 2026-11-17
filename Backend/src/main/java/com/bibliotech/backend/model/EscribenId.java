package com.bibliotech.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EscribenId implements Serializable {
    private Integer coda;
    private Integer codt;
}
