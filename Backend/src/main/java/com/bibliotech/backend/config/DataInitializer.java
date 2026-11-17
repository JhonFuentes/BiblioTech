package com.bibliotech.backend.config;

import com.bibliotech.backend.model.*;
import com.bibliotech.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private MenuRepository menuRepository;
    @Autowired
    private ProcesoRepository procesoRepository;
    @Autowired
    private RolMeRepository rolMeRepository;
    @Autowired
    private MeProRepository meProRepository;
    @Autowired
    private RolUsuRepository rolUsuRepository;
    @Autowired
    private AreaRepository areaRepository;
    @Autowired
    private EditorialRepository editorialRepository;
    @Autowired
    private TipoRepository tipoRepository;
    @Autowired
    private AutorRepository autorRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TextoRepository textoRepository;
    @Autowired
    private EjemplarRepository ejemplarRepository;
    @Autowired
    private EscribenRepository escribenRepository;
    @Autowired
    private TipotexRepository tipotexRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Roles
        Rol rolAdmin = null;
        if (rolRepository.count() == 0) {
            Rol r1 = new Rol();
            r1.setNombre("Administrador");
            r1.setEstado(1);
            rolAdmin = rolRepository.save(r1);

            Rol r2 = new Rol();
            r2.setNombre("Bibliotecario");
            r2.setEstado(1);
            rolRepository.save(r2);
        } else {
            rolAdmin = rolRepository.findAll().stream().findFirst().orElse(null);
        }

        // 2. Menús
        Menu mAdmin = ensureMenu("Administración");
        Menu mCatalogo = ensureMenu("Catálogo Bibliográfico");
        Menu mCirculacion = ensureMenu("Préstamos y Devoluciones");

        // 3. Procesos (B-4 a B-20)
        Proceso pUsuarios = ensureProceso("Gestión de Usuarios", "/gestion-usuarios");
        Proceso pRoles = ensureProceso("Gestión de Roles", "/gestion-roles");
        Proceso pMenus = ensureProceso("Gestión de Menús", "/gestion-menus");
        Proceso pAsigMepro = ensureProceso("Asignar Procesos a Menú", "/asignar-mepro");
        Proceso pAsigRolme = ensureProceso("Asignar Menús a Rol", "/asignar-rolme");
        Proceso pAsigRolusu = ensureProceso("Asignar Roles a Usuario", "/asignar-rolusu");

        Proceso pAreas = ensureProceso("Gestión de Áreas", "/gestion-areas");
        Proceso pEditoriales = ensureProceso("Gestión de Editoriales", "/gestion-editoriales");
        Proceso pTipos = ensureProceso("Gestión de Tipos", "/gestion-tipos");
        Proceso pAutores = ensureProceso("Gestión de Autores", "/gestion-autores");
        Proceso pTextos = ensureProceso("Gestión de Textos", "/gestion-textos");
        Proceso pEjemplares = ensureProceso("Gestión de Ejemplares", "/gestion-ejemplares");
        Proceso pDigital = ensureProceso("Búsqueda Digital", "/catalogo-digital");

        Proceso pPrestamos = ensureProceso("Gestión de Préstamos", "/gestion-prestamos");
        Proceso pDevoluciones = ensureProceso("Gestión de Devoluciones", "/gestion-devoluciones");

        // Vincular Procesos a Menús (MEPRO)
        ensureMePro(mAdmin.getCodm(), pUsuarios.getCodp());
        ensureMePro(mAdmin.getCodm(), pRoles.getCodp());
        ensureMePro(mAdmin.getCodm(), pMenus.getCodp());
        ensureMePro(mAdmin.getCodm(), pAsigMepro.getCodp());
        ensureMePro(mAdmin.getCodm(), pAsigRolme.getCodp());
        ensureMePro(mAdmin.getCodm(), pAsigRolusu.getCodp());

        ensureMePro(mCatalogo.getCodm(), pAreas.getCodp());
        ensureMePro(mCatalogo.getCodm(), pEditoriales.getCodp());
        ensureMePro(mCatalogo.getCodm(), pTipos.getCodp());
        ensureMePro(mCatalogo.getCodm(), pAutores.getCodp());
        ensureMePro(mCatalogo.getCodm(), pTextos.getCodp());
        ensureMePro(mCatalogo.getCodm(), pEjemplares.getCodp());
        ensureMePro(mCatalogo.getCodm(), pDigital.getCodp());

        ensureMePro(mCirculacion.getCodm(), pPrestamos.getCodp());
        ensureMePro(mCirculacion.getCodm(), pDevoluciones.getCodp());

        // Vincular Menús a Rol Administrador (ROLME)
        if (rolAdmin != null) {
            ensureRolMe(rolAdmin.getCodr(), mAdmin.getCodm());
            ensureRolMe(rolAdmin.getCodr(), mCatalogo.getCodm());
            ensureRolMe(rolAdmin.getCodr(), mCirculacion.getCodm());

            for (Usuario u : usuarioRepository.findAll()) {
                if (rolUsuRepository.findByLogin(u.getLogin()).isEmpty()) {
                    RolUsu ru = new RolUsu(rolAdmin.getCodr(), u.getLogin());
                    rolUsuRepository.save(ru);
                }
            }
        }

        // 4. Áreas iniciales
        if (areaRepository.count() == 0) {
            String[] areas = {
                "Tecnología e Informática", "Ciencias Exactas", "Literatura Universal",
                "Medicina y Salud", "Historia y Filosofía", "Ingeniería de Sistemas", "Física y Matemáticas"
            };
            for (String a : areas) {
                Area area = new Area();
                area.setNombre(a);
                area.setEstado(1);
                areaRepository.save(area);
            }
        }

        // 5. Editoriales iniciales
        if (editorialRepository.count() == 0) {
            String[] editoriales = {
                "Pearson Educación", "McGraw-Hill", "O'Reilly Media",
                "Editorial Santillana", "Alfaomega Grupo Editor", "Editorial Planeta"
            };
            for (String e : editoriales) {
                Editorial ed = new Editorial();
                ed.setNombre(e);
                ed.setEstado(1);
                editorialRepository.save(ed);
            }
        }

        // 6. Tipos iniciales
        if (tipoRepository.count() == 0) {
            Object[][] tipos = {
                {"Libro Impreso", 0},
                {"Libro Digital (E-Book)", 1},
                {"Revista Científica", 1},
                {"Tesis de Grado", 1},
                {"Monografía", 0}
            };
            for (Object[] t : tipos) {
                Tipo tipo = new Tipo();
                tipo.setNombre((String) t[0]);
                tipo.setSw((Integer) t[1]);
                tipo.setEstado(1);
                tipoRepository.save(tipo);
            }
        }

        // 7. Autores iniciales
        if (autorRepository.count() == 0) {
            String[][] autores = {
                {"Robert", "Martin", "Cecil", "M"},
                {"Martin", "Fowler", "", "M"},
                {"Gabriel", "García", "Márquez", "M"},
                {"Ada", "Lovelace", "Byron", "F"},
                {"Margaret", "Hamilton", "Heafield", "F"},
                {"Andrew", "Tanenbaum", "Stuart", "M"},
                {"Donald", "Knuth", "Ervin", "M"}
            };
            for (String[] a : autores) {
                Autor autor = new Autor();
                autor.setNombre(a[0]);
                autor.setAp(a[1]);
                autor.setAm(a[2]);
                autor.setGenero(a[3]);
                autor.setEstado(1);
                autorRepository.save(autor);
            }
        }

        // 8. Textos y Ejemplares de muestra si la tabla está vacía
        Texto textoMuestra = null;
        if (textoRepository.count() == 0 && areaRepository.count() > 0 && editorialRepository.count() > 0) {
            Area a1 = areaRepository.findAll().get(0);
            Editorial e1 = editorialRepository.findAll().get(0);
            Autor aut1 = autorRepository.findAll().get(0);
            Tipo tipoDigital = tipoRepository.findAll().stream().filter(t -> t.getSw() == 1).findFirst().orElse(null);
            Tipo tipoFisico = tipoRepository.findAll().stream().filter(t -> t.getSw() == 0).findFirst().orElse(null);

            Texto t1 = new Texto();
            t1.setTitulo("Clean Code: Manual de desarrollo ágil de software");
            t1.setResumen("Incluso el código malo puede funcionar. Pero si el código no está limpio, puede hacer que un equipo de desarrollo caiga de rodillas.");
            t1.setIsbn("978-0132350884");
            t1.setEdicion(1);
            t1.setFechapub(LocalDate.of(2008, 8, 1));
            t1.setCoda(a1.getCoda());
            t1.setCode(e1.getCode());
            t1.setEstado(1);
            textoMuestra = textoRepository.save(t1);

            escribenRepository.save(new Escriben(aut1.getCoda(), textoMuestra.getCodt()));
            if (tipoDigital != null) {
                tipotexRepository.save(new Tipotex(textoMuestra.getCodt(), tipoDigital.getCodtipo(), "clean-code-sample.pdf"));
            }
            if (tipoFisico != null) {
                tipotexRepository.save(new Tipotex(textoMuestra.getCodt(), tipoFisico.getCodtipo(), null));
            }
        } else if (textoRepository.count() > 0) {
            textoMuestra = textoRepository.findAll().get(0);
        }

        if (ejemplarRepository.count() == 0 && textoMuestra != null) {
            // Obtener un login válido existente en la tabla usuarios (o null si no hay ninguno)
            String validLogin = usuarioRepository.findAll().stream()
                    .map(Usuario::getLogin)
                    .findFirst()
                    .orElse(null);

            for (int i = 1; i <= 3; i++) {
                Ejemplar ej = new Ejemplar();
                ej.setCodt(textoMuestra.getCodt());
                ej.setDisponible(1); // Libre
                ej.setEstado(1);
                ej.setPer_resp(validLogin);
                ejemplarRepository.save(ej);
            }
        }
    }

    private Menu ensureMenu(String nombre) {
        return menuRepository.findAll().stream()
                .filter(m -> m.getNombre().equalsIgnoreCase(nombre.trim()))
                .findFirst()
                .orElseGet(() -> {
                    Menu m = new Menu();
                    m.setNombre(nombre.trim());
                    m.setEstado(1);
                    return menuRepository.save(m);
                });
    }

    private Proceso ensureProceso(String nombre, String enlace) {
        return procesoRepository.findAll().stream()
                .filter(p -> p.getEnlace().equalsIgnoreCase(enlace.trim()))
                .findFirst()
                .orElseGet(() -> {
                    Proceso p = new Proceso();
                    p.setNombre(nombre);
                    p.setEnlace(enlace);
                    p.setEstado(1);
                    return procesoRepository.save(p);
                });
    }

    private void ensureMePro(Integer codm, Integer codp) {
        MeProId id = new MeProId(codm, codp);
        if (!meProRepository.existsById(id)) {
            meProRepository.save(new MePro(codm, codp));
        }
    }

    private void ensureRolMe(Integer codr, Integer codm) {
        RolMeId id = new RolMeId(codr, codm);
        if (!rolMeRepository.existsById(id)) {
            rolMeRepository.save(new RolMe(codr, codm));
        }
    }
}
