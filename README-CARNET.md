# Carnet Virtual - Universidad de Medellín

Aplicación PWA (Progressive Web App) del carnet virtual universitario.

## Estructura del proyecto

```
Carnet virtual/
├── index.html          ← Página principal
├── styles.css          ← Estilos
├── app.js              ← Lógica de la app
├── sw.js               ← Service Worker (offline)
├── manifest.json       ← Config PWA
├── assets/
│   ├── logo-udem.svg   ← Logo universidad
│   └── student-placeholder.svg
└── icons/
    ├── icon-192.png    ← Íconos de la app
    └── icon-512.png
```

## Funcionalidades

- **Carnet digital** con foto, QR y código de barras
- **Carousel** deslizar entre vista foto y QR grande
- **U Virtual** con cursos y buscador
- **Opciones** con seguridad biométrica
- **Instalable** como app en iPhone/Android
- **Funciona offline** con Service Worker

---

## 🚀 Formas rápidas de probarlo en iPhone

### Opción 1: Servidor local (más rápida para demo)

```bash
# Desde la carpeta del proyecto:
cd "Carnet virtual"
python3 -m http.server 8080
```

Luego abre en Safari del iPhone:
```
http://<IP_DE_TU_MAC>:8080
```

Para ver tu IP local:
```bash
ipconfig getifaddr en0
```

### Opción 2: GitHub Pages (GRATIS, producción)

1. Crear repo en GitHub
2. Subir estos archivos
3. Settings → Pages → Source: main → Guardar
4. Acceder desde: `https://tuusuario.github.io/carnet-virtual/`

### Opción 3: Netlify Drop (30 segundos)

1. Ve a [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra la carpeta "Carnet virtual"
3. Te da una URL pública inmediata

### Opción 4: Vercel (gratis)

```bash
npm i -g vercel
cd "Carnet virtual"
vercel
```

### Opción 5: ngrok (tunnel desde tu Mac)

```bash
# Instalar:
brew install ngrok

# Iniciar servidor local + tunnel:
python3 -m http.server 8080 &
ngrok http 8080
```

Te da una URL pública tipo `https://abc123.ngrok.io` que funciona en cualquier dispositivo.

---

## Instalar como App en iPhone

1. Abrir la URL en **Safari**
2. Tocar el botón **Compartir** (□↑)
3. Seleccionar **"Añadir a pantalla de inicio"**
4. La app aparece como ícono nativo

---

## Personalización

### Cambiar datos del estudiante

Edita los valores en `index.html`:
- `student-name`: Nombre completo
- `student-id-number`: Número de ID
- `student-role`: Rol (Estudiante, Docente, etc.)

### Cambiar foto del estudiante

Reemplaza las referencias `src="assets/student-placeholder.svg"` por la ruta o URL de la foto real.

### Cambiar colores

Edita las variables CSS en `styles.css`:
```css
:root {
  --primary: #4EAFA5;     /* Color teal principal */
  --accent: #7B1F2E;      /* Color guinda/maroon del carnet */
}
```

### Generar carnets dinámicamente

Para una implementación con backend:
1. Crear API que devuelva datos del estudiante
2. Modificar `app.js` para hacer fetch a la API
3. Usar autenticación JWT para seguridad
