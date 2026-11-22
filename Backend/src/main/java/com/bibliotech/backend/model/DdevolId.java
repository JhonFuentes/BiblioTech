package com.bibliotech.backend.model;

import java.io.Serializable;

public class DdevolId implements Serializable {
    private Integer codd;
    private Integer codinv;

    public DdevolId() {
    }

    public DdevolId(Integer codd, Integer codinv) {
        this.codd = codd;
        this.codinv = codinv;
    }

    public Integer getCodd() {
        return codd;
    }

    public void setCodd(Integer codd) {
        this.codd = codd;
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
        DdevolId that = (DdevolId) o;
        return java.util.Objects.equals(codd, that.codd) && java.util.Objects.equals(codinv, that.codinv);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(codd, codinv);
    }
}
