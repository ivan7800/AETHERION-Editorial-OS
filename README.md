# AETHERION Editorial OS

**AETHERION Editorial OS v2.2** es una aplicación local-first para escritores y editores que quieren auditar una novela con rigor: prompts editoriales, evaluación de respuestas de IA, comparador A/B, auditoría por capítulos, memoria editorial, dashboard global, autosave real y conexión opcional a IA.

No contiene referencias a obras, personajes o universos privados. Es una base genérica y publicable.

## Qué incluye

- Generador de prompts editoriales profesionales.
- Evaluador local de respuestas de IA con evidencias, acciones, cobertura, vaguedad y riesgo de plantilla.
- Comparador A/B de reescritura.
- Auditoría de novela completa por capítulos o bloques.
- Dashboard global de salud narrativa y riesgo KDP.
- Memoria editorial local por proyecto.
- Historial de prompts.
- **Autosave real del borrador actual**, incluso antes de pulsar “Guardar proyecto”.
- Exportación de informe Markdown.
- Importación/exportación de proyecto en JSON.
- **IndexedDB como almacenamiento principal real**. `localStorage` queda como fallback de emergencia/migración y no duplica proyectos grandes cuando IndexedDB funciona.
- **Motor IA opcional**:
  - Ollama local.
  - Endpoint compatible con OpenAI.
- Claves API no persistentes: la API key no se guarda en IndexedDB, localStorage ni exportaciones.
- Validación defensiva de endpoints IA: solo URLs http(s), sin credenciales embebidas; las API keys externas se bloquean si el endpoint no usa HTTPS salvo localhost/red privada.
- Timeout de 45 segundos en llamadas IA para evitar bloqueos largos.
- Herramienta Python opcional para analizar archivos `.txt` o `.md` desde terminal.

## Uso rápido

1. Abre `index.html` en el navegador.
2. Escribe título, género, objetivo y contexto de fuentes.
3. Genera un prompt editorial.
4. Modo manual: pega el prompt en tu IA favorita y luego pega la respuesta en AETHERION.
5. Modo IA opcional: configura Ollama/API y pulsa **Enviar prompt actual**.
6. Ejecuta diagnóstico, comparador A/B, auditoría completa y memoria editorial.
7. Exporta informe `.md` o proyecto `.json`.

## Ollama local

1. Instala Ollama.
2. Descarga un modelo, por ejemplo:

```bash
ollama pull llama3.1
```

3. Inicia Ollama.
4. En AETHERION selecciona **Ollama local**.
5. Endpoint recomendado:

```txt
http://localhost:11434
```

6. Modelo recomendado:

```txt
llama3.1
```

Algunos navegadores pueden bloquear peticiones a `localhost` cuando la app se abre desde GitHub Pages. En ese caso, ejecuta el proyecto con un servidor local:

```bash
python3 -m http.server 8080
```

Luego abre:

```txt
http://localhost:8080
```

## API compatible con OpenAI

AETHERION puede llamar a endpoints compatibles con `/chat/completions`.

La API key se introduce en pantalla, se usa para esa petición y **no se guarda**.

## Publicar en GitHub Pages

1. Crea un repositorio.
2. Sube todos los archivos a la raíz.
3. Ve a `Settings > Pages`.
4. Elige `Deploy from a branch`.
5. Selecciona `main` y `/root`.
6. Guarda.

## Estructura

```txt
aetherion-editorial-os/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── package.json
├── AUDIT_REPORT.md
├── SECURITY.md
├── LICENSE
├── .gitignore
├── .nojekyll
└── tools/
    ├── editor_analyzer.py
    └── smoke_test_node.cjs
```

## Verificar antes de publicar

```bash
npm test
```

Comprueba sintaxis JavaScript, smoke test funcional, autosave de borrador, protección de API key, validación de endpoint inseguro y compilación de la herramienta Python.


## Python opcional

No es necesario para GitHub Pages. Sirve para analizar un archivo local desde terminal.

```bash
python tools/editor_analyzer.py manuscrito.txt --out informe_editorial.md
```

No instala dependencias y no usa internet.

## Auditoría v2.2

Esta edición incluye una pasada CTO/UX/QA/seguridad adicional:

- Autosave real de borrador actual.
- Restauración robusta de campos tras recarga.
- Normalización de IDs importados desde JSON.
- Límite de importación JSON de 25 MB para evitar bloqueos accidentales del navegador.
- Eliminación de duplicado completo en `localStorage` cuando IndexedDB está activo.
- Limpieza automática de restos antiguos en `localStorage` tras migrar a IndexedDB.
- Validación de endpoints IA y bloqueo de API key sobre HTTP externo.
- CSP defensiva en `index.html`.
- Revisión de trazas privadas: no hay referencias a obras, autores o universos personales.

## Limitaciones honestas

- El motor local no reemplaza a un editor humano.
- Las métricas locales son heurísticas.
- La IA opcional depende del modelo conectado.
- Si se usa API externa, el texto se envía a ese proveedor por decisión del usuario.
- IndexedDB permite mucho más volumen que `localStorage`, pero no convierte el navegador en una base de datos profesional multiusuario.

## Privacidad

Por defecto todo funciona en el navegador. La app no carga fuentes externas. No hay Google Fonts, CDNs ni telemetría. La API key no se guarda ni se exporta.
