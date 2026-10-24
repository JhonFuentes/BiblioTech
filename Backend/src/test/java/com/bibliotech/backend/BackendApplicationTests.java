package com.bibliotech.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.beans.factory.annotation.Autowired;
import com.bibliotech.backend.repository.AreaRepository;
import com.bibliotech.backend.repository.EditorialRepository;
import com.bibliotech.backend.repository.TipoRepository;
import com.bibliotech.backend.repository.AutorRepository;
import com.bibliotech.backend.repository.PersonaRepository;
import org.springframework.data.domain.PageRequest;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private AreaRepository areaRepository;

	@Autowired
	private EditorialRepository editorialRepository;

	@Autowired
	private TipoRepository tipoRepository;

	@Autowired
	private AutorRepository autorRepository;

	@Autowired
	private PersonaRepository personaRepository;

	@Test
	void contextLoads() {
		var areas = areaRepository.findListByFilters(null, null);
		System.out.println("Areas count: " + areas.size());

		var editoriales = editorialRepository.findListByFilters(null, null);
		System.out.println("Editoriales count: " + editoriales.size());

		var tipos = tipoRepository.findListByFilters(null, null);
		System.out.println("Tipos count: " + tipos.size());

		var autores = autorRepository.findListByFilters(null, null);
		System.out.println("Autores count: " + autores.size());

		var personas = personaRepository.findByFilters(null, null, null, PageRequest.of(0, 10));
		System.out.println("Personas count: " + personas.getTotalElements());
	}
}
