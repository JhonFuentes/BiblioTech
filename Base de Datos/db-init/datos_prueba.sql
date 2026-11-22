-- =============================================================================
-- DATOS DE PRUEBA PARA BIBLIOTECH (Basado estrictamente en init.sql)
-- Contraseñas hasheadas con BCrypt (Spring Security)
--
-- CREDENCIALES DE PRUEBA:
--   admin         / 1234    (Rol: Administrador)
--   JhonFuentes   / 1234    (Rol: Administrador)
--   bibliotecario / 1234    (Rol: Bibliotecario)
--   juan          / 123456  (Rol: Estudiante / Lector)
--   maria         / 123456  (Rol: Estudiante / Lector)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLAS MAESTRAS (Sin dependencias)
-- -----------------------------------------------------------------------------

-- 1.1 PERSONAS (genero: 'F' o 'M' | estado: 1=Activo, 0=Baja | tipoper: 'A'=Admin, 'P'=Público)
INSERT INTO PERSONAS (codper, nombre, ap, am, genero, estado, tipoper, foto) VALUES
(1, 'Jhon', 'Fuentes', 'Mamani', 'M', 1, 'A', NULL),
(2, 'Carlos', 'Gómez', 'Salazar', 'M', 1, 'A', NULL),
(3, 'Ana', 'Torrez', 'Vargas', 'F', 1, 'A', NULL),
(4, 'Juan', 'Pérez', 'Condori', 'M', 1, 'P', NULL),
(5, 'María', 'Quispe', 'Rojas', 'F', 1, 'P', NULL),
(6, 'Luis', 'Mendoza', 'Aguilar', 'M', 1, 'P', NULL),
(7, 'Elena', 'Flores', 'Castro', 'F', 0, 'P', NULL)
ON CONFLICT (codper) DO NOTHING;

-- 1.2 AREAS
INSERT INTO AREAS (coda, nombre, estado) VALUES
(1, 'Tecnología e Informática', 1),
(2, 'Ingeniería de Sistemas', 1),
(3, 'Ciencias Exactas', 1),
(4, 'Física y Matemáticas', 1),
(5, 'Literatura Universal', 1),
(6, 'Medicina y Salud', 1),
(7, 'Historia y Filosofía', 1),
(8, 'Redes y Telecomunicaciones', 0)
ON CONFLICT (coda) DO NOTHING;

-- 1.3 TIPOS (sw: 1=Sube libro digital PDF, 0=Físico por defecto)
INSERT INTO TIPOS (codtipo, nombre, estado, sw) VALUES
(1, 'Libro Impreso', 1, 0),
(2, 'Libro Digital (E-Book)', 1, 1),
(3, 'Revista Científica', 1, 1),
(4, 'Tesis de Grado', 1, 1),
(5, 'Monografía', 1, 0),
(6, 'Manual Técnico', 1, 0)
ON CONFLICT (codtipo) DO NOTHING;

-- 1.4 EDITORIALES
INSERT INTO EDITORIALES (code, nombre, estado) VALUES
(1, 'Pearson Educación', 1),
(2, 'McGraw-Hill', 1),
(3, 'O''Reilly Media', 1),
(4, 'Alfaomega Grupo Editor', 1),
(5, 'Editorial Santillana', 1),
(6, 'Editorial Planeta', 1),
(7, 'Addison-Wesley', 1)
ON CONFLICT (code) DO NOTHING;

-- 1.5 AUTORES
INSERT INTO AUTORES (coda, nombre, ap, am, genero, estado) VALUES
(1, 'Robert', 'Martin', 'Cecil', 'M', 1),
(2, 'Martin', 'Fowler', '', 'M', 1),
(3, 'Andrew', 'Tanenbaum', 'Stuart', 'M', 1),
(4, 'Donald', 'Knuth', 'Ervin', 'M', 1),
(5, 'Ada', 'Lovelace', 'Byron', 'F', 1),
(6, 'Margaret', 'Hamilton', 'Heafield', 'F', 1),
(7, 'Gabriel', 'García', 'Márquez', 'M', 1)
ON CONFLICT (coda) DO NOTHING;

