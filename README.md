# albertpolfer.github.io

Web personal de Albert Polo. Dos páginas estáticas, sin build, sin npm y sin
GitHub Actions.

| Página | Fichero | Para qué |
|---|---|---|
| Sobre mí | `index.html` | Perfil profesional: experiencia, formación y stack |
| Servicios | `servicios.html` | ReportAuto, informes automáticos para administradores de fincas |

Comparten `styles.css` y `app.js`, así que la identidad visual y el
comportamiento son los mismos en ambas.

## Ficheros

| Fichero | Qué es |
|---|---|
| `index.html`, `servicios.html` | Las dos páginas |
| `styles.css` | Todos los estilos. Paleta azul marino + latón en variables CSS |
| `app.js` | Correo ofuscado, formulario, copiar al portapapeles, aparición al scroll |
| `favicon.svg` | Icono de pestaña |
| `og.png`, `og-servicios.png` | Imágenes de previsualización al compartir, una por página |
| `robots.txt`, `sitemap.xml` | Indexación |

## Publicación

GitHub Pages, rama `main`, carpeta raíz. Settings → Pages → *Deploy from a
branch* → `main` / `(root)`.

## Notas de mantenimiento

- **Colores:** todo sale de las variables de `:root` en `styles.css`. El acento
  tiene dos tonos, `--brass` para fondo claro y `--brass-lite` para fondo
  marino, para que el contraste pase AA en los dos sentidos.
- **Sin imágenes de stock.** Los fondos son degradados y rejillas CSS; las
  ilustraciones son SVG en línea dentro del HTML.
- **CV en PDF:** se genera con Ctrl+P sobre `index.html`. Los estilos de
  impresión ocultan cabecera, botones y formularios, y dejan el currículum en
  una columna. No hay ningún PDF en el repo.
- **Correo:** no aparece ningún `mailto:` en el HTML servido. La dirección se
  compone en JavaScript al cargar.
- **Formulario:** abre el cliente de correo del visitante con el mensaje ya
  redactado. No hay backend ni terceros, y no se almacena nada.
- **Pendientes:** en `PENDIENTES.md`, que no se publica.

## Dominio propio

1. Crear `CNAME` en la raíz con una sola línea, por ejemplo `albertpolo.dev`.
2. En el DNS, sin proxy: `CNAME` de `www` a `albertpolfer.github.io`, y cuatro
   registros `A` del dominio raíz a `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153` y `185.199.111.153`.
3. Settings → Pages → *Custom domain*, y marcar *Enforce HTTPS*.
4. Actualizar `canonical`, `og:url`, `og:image` y `twitter:image` en las dos
   páginas, más `robots.txt` y `sitemap.xml`.
