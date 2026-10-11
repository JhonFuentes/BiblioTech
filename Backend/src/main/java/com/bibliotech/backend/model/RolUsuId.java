package com.bibliotech.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class RolUsuId implements Serializable {

    private Integer codr;
    private String login;

    public RolUsuId() {}

    public RolUsuId(Integer codr, String login) {
        this.codr = codr;
        this.login = login;
    }

    public Integer getCodr() { return codr; }
    public void setCodr(Integer codr) { this.codr = codr; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RolUsuId that = (RolUsuId) o;
        return Objects.equals(codr, that.codr) && Objects.equals(login, that.login);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codr, login);
    }
}
