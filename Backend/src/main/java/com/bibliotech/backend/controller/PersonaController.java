package com.bibliotech.backend.controller;

import com.bibliotech.backend.dto.PersonaDTO;
import com.bibliotech.backend.dto.AccesoDTO;
import com.bibliotech.backend.model.Persona;
import com.bibliotech.backend.model.Dato;
import com.bibliotech.backend.model.Telefono;
import com.bibliotech.backend.model.Usuario;
import com.bibliotech.backend.repository.PersonaRepository;
import com.bibliotech.backend.repository.DatoRepository;
import com.bibliotech.backend.repository.MprestamoRepository;
import com.bibliotech.backend.repository.TelefonoRepository;
import com.bibliotech.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "*")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private DatoRepository datoRepository;
    @Autowired
    private TelefonoRepository telefonoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private MprestamoRepository mprestamoRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public ResponseEntity<List<PersonaDTO>> listarPersonas() {
        List<PersonaDTO> lista = personaRepository.findAll().stream()
                .sorted(Comparator.comparing(Persona::getCodper))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonaDTO> obtenerPersona(@PathVariable Integer id) {
        return personaRepository.findById(id)
                .map(p -> ResponseEntity.ok(this.mapToDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/page")
    public ResponseEntity<org.springframework.data.domain.Page<PersonaDTO>> listarPersonasPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String filtroNombre,
            @RequestParam(required = false) Integer filtroEstado,
            @RequestParam(required = false) String filtroTipoPer) {
        
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        
        // Handle empty strings as nulls for the query
        String nombre = (filtroNombre != null && !filtroNombre.trim().isEmpty()) ? filtroNombre : null;
        String tipo = (filtroTipoPer != null && !filtroTipoPer.trim().isEmpty() && !filtroTipoPer.equals("Todos")) ? filtroTipoPer : null;
        Integer estado = null;
        if (filtroEstado != null && filtroEstado != -1) {
             estado = filtroEstado; // -1 can mean Todos if we send from frontend
        }

        org.springframework.data.domain.Page<PersonaDTO> pagedResult = personaRepository
                .findByFilters(nombre, estado, tipo, pageable)
                .map(this::mapToDTO);
        
        return ResponseEntity.ok(pagedResult);
    }

    private PersonaDTO mapToDTO(Persona p) {
        PersonaDTO dto = new PersonaDTO();
        dto.setCodper(p.getCodper());
        dto.setNombre(p.getNombre());
        dto.setAp(p.getAp());
        dto.setAm(p.getAm());
        dto.setGenero(p.getGenero());
        dto.setEstado(p.getEstado());
        dto.setTipoper(p.getTipoper());
        dto.setFoto(p.getFoto());

        datoRepository.findByCodper(p.getCodper()).ifPresent(d -> dto.setCi(d.getCi()));

        List<String> tels = telefonoRepository.findByCodper(p.getCodper())
            .stream().map(Telefono::getNumero).collect(Collectors.toList());
        dto.setTelefonos(tels);

        Optional<Usuario> userOpt = usuarioRepository.findAll().stream()
            .filter(u -> u.getPersona() != null && u.getPersona().getCodper().equals(p.getCodper())).findFirst();
        if (userOpt.isPresent()) {
            dto.setHasLogin(true);
            dto.setLogin(userOpt.get().getLogin());
        } else {
            dto.setHasLogin(false);
        }

        return dto;
    }

    @PostMapping("/uploadFoto")
    public ResponseEntity<?> subirFotoPersona(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "codper", required = false) Integer codper) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Por favor seleccione un archivo de imagen."));
        }
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            }

            if (!extension.equals(".jpg") && !extension.equals(".jpeg") && !extension.equals(".png") && !extension.equals(".webp")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Solo se permiten archivos de imagen (.jpg, .jpeg, .png, .webp)."));
            }

            String fileName = (codper != null ? codper : ("p" + (System.currentTimeMillis() % 100000000L))) + extension;
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());

            if (codper != null) {
                personaRepository.findById(codper).ifPresent(p -> {
                    p.setFoto(fileName);
                    personaRepository.save(p);
                });
            }

            return ResponseEntity.ok(Map.of("success", true, "foto", fileName));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al subir la foto."));
        }
    }

    private String validarDatosPersona(PersonaDTO dto, Integer excludeCodper) {
        if (dto.getCi() == null || dto.getCi() <= 0) {
            return "La Cédula de Identidad (CI) es obligatoria";
        }
        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            return "El nombre de la persona es obligatorio";
        }
        boolean tieneAp = dto.getAp() != null && !dto.getAp().trim().isEmpty();
        boolean tieneAm = dto.getAm() != null && !dto.getAm().trim().isEmpty();
        if (!tieneAp && !tieneAm) {
            return "Debe ingresar por lo menos un apellido (Paterno o Materno)";
        }
        List<String> telsValidos = dto.getTelefonos() == null ? List.of() :
                dto.getTelefonos().stream().filter(t -> t != null && !t.trim().isEmpty()).toList();
        if (telsValidos.isEmpty()) {
            return "Debe registrar por lo menos un número de teléfono";
        }
        Optional<Dato> porCi = datoRepository.findById(dto.getCi());
        if (porCi.isPresent() && (excludeCodper == null || !porCi.get().getCodper().equals(excludeCodper))) {
            return "La cédula " + dto.getCi() + " ya está registrada para otra persona";
        }
        return null;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> crearPersona(@RequestBody PersonaDTO dto) {
        String errorValidacion = validarDatosPersona(dto, null);
        if (errorValidacion != null) {
            return ResponseEntity.badRequest().body(Map.of("message", errorValidacion));
        }

        Persona p = new Persona();
        p.setNombre(dto.getNombre().trim());
        p.setAp(dto.getAp() != null ? dto.getAp().trim() : "");
        p.setAm(dto.getAm() != null ? dto.getAm().trim() : "");
        p.setGenero(dto.getGenero() != null ? dto.getGenero() : "M");
        p.setEstado(1);
        p.setTipoper(dto.getTipoper() != null ? dto.getTipoper() : "P");
        p.setFoto(dto.getFoto() != null && dto.getFoto().length() > 40 ? dto.getFoto().substring(0, 40) : dto.getFoto());
        p = personaRepository.save(p);

        if (dto.getCi() != null) {
            Dato d = new Dato();
            d.setCi(dto.getCi());
            d.setCodper(p.getCodper());
            datoRepository.save(d);
        }

        if (dto.getTelefonos() != null) {
            java.util.Set<String> uniqueTels = new java.util.LinkedHashSet<>();
            for (String tel : dto.getTelefonos()) {
                if (tel != null && !tel.trim().isEmpty()) {
                    uniqueTels.add(tel.trim());
                }
            }
            for (String tel : uniqueTels) {
                Telefono t = new Telefono(p.getCodper(), tel);
                telefonoRepository.save(t);
            }
        }
        
        dto.setCodper(p.getCodper());
        dto.setEstado(1);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> modificarPersona(@PathVariable Integer id, @RequestBody PersonaDTO dto) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();

        String errorValidacion = validarDatosPersona(dto, id);
        if (errorValidacion != null) {
            return ResponseEntity.badRequest().body(Map.of("message", errorValidacion));
        }

        Persona p = pOpt.get();
        p.setNombre(dto.getNombre().trim());
        p.setAp(dto.getAp() != null ? dto.getAp().trim() : "");
        p.setAm(dto.getAm() != null ? dto.getAm().trim() : "");
        p.setGenero(dto.getGenero() != null ? dto.getGenero() : p.getGenero());
        p.setTipoper(dto.getTipoper() != null ? dto.getTipoper() : p.getTipoper());
        if (dto.getFoto() != null && !dto.getFoto().trim().isEmpty()) {
            String foto = dto.getFoto().trim();
            p.setFoto(foto.length() > 40 ? foto.substring(0, 40) : foto);
        }
        personaRepository.save(p);

        // Actualizar Cédula de Identidad (Dato)
        Optional<Dato> dOpt = datoRepository.findByCodper(id);
        if (dto.getCi() != null) {
            if (dOpt.isPresent()) {
                Dato existing = dOpt.get();
                if (!existing.getCi().equals(dto.getCi())) {
                    Integer oldCi = existing.getCi();
                    Dato d = new Dato(dto.getCi(), id);
                    datoRepository.saveAndFlush(d);
                    mprestamoRepository.actualizarCi(oldCi, dto.getCi());
                    datoRepository.delete(existing);
                    datoRepository.flush();
                }
            } else {
                Dato d = new Dato(dto.getCi(), id);
                datoRepository.save(d);
            }
        } else {
            if (dOpt.isPresent()) {
                Integer oldCi = dOpt.get().getCi();
                if (!mprestamoRepository.findByCi(oldCi).isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "No se puede eliminar la cédula porque la persona tiene préstamos registrados"));
                }
                datoRepository.delete(dOpt.get());
                datoRepository.flush();
            }
        }

        // Actualizar Teléfonos
        List<Telefono> existingTels = telefonoRepository.findByCodper(id);
        if (!existingTels.isEmpty()) {
            telefonoRepository.deleteAll(existingTels);
            telefonoRepository.flush();
        }

        if (dto.getTelefonos() != null) {
            java.util.Set<String> uniqueTels = new java.util.LinkedHashSet<>();
            for (String tel : dto.getTelefonos()) {
                if (tel != null && !tel.trim().isEmpty()) {
                    uniqueTels.add(tel.trim());
                }
            }
            for (String tel : uniqueTels) {
                Telefono t = new Telefono(id, tel);
                telefonoRepository.save(t);
            }
        }
        
        return ResponseEntity.ok(mapToDTO(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPersona(@PathVariable Integer id) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        Persona p = pOpt.get();
        p.setEstado(0);
        personaRepository.save(p);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activar")
    public ResponseEntity<?> activarPersona(@PathVariable Integer id) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        Persona p = pOpt.get();
        p.setEstado(1);
        personaRepository.save(p);
        return ResponseEntity.ok().build();
    }

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/{id}/acceso")
    public ResponseEntity<?> asignarAcceso(@PathVariable Integer id, @RequestBody AccesoDTO acceso) {
        Optional<Persona> pOpt = personaRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Optional<Usuario> userOpt = usuarioRepository.findByLogin(acceso.getLogin());
        if (userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre de usuario ya está en uso"));
        }
        
        Usuario u = new Usuario();
        u.setLogin(acceso.getLogin());
        u.setPasswd(passwordEncoder.encode(acceso.getPassword()));
        u.setEstado(1);
        u.setPersona(pOpt.get());
        usuarioRepository.save(u);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/acceso")
    public ResponseEntity<?> modificarAcceso(@PathVariable Integer id, @RequestBody AccesoDTO acceso) {
        Optional<Usuario> userOpt = usuarioRepository.findAll().stream()
                .filter(u -> u.getPersona() != null && u.getPersona().getCodper().equals(id)).findFirst();
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Usuario u = userOpt.get();
        if (acceso.getPassword() != null && !acceso.getPassword().isEmpty()) {
            u.setPasswd(passwordEncoder.encode(acceso.getPassword()));
        }
        usuarioRepository.save(u);
        return ResponseEntity.ok().build();
    }
}