-- 1.6 ROLES
INSERT INTO ROLES (codr, nombre, estado) VALUES
(1, 'Administrador', 1),
(2, 'Bibliotecario', 1),
(3, 'Estudiante / Lector', 1)
ON CONFLICT (codr) DO NOTHING;

-- 1.7 MENUS
INSERT INTO MENUS (codm, nombre, estado) VALUES
(1, 'Administración', 1),
(2, 'Catálogo Bibliográfico', 1),
(3, 'Préstamos y Devoluciones', 1)
ON CONFLICT (codm) DO NOTHING;

-- 1.8 PROCESOS (Rutas exactas del Frontend Angular)
INSERT INTO PROCESOS (codp, nombre, enlace, estado) VALUES
(1,  'Gestión de Usuarios',       '/gestion-usuarios',       1),
(2,  'Gestión de Roles',          '/gestion-roles',          1),
(3,  'Gestión de Menús',          '/gestion-menus',          1),
(4,  'Asignar Procesos a Menú',   '/asignar-mepro',          1),
(5,  'Asignar Menús a Rol',       '/asignar-rolme',          1),
(6,  'Asignar Roles a Usuario',   '/asignar-rolusu',         1),
(7,  'Gestión de Áreas',          '/gestion-areas',          1),
(8,  'Gestión de Editoriales',    '/gestion-editoriales',    1),
(9,  'Gestión de Tipos',          '/gestion-tipos',          1),
(10, 'Gestión de Autores',        '/gestion-autores',        1),
(11, 'Gestión de Textos',         '/gestion-textos',         1),
(12, 'Gestión de Ejemplares',     '/gestion-ejemplares',     1),
(13, 'Búsqueda Digital',          '/catalogo-digital',       1),
(14, 'Gestión de Préstamos',      '/gestion-prestamos',      1),
(15, 'Gestión de Devoluciones',   '/gestion-devoluciones',   1),
(16, 'Anulación de Devoluciones', '/anulacion-devoluciones', 1)
ON CONFLICT (codp) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. TABLAS CON DEPENDENCIAS DE PRIMER NIVEL
-- -----------------------------------------------------------------------------

-- 2.1 DATOS (Cédula de Identidad por Persona)
INSERT INTO DATOS (ci, codper) VALUES
(8451230, 1),
(7342190, 2),
(6918273, 3),
(9123456, 4),
(9543210, 5),
(8877665, 6),
(7766554, 7)
ON CONFLICT (ci) DO NOTHING;

-- 2.2 TELEFONOS
INSERT INTO TELEFONOS (codper, numero) VALUES
(1, '70112233'),
(1, '2244556'),
(2, '71556677'),
(3, '72889900'),
(4, '73112244'),
(5, '74556688'),
(6, '75990011')
ON CONFLICT (codper, numero) DO NOTHING;

-- 2.3 USUARIOS (Contraseñas hasheadas con BCrypt)
-- Hash de '1234'   -> $2a$10$ySsfJbcRiGrBYUiHM0HEleDo0u.Pr7lU6aeY7rqQ0zVlhxhHUV85S
-- Hash de '123456' -> $2a$10$DcJNkf20vY99.zjCjNuJoOPE/fH5CF0bgl5j2bM1r8DYi3wn7dC..
INSERT INTO USUARIOS (login, passwd, estado, codper) VALUES
('JhonFuentes',   '$2a$10$ySsfJbcRiGrBYUiHM0HEleDo0u.Pr7lU6aeY7rqQ0zVlhxhHUV85S', 1, 1),
('admin',         '$2a$10$ySsfJbcRiGrBYUiHM0HEleDo0u.Pr7lU6aeY7rqQ0zVlhxhHUV85S', 1, 2),
('bibliotecario', '$2a$10$ySsfJbcRiGrBYUiHM0HEleDo0u.Pr7lU6aeY7rqQ0zVlhxhHUV85S', 1, 3),
('juan',          '$2a$10$DcJNkf20vY99.zjCjNuJoOPE/fH5CF0bgl5j2bM1r8DYi3wn7dC..', 1, 4),
('maria',         '$2a$10$DcJNkf20vY99.zjCjNuJoOPE/fH5CF0bgl5j2bM1r8DYi3wn7dC..', 1, 5)
ON CONFLICT (login) DO NOTHING;

