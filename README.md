# DulceApp - Sistema de Gestión de E-commerce

**Nota: Esta documentación está incompleta, léase bajo su propio riesgo**


Este proyecto consiste en una aplicación web para la administración y venta de productos de confitería. La aplicación cuenta con un panel administrativo robusto, gestión de perfiles de usuario y una interfaz adaptable con soporte nativo para modo oscuro.

## Estado Actual del Proyecto

El sistema se encuentra en desarrollo activo. Actualmente, cuenta con los módulos de autenticación, gestión de perfil de usuario y el módulo administrativo completo para la gestión de categorías (CRUD).

### Funcionalidades Implementadas

**1. Autenticación y Seguridad**
* Inicio de sesión y registro de usuarios.
* Protección de rutas mediante `AuthContext` (Rutas privadas y públicas).
* Persistencia de sesión mediante Tokens.
* Redirección automática basada en roles y estado de autenticación.

**2. Experiencia de Usuario (UX/UI)**
* **Sistema de Temas:** Soporte completo para Modo Claro y Oscuro. Incluye detección automática de preferencia del sistema y persistencia manual mediante `localStorage`.
* **Interfaz Reactiva:** Diseño adaptativo utilizando Tailwind CSS v4.
* **Feedback Visual:** Notificaciones tipo "Toast" y Banners para confirmación de acciones.
* **Modales Personalizados:** Ventanas de confirmación para acciones destructivas (Eliminación).
* **Manejo de Estados de Carga:** Indicadores visuales (spinners) durante peticiones asíncronas.

**3. Módulo de Usuario**
* Visualización y edición de perfil.
* Validaciones de formulario en el cliente (ej. formato de teléfono).
* Corrección visual para el autocompletado del navegador (Autofill styling).

**4. Módulo de Administración (Categorías)**
* Listado de categorías con búsqueda en tiempo real (Client-side filtering).
* Creación de categorías con validación de campos requeridos.
* Edición de categorías con detección de conflictos (nombres duplicados).
* Eliminación lógica o física de categorías (según configuración de BD).
* Arquitectura basada en componentes reutilizables (`CategoriaForm`).

## Tecnologías Utilizadas

**Frontend**
* **React 18:** Biblioteca principal de interfaz.
* **Vite:** Entorno de desarrollo y empaquetador.
* **Tailwind CSS 4.0:** Framework de estilos utilitarios.
* **React Router DOM:** Manejo de navegación y rutas.
* **Axios:** Cliente HTTP para comunicación con el backend.
* **Lucide React:** Biblioteca de iconos vectoriales.

**Arquitectura de Frontend**
* **Context API:** Gestión de estado global para Autenticación y Tema.
* **Service Layer Pattern:** Abstracción de llamadas API en la carpeta `src/api/`.
* **Component-Based:** Separación de lógica en componentes reutilizables (ej. `Navbar`, `CategoriaForm`).

## Estructura del Proyecto

```text
backend/
frontend/
database/
.gitignore
README.md
```

## Configuración e Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-IC7841
```
### 2. Instalar depedencias

```bash
npm install
```

### 3. Configuración de Variables de Entorno Crear un archivo .env en frontend y otro para backend

### 4. Correr el backend

```bash
cd backend/
npm run dev
```
### 5. Correr el frontend

```bash
cd frontend/
npm run dev
```

## Convenciones de Código
- Estilos: Se utiliza Tailwind CSS con soporte para darkMode: 'class'.
- Imports: Se priorizan las rutas relativas claras.
- Componentes: Uso de componentes funcionales y Hooks.
- Manejo de Errores: Los servicios API deben manejar errores HTTP estándar (400, 401, 409, 500) y reflejarlos en la UI.