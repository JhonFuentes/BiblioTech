package com.bibliotech.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class TextoDTO {
    private Integer codt;
    private String titulo;
    private String resumen;
    private String isbn;
    private Integer edicion;
    private LocalDate fechapub;
    private Integer coda;
    private String areaNombre;
    private Integer code;
    private String editorialNombre;
    private Integer estado;

    // Relaciones N a M
    private List<Integer> autorIds;
    private List<String> autoresNombres;

    // Tipos y documentos
    private List<TipoTextoDTO> tipos;

    public TextoDTO() {
    }

    public Integer getCodt() {
        return codt;
    }

    public void setCodt(Integer codt) {
        this.codt = codt;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getResumen() {
        return resumen;
    }

    public void setResumen(String resumen) {
        this.resumen = resumen;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Integer getEdicion() {
        return edicion;
    }

    public void setEdicion(Integer edicion) {
        this.edicion = edicion;
    }

    public LocalDate getFechapub() {
        return fechapub;
    }

    public void setFechapub(LocalDate fechapub) {
        this.fechapub = fechapub;
    }

    public Integer getCoda() {
        return coda;
    }

    public void setCoda(Integer coda) {
        this.coda = coda;
    }

    public String getAreaNombre() {
        return areaNombre;
    }

    public void setAreaNombre(String areaNombre) {
        this.areaNombre = areaNombre;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getEditorialNombre() {
        return editorialNombre;
    }

    public void setEditorialNombre(String editorialNombre) {
        this.editorialNombre = editorialNombre;
    }

    public Integer getEstado() {
        return estado;
    }

    public void setEstado(Integer estado) {
        this.estado = estado;
    }

    public List<Integer> getAutorIds() {
        return autorIds;
    }

    public void setAutorIds(List<Integer> autorIds) {
        this.autorIds = autorIds;
    }

    public List<String> getAutoresNombres() {
        return autoresNombres;
    }

    public void setAutoresNombres(List<String> autoresNombres) {
        this.autoresNombres = autoresNombres;
    }

    public List<TipoTextoDTO> getTipos() {
        return tipos;
    }

    public void setTipos(List<TipoTextoDTO> tipos) {
        this.tipos = tipos;
    }

    public static class TipoTextoDTO {
        private Integer codtipo;
        private String tipoNombre;
        private Integer sw;
        private String docum;

        public TipoTextoDTO() {
        }

        public Integer getCodtipo() {
            return codtipo;
        }

        public void setCodtipo(Integer codtipo) {
            this.codtipo = codtipo;
        }

        public String getTipoNombre() {
            return tipoNombre;
        }

        public void setTipoNombre(String tipoNombre) {
            this.tipoNombre = tipoNombre;
        }

        public Integer getSw() {
            return sw;
        }

        public void setSw(Integer sw) {
            this.sw = sw;
        }

        public String getDocum() {
            return docum;
        }

        public void setDocum(String docum) {
            this.docum = docum;
        }
    }
}
