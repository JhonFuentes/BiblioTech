package com.bibliotech.backend.config;

import com.bibliotech.backend.model.*;
import com.bibliotech.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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

        // 2. Menus
        Menu mAdmin = null;
        Menu mCatalogo = null;
        if (menuRepository.count() == 0) {
            Menu m1 = new Menu();
            m1.setNombre("Administración");
            m1.setEstado(1);
            mAdmin = menuRepository.save(m1);

            Menu m2 = new Menu();
            m2.setNombre("Catálogo Bibliográfico");
            m2.setEstado(1);
            mCatalogo = menuRepository.save(m2);
        } else {
            mAdmin = menuRepository.findAll().stream().filter(m -> m.getNombre().toLowerCase().contains("admin")).findFirst()
                    .orElse(menuRepository.findAll().get(0));
            if (menuRepository.count() > 1) {
                mCatalogo = menuRepository.findAll().get(1);
            }
        }

        // 3. Procesos
        if (procesoRepository.count() == 0) {
            Proceso p1 = new Proceso();
            p1.setNombre("Gestión de Usuarios");
            p1.setEnlace("/gestion-usuarios");
            p1.setEstado(1);
            p1 = procesoRepository.save(p1);

            Proceso p2 = new Proceso();
            p2.setNombre("Gestión de Áreas");
            p2.setEnlace("/gestion-areas");
            p2.setEstado(1);
            p2 = procesoRepository.save(p2);

            Proceso p3 = new Proceso();
            p3.setNombre("Gestión de Editoriales");
            p3.setEnlace("/gestion-editoriales");
            p3.setEstado(1);
            p3 = procesoRepository.save(p3);

            Proceso p4 = new Proceso();
            p4.setNombre("Gestión de Tipos");
            p4.setEnlace("/gestion-tipos");
            p4.setEstado(1);
            p4 = procesoRepository.save(p4);

            Proceso p5 = new Proceso();
            p5.setNombre("Gestión de Autores");
            p5.setEnlace("/gestion-autores");
            p5.setEstado(1);
            p5 = procesoRepository.save(p5);

            // Bind MEPRO
            if (mAdmin != null) {
                MePro mp1 = new MePro();
                mp1.setCodm(mAdmin.getCodm());
                mp1.setCodp(p1.getCodp());
                meProRepository.save(mp1);
            }

            if (mCatalogo != null) {
                for (Proceso p : new Proceso[]{p2, p3, p4, p5}) {
                    MePro mp = new MePro();
                    mp.setCodm(mCatalogo.getCodm());
                    mp.setCodp(p.getCodp());
                    meProRepository.save(mp);
                }
            }

            // Bind ROLME
            if (rolAdmin != null && mAdmin != null && mCatalogo != null) {
                RolMe rm1 = new RolMe();
                rm1.setCodr(rolAdmin.getCodr());
                rm1.setCodm(mAdmin.getCodm());
                rolMeRepository.save(rm1);

                RolMe rm2 = new RolMe();
                rm2.setCodr(rolAdmin.getCodr());
                rm2.setCodm(mCatalogo.getCodm());
                rolMeRepository.save(rm2);
            }
        }

        // 4. Bind users to admin role
        if (rolAdmin != null) {
            for (Usuario u : usuarioRepository.findAll()) {
                if (rolUsuRepository.findByLogin(u.getLogin()).isEmpty()) {
                    RolUsu ru = new RolUsu();
                    ru.setCodr(rolAdmin.getCodr());
                    ru.setLogin(u.getLogin());
                    rolUsuRepository.save(ru);
                }
            }
        }

        // 5. Sample Areas if empty
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

        // 6. Sample Editoriales if empty
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

        // 7. Sample Tipos if empty
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

        // 8. Sample Autores if empty
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
    }
}
