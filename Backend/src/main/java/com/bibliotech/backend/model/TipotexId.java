package com.bibliotech.backend.model;

import java.io.Serializable;

public class TipotexId implements Serializable {
    private Integer codt;
    private Integer codtipo;

    public TipotexId() {
    }

    public TipotexId(Integer codt, Integer codtipo) {
        this.codt = codt;
        this.codtipo = codtipo;
    }

    public Integer getCodt() {
        return codt;
    }

    public void setCodt(Integer codt) {
        this.codt = codt;
    }

    public Integer getCodtipo() {
        return codtipo;
    }

    public void setCodtipo(Integer codtipo) {
        this.codtipo = codtipo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TipotexId that = (TipotexId) o;
        return java.util.Objects.equals(codt, that.codt) && java.util.Objects.equals(codtipo, that.codtipo);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(codt, codtipo);
    }
}
