package com.bibliotech.backend.dto;


public class AccesoDTO {
    private String login;
    private String password;

    public AccesoDTO() {
    }

    public AccesoDTO(String login, String password) {
        this.login = login;
        this.password = password;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
