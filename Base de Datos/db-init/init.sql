-- Script de creación de Base de Datos para BiblioTech
-- Motor: PostgreSQL
-- Basado estrictamente en el Diccionario de Datos del Proyecto 2026

-- 1. CREACIÓN DE TABLAS MAESTRAS (Sin dependencias)

CREATE TABLE PERSONAS (
    codper SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    ap VARCHAR(40),
    am VARCHAR(40),
    genero CHAR(1) NOT NULL CHECK (genero IN ('F', 'M')),
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1)),
    tipoper CHAR(1) NOT NULL CHECK (tipoper IN ('A', 'P')), -- A=administrativo, P=público
    foto VARCHAR(40)
);

CREATE TABLE AREAS (
    coda SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1))
);

CREATE TABLE TIPOS (
    codtipo SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1)),
    sw INT NOT NULL DEFAULT 0 CHECK (sw IN (0, 1)) -- 1=Sube libro digital, 0=defecto
);

CREATE TABLE EDITORIALES (
    code SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1))
);

CREATE TABLE AUTORES (
    coda SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    ap VARCHAR(40),
    am VARCHAR(40),
    genero CHAR(1) NOT NULL CHECK (genero IN ('F', 'M')),
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1))
);

CREATE TABLE ROLES (
    codr SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1))
);

CREATE TABLE MENUS (
    codm SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1))
);

CREATE TABLE PROCESOS (
    codp SERIAL PRIMARY KEY, -- Restaurado a CODP tal y como está en el PDF
    nombre VARCHAR(40) NOT NULL,
    enlace VARCHAR(60) NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1))
);

-- 2. TABLAS CON DEPENDENCIAS DE PRIMER NIVEL

CREATE TABLE DATOS (
    ci INT PRIMARY KEY,
    codper INT NOT NULL,
    CONSTRAINT fk_datos_personas FOREIGN KEY (codper) REFERENCES PERSONAS(codper)
);

CREATE TABLE TELEFONOS (
    codper INT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    PRIMARY KEY (codper, numero),
    CONSTRAINT fk_telefonos_personas FOREIGN KEY (codper) REFERENCES PERSONAS(codper)
);

CREATE TABLE USUARIOS (
    login VARCHAR(15) PRIMARY KEY,
    passwd VARCHAR(200) NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1)),
    codper INT NOT NULL,
    CONSTRAINT fk_usuarios_personas FOREIGN KEY (codper) REFERENCES PERSONAS(codper)
);

CREATE TABLE TEXTOS (
    codt SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    resumen VARCHAR(1000),
    isbn VARCHAR(20),
    edicion INT,
    fechapub DATE,
    coda INT NOT NULL,
    code INT NOT NULL,
    CONSTRAINT fk_textos_areas FOREIGN KEY (coda) REFERENCES AREAS(coda),
    CONSTRAINT fk_textos_editoriales FOREIGN KEY (code) REFERENCES EDITORIALES(code)
);

CREATE TABLE MEPRO (
    codm INT NOT NULL,
    codp INT NOT NULL, -- Hace referencia a PROCESOS(CODP)
    PRIMARY KEY (codm, codp),
    CONSTRAINT fk_mepro_menus FOREIGN KEY (codm) REFERENCES MENUS(codm),
    CONSTRAINT fk_mepro_procesos FOREIGN KEY (codp) REFERENCES PROCESOS(codp)
);

-- 3. TABLAS CON DEPENDENCIAS DE SEGUNDO NIVEL

CREATE TABLE ROLUSU (
    codr INT NOT NULL,
    login VARCHAR(15) NOT NULL,
    PRIMARY KEY (codr, login),
    CONSTRAINT fk_rolusu_roles FOREIGN KEY (codr) REFERENCES ROLES(codr),
    CONSTRAINT fk_rolusu_usuarios FOREIGN KEY (login) REFERENCES USUARIOS(login)
);

CREATE TABLE ROLME (
    codr INT NOT NULL,
    codm INT NOT NULL,
    PRIMARY KEY (codr, codm),
    CONSTRAINT fk_rolme_roles FOREIGN KEY (codr) REFERENCES ROLES(codr),
    CONSTRAINT fk_rolme_menus FOREIGN KEY (codm) REFERENCES MENUS(codm)
);

