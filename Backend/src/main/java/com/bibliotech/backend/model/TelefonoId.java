package com.bibliotech.backend.model;

import java.io.Serializable;

public class TelefonoId implements Serializable {
    private Integer codper;
    private String numero;

    public TelefonoId() {
    }

    public TelefonoId(Integer codper, String numero) {
        this.codper = codper;
        this.numero = numero;
    }

    public Integer getCodper() {
        return codper;
    }

    public void setCodper(Integer codper) {
        this.codper = codper;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TelefonoId that = (TelefonoId) o;
        return java.util.Objects.equals(codper, that.codper) && java.util.Objects.equals(numero, that.numero);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(codper, numero);
    }
}
