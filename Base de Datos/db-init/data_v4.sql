-- Datos iniciales y de prueba para Versión 4 (Presentación #4)
-- BiblioTech

-- 1. ROLES
INSERT INTO ROLES (codr, nombre, estado) VALUES 
(1, 'Administrador', 1),
(2, 'Bibliotecario', 1)
ON CONFLICT (codr) DO NOTHING;

-- 2. MENUS
INSERT INTO MENUS (codm, nombre, estado) VALUES 
(1, 'Administración', 1),
(2, 'Catálogo Bibliográfico', 1)
ON CONFLICT (codm) DO NOTHING;

-- 3. PROCESOS
INSERT INTO PROCESOS (codp, nombre, enlace, estado) VALUES 
(1, 'Gestión de Usuarios', '/gestion-usuarios', 1),
(2, 'Gestión de Áreas', '/gestion-areas', 1),
(3, 'Gestión de Editoriales', '/gestion-editoriales', 1),
(4, 'Gestión de Tipos', '/gestion-tipos', 1),
(5, 'Gestión de Autores', '/gestion-autores', 1)
ON CONFLICT (codp) DO NOTHING;

-- 4. ROLME (Menús por Rol)
INSERT INTO ROLME (codr, codm) VALUES 
(1, 1),
(1, 2),
(2, 2)
ON CONFLICT (codr, codm) DO NOTHING;

-- 5. MEPRO (Procesos por Menú)
INSERT INTO MEPRO (codm, codp) VALUES 
(1, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5)
ON CONFLICT (codm, codp) DO NOTHING;

-- 6. ROLUSU (Roles de Usuarios existentes)
INSERT INTO ROLUSU (codr, login) VALUES 
(1, 'JhonFuentes'),
(1, 'juan')
ON CONFLICT (codr, login) DO NOTHING;

-- 7. AREAS DE EJEMPLO
INSERT INTO AREAS (nombre, estado) VALUES 
('Tecnología e Informática', 1),
('Ciencias Exactas', 1),
('Literatura Universal', 1),
('Medicina y Salud', 1),
('Historia y Filosofía', 1),
('Ingeniería de Sistemas', 1),
('Física y Matemáticas', 1)
ON CONFLICT DO NOTHING;

-- 8. EDITORIALES DE EJEMPLO
INSERT INTO EDITORIALES (nombre, estado) VALUES 
('Pearson Educación', 1),
('McGraw-Hill', 1),
('O''Reilly Media', 1),
('Editorial Santillana', 1),
('Alfaomega Grupo Editor', 1),
('Editorial Planeta', 1)
ON CONFLICT DO NOTHING;

-- 9. TIPOS DE TEXTO (sw: 1=Digital requiere documento, 0=Físico/Defecto)
INSERT INTO TIPOS (nombre, estado, sw) VALUES 
('Libro Impreso', 1, 0),
('Libro Digital (E-Book)', 1, 1),
('Revista Científica', 1, 1),
('Tesis de Grado', 1, 1),
('Monografía', 1, 0)
ON CONFLICT DO NOTHING;

-- 10. AUTORES DE EJEMPLO
INSERT INTO AUTORES (nombre, ap, am, genero, estado) VALUES 
('Robert', 'Martin', 'Cecil', 'M', 1),
('Martin', 'Fowler', '', 'M', 1),
('Gabriel', 'García', 'Márquez', 'M', 1),
('Ada', 'Lovelace', 'Byron', 'F', 1),
('Margaret', 'Hamilton', 'Heafield', 'F', 1),
('Andrew', 'Tanenbaum', 'Stuart', 'M', 1),
('Donald', 'Knuth', 'Ervin', 'M', 1)
ON CONFLICT DO NOTHING;