CREATE TABLE TIPOTEX (
    codt INT NOT NULL,
    codtipo INT NOT NULL,
    docum VARCHAR(200),
    PRIMARY KEY (codt, codtipo),
    CONSTRAINT fk_tipotex_textos FOREIGN KEY (codt) REFERENCES TEXTOS(codt),
    CONSTRAINT fk_tipotex_tipos FOREIGN KEY (codtipo) REFERENCES TIPOS(codtipo)
);

CREATE TABLE ESCRIBEN (
    coda INT NOT NULL,
    codt INT NOT NULL,
    PRIMARY KEY (coda, codt),
    CONSTRAINT fk_escriben_autores FOREIGN KEY (coda) REFERENCES AUTORES(coda),
    CONSTRAINT fk_escriben_textos FOREIGN KEY (codt) REFERENCES TEXTOS(codt)
);

CREATE TABLE EJEMPLARES (
    codinv SERIAL PRIMARY KEY,
    disponible INT NOT NULL DEFAULT 1 CHECK (disponible IN (0, 1)), -- L=1 (Libre), 0=Ocupado
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1)),
    codt INT NOT NULL,
    per_resp VARCHAR(15) NOT NULL, -- Referencia a LOGIN en USUARIOS
    per_anula VARCHAR(15), -- Referencia a LOGIN en USUARIOS
    CONSTRAINT fk_ejemplares_textos FOREIGN KEY (codt) REFERENCES TEXTOS(codt),
    CONSTRAINT fk_ejemplares_resp FOREIGN KEY (per_resp) REFERENCES USUARIOS(login),
    CONSTRAINT fk_ejemplares_anula FOREIGN KEY (per_anula) REFERENCES USUARIOS(login)
);

CREATE TABLE MPRESTAMO (
    codp SERIAL PRIMARY KEY, -- Esta es una secuencia distinta a la de PROCESOS
    fecha DATE NOT NULL,
    fini DATE NOT NULL,
    ffin DATE NOT NULL,
    tipopres INT NOT NULL CHECK (tipopres IN (1, 2)), -- 1=Dom, 2=Sala
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1)),
    ci INT NOT NULL,
    login VARCHAR(15) NOT NULL,
    CONSTRAINT fk_mprestamo_datos FOREIGN KEY (ci) REFERENCES DATOS(ci),
    CONSTRAINT fk_mprestamo_usuarios FOREIGN KEY (login) REFERENCES USUARIOS(login)
);

-- 4. TABLAS CON DEPENDENCIAS DE TERCER NIVEL

CREATE TABLE DPRESTAMO (
    codp INT NOT NULL, -- Hace referencia a MPRESTAMO(CODP)
    codinv INT NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1)),
    PRIMARY KEY (codp, codinv),
    CONSTRAINT fk_dprestamo_mprestamo FOREIGN KEY (codp) REFERENCES MPRESTAMO(codp),
    CONSTRAINT fk_dprestamo_ejemplares FOREIGN KEY (codinv) REFERENCES EJEMPLARES(codinv)
);

CREATE TABLE MDEVOL (
    codd SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    estado INT NOT NULL DEFAULT 1 CHECK (estado IN (0, 1)),
    login VARCHAR(15) NOT NULL,
    codp INT NOT NULL,
    CONSTRAINT fk_mdevol_usuarios FOREIGN KEY (login) REFERENCES USUARIOS(login),
    CONSTRAINT fk_mdevol_mprestamo FOREIGN KEY (codp) REFERENCES MPRESTAMO(codp)
);

-- 5. TABLAS CON DEPENDENCIAS DE CUARTO NIVEL

CREATE TABLE DDEVOL (
    codd INT NOT NULL,
    codinv INT NOT NULL,
    PRIMARY KEY (codd, codinv),
    CONSTRAINT fk_ddevol_mdevol FOREIGN KEY (codd) REFERENCES MDEVOL(codd),
    CONSTRAINT fk_ddevol_ejemplares FOREIGN KEY (codinv) REFERENCES EJEMPLARES(codinv)
);
