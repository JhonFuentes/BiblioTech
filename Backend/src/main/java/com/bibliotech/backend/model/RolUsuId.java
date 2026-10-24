package com.bibliotech.backend.model;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolUsuId implements Serializable {
    private Integer codr;
    private String login;
}
