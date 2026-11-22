package com.bibliotech.backend.model;

import java.io.Serializable;

public class EscribenId implements Serializable {
    private Integer coda;
    private Integer codt;

    public EscribenId() {
    }

    public EscribenId(Integer coda, Integer codt) {
        this.coda = coda;
        this.codt = codt;
    }

    public Integer getCoda() {
        return coda;
    }

    public void setCoda(Integer coda) {
        this.coda = coda;
    }

    public Integer getCodt() {
        return codt;
    }

    public void setCodt(Integer codt) {
        this.codt = codt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EscribenId that = (EscribenId) o;
        return java.util.Objects.equals(coda, that.coda) && java.util.Objects.equals(codt, that.codt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(coda, codt);
    }
}
