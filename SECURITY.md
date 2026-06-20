# Seguridad — AETHERION Editorial OS

AETHERION es local-first:

- No carga scripts externos.
- No usa CDN.
- No usa telemetría.
- No envía datos por defecto.
- IndexedDB es el almacenamiento principal.
- `localStorage` queda como fallback/migración.
- La API key del puente IA no se guarda ni se exporta.

## IA opcional

Si el usuario activa Ollama o un endpoint compatible con OpenAI, el texto del prompt se envía al endpoint configurado. Esa acción es manual y explícita.

## Recomendaciones

- Para manuscritos sensibles, usar Ollama local.
- No publicar exports `.json` con contenido privado dentro de repositorios públicos.
- Revisar `AUDIT_REPORT.md` antes de publicar.

## Reportar problemas

Abrir un issue en GitHub con:

- navegador
- sistema operativo
- pasos para reproducir
- captura si procede
- error de consola si existe


## Auditoría v2.2

- La API key del proveedor externo no se persiste en IndexedDB, localStorage ni exportaciones JSON.
- Cuando IndexedDB está disponible, el estado completo no se duplica en localStorage.
- Los IDs importados se normalizan antes de renderizarse como atributos `data-*`.
- Se aplica límite de 25 MB al importador JSON para reducir riesgo de congelación del navegador.
- No existen llamadas externas por defecto. Solo se ejecuta `fetch` cuando el usuario activa Ollama/API y pulsa el botón correspondiente.


## Refuerzos v2.2

- Añadida política CSP en `index.html` para bloquear objetos, formularios externos y uso como iframe.
- El borrador actual se guarda como `draft` normalizado para evitar pérdida de trabajo antes de guardar proyecto.
- Las llamadas IA usan timeout defensivo de 45 segundos.
- Los endpoints IA se validan antes de llamar: solo `http:`/`https:`, sin credenciales en la URL.
- Si se introduce una API key para proveedor externo, se exige HTTPS salvo endpoint local o red privada.
- Se mantiene un límite defensivo de procesamiento en navegador para textos extremadamente grandes.
