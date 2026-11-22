package com.bibliotech.backend.dto;


public class AuthResponse {
    private boolean success;
    private String message;
    private String fecha;
    private String cedula;
    private String user;
    private String foto;
    private String token;
    private String username;
    private String saludos;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String fecha, String cedula, String user, String foto, String token, String username, String saludos) {
        this.success = success;
        this.message = message;
        this.fecha = fecha;
        this.cedula = cedula;
        this.user = user;
        this.foto = foto;
        this.token = token;
        this.username = username;
        this.saludos = saludos;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSaludos() {
        return saludos;
    }

    public void setSaludos(String saludos) {
        this.saludos = saludos;
    }
}
