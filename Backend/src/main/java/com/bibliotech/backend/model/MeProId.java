package com.bibliotech.backend.model;

import java.io.Serializable;

public class MeProId implements Serializable {
    private Integer codm;
    private Integer codp;

    public MeProId() {
    }

    public MeProId(Integer codm, Integer codp) {
        this.codm = codm;
        this.codp = codp;
    }

    public Integer getCodm() {
        return codm;
    }

    public void setCodm(Integer codm) {
        this.codm = codm;
    }

    public Integer getCodp() {
        return codp;
    }

    public void setCodp(Integer codp) {
        this.codp = codp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MeProId that = (MeProId) o;
        return java.util.Objects.equals(codm, that.codm) && java.util.Objects.equals(codp, that.codp);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(codm, codp);
    }
}
