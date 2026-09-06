package com.bibliotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String nombreCompleto;
    private String rol;
}
