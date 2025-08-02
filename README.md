# PlaniMe WebApp 🍎

Una aplicación web moderna para la gestión de planes alimenticios personalizados, desarrollada con tecnologías vanilla para máximo rendimiento y compatibilidad.

🌐 **[Ver Demo en Vivo](https://planime.diecode.lat/index.html)**

## 📋 Descripción

PlaniMe WebApp es una interfaz frontend desarrollada con HTML, CSS y JavaScript vanilla, que interactúa con la API RESTful de PlaniMe. Permite a los usuarios visualizar y gestionar planes alimenticios personalizados, optimizando la experiencia tanto en dispositivos móviles como de escritorio.

## 🚀 Características Principales

- ✅ **Planes Personalizados**: Gestión completa de planes alimenticios adaptados a cada usuario
- 📱 **Diseño Responsive**: Optimizado para dispositivos móviles y escritorio (Mobile First)
- 🔐 **Autenticación Segura**: Sistema de autenticación con JWT
- ⚡ **Alto Rendimiento**: Optimización de assets y lazy loading
- 🎨 **Interfaz Intuitiva**: Diseño limpio y fácil de usar
- 🔄 **API RESTful**: Comunicación eficiente con el backend

## 🛠️ Tecnologías

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con animaciones y diseño responsive
- **JavaScript Vanilla**: Lógica de aplicación sin dependencias externas

### Arquitectura
- **Patrón**: Cliente-Servidor (REST API)
- **Comunicación**: Fetch API + JSON
- **Seguridad**: JWT + HTTPS + CORS
- **Rendimiento**: Optimización de assets y lazy loading

## 📁 Estructura del Proyecto

```
PLANIME-WEBAPP/
│
├── .gitignore
├── index.html
│
├── .github/
│   └── workflows/
│       └── main.yml              # CI/CD Pipeline
│
├── assets/
│   ├── css/
│   │   ├── animations/           # Animaciones CSS
│   │   ├── base/                 # Estilos base
│   │   └── responsive/           # Media queries
│   │
│   ├── downloads/
│   │   └── PlaniMe_v1.0.apk     # Versión móvil
│   │
│   ├── images/                   # Recursos gráficos
│   └── js/                       # Scripts JavaScript
│
└── pages/
    ├── auth/                     # Autenticación
    ├── contact/                  # Contacto
    ├── home/                     # Página principal
    ├── plans/                    # Gestión de planes
    └── user/                     # Perfil de usuario
```

## 🎯 Nuestra Misión

Empoderar a las personas para que alcancen sus objetivos de salud y bienestar a través de planes de nutrición personalizados que sean accesibles, efectivos y disfrutables.

## 🔮 Nuestra Visión

Revolucionar la forma en que las personas abordan la nutrición combinando tecnología de vanguardia con ciencia nutricional.

## 💎 Nuestros Valores

### Personalización
Creemos que no hay dos personas iguales, y sus planes de nutrición tampoco deberían serlo.

### Adaptabilidad
Aprendemos y nos ajustamos continuamente para ofrecerte las soluciones más efectivas.

### Simplicidad
Hacemos que la nutrición sea sencilla y accesible, eliminando la complejidad.

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/planime-webapp.git
   cd planime-webapp
   ```

2. **Servidor local (opcional)**
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js (http-server)
   npx http-server
   ```

3. **Accede a la aplicación**
   ```
   http://localhost:8000
   ```

### Uso en Producción

La aplicación está optimizada para ser servida desde cualquier servidor web estático. Simplemente sube los archivos a tu servidor web y configura el dominio.

## 📱 Versión Móvil

Además de la versión web responsive, también contamos con una aplicación móvil nativa disponible en:
- **Android**: `assets/downloads/PlaniMe_v1.0.apk`

## 🔧 Desarrollo

### Scripts Disponibles

La aplicación utiliza JavaScript vanilla, por lo que no requiere proceso de build. Para desarrollo:

1. Realiza cambios en los archivos fuente
2. Recarga el navegador para ver los cambios
3. Utiliza las herramientas de desarrollo del navegador para debugging

### CI/CD

El proyecto incluye configuración de GitHub Actions para despliegue automático:
- **Archivo**: `.github/workflows/main.yml`
- **Triggers**: Push a rama main
- **Acciones**: Deploy automático a servidor de producción



## 👨‍💻 Desarrollador

**Ing. Diego Magaña Álvarez**
- **Rol**: Arquitecto y Desarrollador Full-Stack
- **Experiencia**: 3+ años en el ciclo completo de desarrollo de aplicaciones web/móviles y sistemas escalables
- **Enfoque en el proyecto**: 
  - Diseño arquitectónico hasta implementación en producción
  - Construcción de interfaces dinámicas y APIs robustas
  - Administración de bases de datos y despliegue en cloud
  - Optimización de rendimiento y seguridad
  - Automatización con prácticas DevOps (CI/CD)
- **Contacto**: [soydiegoo71@gmail.com](mailto:soydiegoo71@gmail.com)

## 🆘 Soporte

¿Necesitas ayuda? Puedes:
- Crear un [issue](https://github.com/tu-usuario/planime-webapp/issues) en GitHub
- Contactar al desarrollador: [soydiegoo71@gmail.com](mailto:soydiegoo71@gmail.com)
- Visitar nuestra página de [contacto](https://planime.diecode.lat/pages/contact/contactUs.html)

---

⭐ Si te gusta este proyecto, ¡no olvides darle una estrella!

**PlaniMe** - Revolucionando la nutrición personalizada con tecnología 🚀