-- 2.4 TEXTOS
INSERT INTO TEXTOS (codt, titulo, resumen, isbn, edicion, fechapub, coda, code) VALUES
(1, 'Clean Code: Manual de desarrollo ágil de software', 'Principios, patrones y prácticas para escribir código limpio y mantenible.', '978-0132350884', 1, '2008-08-01', 1, 1),
(2, 'Refactoring: Improving the Design of Existing Code', 'Guía definitiva sobre técnicas de refactorización de software orientado a objetos.', '978-0134757599', 2, '2018-11-19', 2, 7),
(3, 'Redes de Computadoras', 'Arquitectura de protocolos, modelo OSI, TCP/IP y seguridad en redes modernas.', '978-6073208178', 5, '2012-05-10', 1, 1),
(4, 'The Art of Computer Programming: Fundamental Algorithms', 'Obra clásica sobre estructuras de datos y análisis matemático de algoritmos.', '978-0201896831', 3, '1997-07-17', 3, 7),
(5, 'Cien Años de Soledad', 'Obra maestra del realismo mágico latinoamericano y la historia de Macondo.', '978-8497592208', 1, '1967-05-30', 5, 6)
ON CONFLICT (codt) DO NOTHING;

-- 2.5 MEPRO (Asignación de Procesos a Menús)
INSERT INTO MEPRO (codm, codp) VALUES
-- Menú 1: Administración
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
-- Menú 2: Catálogo Bibliográfico
(2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13),
-- Menú 3: Préstamos y Devoluciones
(3, 14), (3, 15), (3, 16)
ON CONFLICT (codm, codp) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. TABLAS CON DEPENDENCIAS DE SEGUNDO NIVEL
-- -----------------------------------------------------------------------------

-- 3.1 ROLME (Asignación de Menús a Roles)
INSERT INTO ROLME (codr, codm) VALUES
(1, 1), (1, 2), (1, 3), -- Administrador tiene todos los menús
(2, 2), (2, 3),         -- Bibliotecario tiene Catálogo y Préstamos/Devoluciones
(3, 2)                  -- Estudiante tiene Catálogo
ON CONFLICT (codr, codm) DO NOTHING;

-- 3.2 ROLUSU (Asignación de Roles a Usuarios)
INSERT INTO ROLUSU (codr, login) VALUES
(1, 'JhonFuentes'),
(1, 'admin'),
(2, 'bibliotecario'),
(3, 'juan'),
(3, 'maria')
ON CONFLICT (codr, login) DO NOTHING;

-- 3.3 TIPOTEX (Tipos asociados a cada Texto; sw=1 lleva documento PDF)
INSERT INTO TIPOTEX (codt, codtipo, docum) VALUES
(1, 1, NULL),
(1, 2, 'clean-code-sample.pdf'),
(2, 1, NULL),
(2, 2, 'clean-code-sample.pdf'),
(3, 1, NULL),
(4, 1, NULL),
(5, 1, NULL)
ON CONFLICT (codt, codtipo) DO NOTHING;

-- 3.4 ESCRIBEN (Relación Autores - Textos)
INSERT INTO ESCRIBEN (coda, codt) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(7, 5)
ON CONFLICT (coda, codt) DO NOTHING;

