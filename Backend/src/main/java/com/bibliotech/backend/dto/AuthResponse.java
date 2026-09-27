package com.bibliotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String nombreCompleto;
    private String rol;
    private String login;
    private String foto;
    private String token;
    private String fecha;
    private String cedula;
    private String user;
    private String username;
}
