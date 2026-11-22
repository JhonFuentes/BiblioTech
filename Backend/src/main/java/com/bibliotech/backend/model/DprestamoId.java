package com.bibliotech.backend.model;

import java.io.Serializable;

public class DprestamoId implements Serializable {
    private Integer codp;
    private Integer codinv;

    public DprestamoId() {
    }

    public DprestamoId(Integer codp, Integer codinv) {
        this.codp = codp;
        this.codinv = codinv;
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    public Integer getCodinv() {
        return codinv;
    }

    public void setCodinv(Integer codinv) {
        this.codinv = codinv;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DprestamoId that = (DprestamoId) o;
        return java.util.Objects.equals(codp, that.codp) && java.util.Objects.equals(codinv, that.codinv);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(codp, codinv);
    }
}
