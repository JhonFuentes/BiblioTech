package com.bibliotech.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class RolMeId implements Serializable {

    private Integer codr;
    private Integer codm;

    public RolMeId() {}

    public RolMeId(Integer codr, Integer codm) {
        this.codr = codr;
        this.codm = codm;
    }

    public Integer getCodr() { return codr; }
    public void setCodr(Integer codr) { this.codr = codr; }

    public Integer getCodm() { return codm; }
    public void setCodm(Integer codm) { this.codm = codm; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RolMeId that = (RolMeId) o;
        return Objects.equals(codr, that.codr) && Objects.equals(codm, that.codm);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codr, codm);
    }
}
