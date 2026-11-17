package com.bibliotech.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DdevolId implements Serializable {
    private Integer codd;
    private Integer codinv;
}
