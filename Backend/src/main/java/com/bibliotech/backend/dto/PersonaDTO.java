package com.bibliotech.backend.dto;

import java.util.List;

public class PersonaDTO {
    private Integer codper;
    private Integer ci;
    private String nombre;
    private String ap;
    private String am;
    private String genero;
    private Integer estado;
    private String tipoper;
    private String foto;
    private List<String> telefonos;
    private Boolean hasLogin = false;
    private String login;

    public PersonaDTO() {
    }

    public Integer getCodper() {
        return codper;
    }

    public void setCodper(Integer codper) {
        this.codper = codper;
    }

    public Integer getCi() {
        return ci;
    }

    public void setCi(Integer ci) {
        this.ci = ci;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getAp() {
        return ap;
    }

    public void setAp(String ap) {
        this.ap = ap;
    }

    public String getAm() {
        return am;
    }

    public void setAm(String am) {
        this.am = am;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public String getTipoper() {
        return tipoper;
    }

    public void setTipoper(String tipoper) {
        this.tipoper = tipoper;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public List<String> getTelefonos() {
        return telefonos;
    }

    public void setTelefonos(List<String> telefonos) {
        this.telefonos = telefonos;
    }

    public Boolean getHasLogin() {
        return hasLogin != null ? hasLogin : false;
    }

    public boolean isHasLogin() {
        return hasLogin != null && hasLogin;
    }

    public void setHasLogin(Boolean hasLogin) {
        this.hasLogin = hasLogin != null ? hasLogin : false;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