-- 3.5 EJEMPLARES (disponible: 1=Libre, 0=Ocupado | estado: 1=Activo, 0=Baja)
INSERT INTO EJEMPLARES (codinv, disponible, estado, codt, per_resp, per_anula) VALUES
(1001, 0, 1, 1, 'admin', NULL), -- Ocupado en el préstamo #1
(1002, 1, 1, 1, 'admin', NULL), -- Libre
(1003, 1, 1, 1, 'JhonFuentes', NULL), -- Libre
(2001, 0, 1, 2, 'admin', NULL), -- Ocupado en el préstamo #1
(2002, 1, 1, 2, 'admin', NULL), -- Libre
(3001, 1, 1, 3, 'bibliotecario', NULL), -- Devuelto en préstamo #2 (ahora Libre)
(3002, 1, 1, 3, 'bibliotecario', NULL), -- Libre
(4001, 1, 1, 4, 'admin', NULL), -- Libre
(5001, 1, 1, 5, 'admin', NULL)  -- Libre
ON CONFLICT (codinv) DO NOTHING;

-- 3.6 MPRESTAMO (tipopres: 1=A Domicilio, 2=En Sala | estado: 1=Activo, 0=Anulado)
INSERT INTO MPRESTAMO (codp, fecha, fini, ffin, tipopres, estado, ci, login) VALUES
(1, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 1, 1, 9123456, 'admin'),
(2, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '1 day',  2, 1, 9543210, 'bibliotecario')
ON CONFLICT (codp) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. TABLAS CON DEPENDENCIAS DE TERCER Y CUARTO NIVEL
-- -----------------------------------------------------------------------------

-- 4.1 DPRESTAMO (estado: 1=Prestado/Pendiente, 0=Devuelto)
INSERT INTO DPRESTAMO (codp, codinv, estado) VALUES
(1, 1001, 1), -- Pendiente de devolución
(1, 2001, 1), -- Pendiente de devolución
(2, 3001, 0)  -- Ya devuelto
ON CONFLICT (codp, codinv) DO NOTHING;

-- 4.2 MDEVOL (Registro de devolución del préstamo #2)
INSERT INTO MDEVOL (codd, fecha, estado, login, codp) VALUES
(1, CURRENT_DATE - INTERVAL '1 day', 1, 'bibliotecario', 2)
ON CONFLICT (codd) DO NOTHING;

-- 4.3 DDEVOL (Detalle de ejemplares devueltos en la devolución #1)
INSERT INTO DDEVOL (codd, codinv) VALUES
(1, 3001)
ON CONFLICT (codd, codinv) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. ACTUALIZACIÓN DE SECUENCIAS (SERIAL) PARA NUEVOS REGISTROS
-- -----------------------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('personas', 'codper'), COALESCE((SELECT MAX(codper) FROM PERSONAS), 1));
SELECT setval(pg_get_serial_sequence('areas', 'coda'), COALESCE((SELECT MAX(coda) FROM AREAS), 1));
SELECT setval(pg_get_serial_sequence('tipos', 'codtipo'), COALESCE((SELECT MAX(codtipo) FROM TIPOS), 1));
SELECT setval(pg_get_serial_sequence('editoriales', 'code'), COALESCE((SELECT MAX(code) FROM EDITORIALES), 1));
SELECT setval(pg_get_serial_sequence('autores', 'coda'), COALESCE((SELECT MAX(coda) FROM AUTORES), 1));
SELECT setval(pg_get_serial_sequence('roles', 'codr'), COALESCE((SELECT MAX(codr) FROM ROLES), 1));
SELECT setval(pg_get_serial_sequence('menus', 'codm'), COALESCE((SELECT MAX(codm) FROM MENUS), 1));
SELECT setval(pg_get_serial_sequence('procesos', 'codp'), COALESCE((SELECT MAX(codp) FROM PROCESOS), 1));
SELECT setval(pg_get_serial_sequence('textos', 'codt'), COALESCE((SELECT MAX(codt) FROM TEXTOS), 1));
SELECT setval(pg_get_serial_sequence('ejemplares', 'codinv'), COALESCE((SELECT MAX(codinv) FROM EJEMPLARES), 1));
SELECT setval(pg_get_serial_sequence('mprestamo', 'codp'), COALESCE((SELECT MAX(codp) FROM MPRESTAMO), 1));
SELECT setval(pg_get_serial_sequence('mdevol', 'codd'), COALESCE((SELECT MAX(codd) FROM MDEVOL), 1));

