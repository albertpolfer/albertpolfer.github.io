# albertpolfer.github.io

Web personal de Albert Polo. HTML y CSS estáticos, sin build, sin dependencias
de npm y sin GitHub Actions. Todo el sitio vive en `index.html`, estilos y script
incluidos.

## Publicación

GitHub Pages, rama `main`, carpeta raíz (`/`).
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.

## Ficheros

| Fichero       | Qué es                                              |
|---------------|-----------------------------------------------------|
| `index.html`  | El sitio completo: contenido, estilos y script       |
| `favicon.svg` | Icono de pestaña                                     |
| `robots.txt`  | Indexación abierta + referencia al sitemap           |
| `sitemap.xml` | Una sola URL                                         |

## Notas de mantenimiento

- **CV en PDF**: se genera desde la propia web con el botón *Guardar CV en PDF*
  (o Ctrl+P). Los estilos `@media print` pasan el sitio a una columna, quitan
  fondos y evitan cortes dentro de cada bloque. No hay ningún PDF en el repo.
- **Correo**: no aparece ningún `mailto:` en el HTML servido. La dirección se
  compone en JavaScript al cargar la página.
- **Idiomas**: castellano por defecto, inglés con el selector ES/EN. Sin
  JavaScript se ve la versión en castellano y `<html lang="es">` es correcto.
- **Pendientes**: los huecos por rellenar están marcados en el HTML como
  `[[PENDIENTE: ...]]`. Se ven en pantalla y se ocultan al imprimir.
  Búscalos con `grep PENDIENTE index.html`.

## Dominio propio

1. Crear un fichero `CNAME` en la raíz con una única línea, por ejemplo
   `albertpolo.dev`.
2. En el DNS del dominio, sin proxy (en Cloudflare, modo *DNS only*):
   - Subdominio (`www`) → `CNAME` a `albertpolfer.github.io`
   - Dominio raíz → cuatro registros `A`:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Settings → Pages → *Custom domain*, y marcar *Enforce HTTPS* cuando GitHub
   haya emitido el certificado.
4. Actualizar en `index.html` la etiqueta `<link rel="canonical">`, `og:url` y
   el campo `url` del JSON-LD, y la URL de `robots.txt` y `sitemap.xml`.
