package com.bibliotech.backend.model;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolMeId implements Serializable {
    private Integer codr;
    private Integer codm;
}
