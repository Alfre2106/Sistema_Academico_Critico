# 📌 PROMPT FIGMA: Sistema de Gestión de Docentes por Facultad + Credenciales Inteligentes

## 🎯 OBJETIVO

Diseñar una vista moderna y escalable de gestión de docentes universitarios donde se permita:

* Registrar docentes por facultad
* Mostrar materias asignadas
* Gestionar horarios, créditos y carreras
* Crear credenciales de acceso para cada docente
* Restringir información según la facultad y carrera del docente
* Permitir acceso personalizado tipo “Portal Docente”

El sistema debe funcionar con roles inteligentes:

* Un docente de Ingeniería solo podrá visualizar:

  * Materias de Ingeniería
  * Estudiantes de Ingeniería
  * Notas de sus materias
  * Asistencia de sus grupos
  * Horarios relacionados a sus asignaciones

* Un docente de Medicina solo verá información de Medicina

* Un docente de Psicología solo verá Psicología

* Si un docente imparte varias materias o carreras dentro de una facultad, podrá visualizar únicamente esas asignaciones específicas.

---

# 🧠 CONCEPTO GENERAL DEL SISTEMA

## 🔐 Módulo de Credenciales Docentes

Cada docente tendrá:

* Usuario institucional
* Contraseña segura
* Rol automático
* Facultad asignada
* Carreras permitidas
* Materias asignadas

El sistema debe generar permisos dinámicos automáticamente según:

```txt
Facultad → Carrera → Materias → Estudiantes → Accesos
```

---

# 📋 ESTRUCTURA JERÁRQUICA

```txt
Facultad
│
├── Carrera
│   │
│   ├── Docente
│   │   ├── Credenciales
│   │   ├── Materias
│   │   ├── Notas
│   │   ├── Asistencia
│   │   └── Estudiantes asignados
│   │
│   └── Horarios
│
└── Administración académica
```

---

# 🎨 PANTALLA PRINCIPAL: DOCENTES POR FACULTAD

```txt
┌─────────────────────────────────────────────────────────────┐
│  Gestión de Docentes                                   [+] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Facultad: [ Ingeniería ▼ ]                                 │
│ Carrera:  [ Sistemas ▼ ]                                   │
│ Buscar docente: [_____________] 🔍                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 👤 Dr. Carlos Ramírez                          [✎][🗑] │ │
│ │ Especialidad: Ingeniería en Sistemas                 │ │
│ │ Email: carlos@universidad.edu                        │ │
│ │ Estado: 🟢 Activo                                    │ │
│ │ Rol: Docente                                         │ │
│ │                                                       │ │
│ │ 🔐 Credenciales de acceso                             │ │
│ │ Usuario: cramirez                                    │ │
│ │ Facultad: Ingeniería                                 │ │
│ │ Carreras habilitadas: Sistemas, Industrial           │ │
│ │                                                       │ │
│ │ 📚 Materias asignadas                                 │ │
│ │ ┌───────────────────────────────────────────────────┐ │ │
│ │ │ Base de Datos (SIS-301)                     [✎] │ │ │
│ │ │ Carrera: Ingeniería en Sistemas                 │ │ │
│ │ │ Horario: Lun-Mié 8:00-10:00                    │ │ │
│ │ │ Créditos: 4                                    │ │ │
│ │ │ 👥 35 estudiantes                              │ │ │
│ │ └───────────────────────────────────────────────────┘ │ │
│ │                                                       │ │
│ │ ┌───────────────────────────────────────────────────┐ │ │
│ │ │ Programación Avanzada (SIS-302)             [✎] │ │ │
│ │ │ Carrera: Ingeniería Industrial                 │ │ │
│ │ │ Horario: Mar-Jue 10:00-12:00                  │ │ │
│ │ │ Créditos: 4                                   │ │ │
│ │ │ 👥 28 estudiantes                             │ │ │
│ │ └───────────────────────────────────────────────────┘ │ │
│ │                                                       │ │
│ │ [Ver Portal Docente]                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

# 🔐 PORTAL DOCENTE (VISTA DEL DOCENTE)

## 📌 Objetivo

Cuando el docente inicia sesión, solo podrá ver contenido relacionado con:

* Su facultad
* Sus carreras asignadas
* Sus materias
* Sus estudiantes
* Sus notas y asistencia

---

# 🎨 DASHBOARD DOCENTE

```txt
┌──────────────────────────────────────────────┐
│ Bienvenido, Dr. Carlos Ramírez               │
├──────────────────────────────────────────────┤
│ Facultad: Ingeniería                         │
│ Carreras: Sistemas / Industrial              │
├──────────────────────────────────────────────┤
│ 📚 Mis Materias                              │
│ 👥 Mis Estudiantes                           │
│ 📝 Registrar Notas                           │
│ ✅ Tomar Asistencia                          │
│ 📅 Horarios                                  │
│ 📊 Rendimiento Académico                     │
└──────────────────────────────────────────────┘
```

---

# 📚 RESTRICCIONES AUTOMÁTICAS

## ✅ Ejemplo 1

Docente:

```txt
Facultad: Ingeniería
Carrera: Sistemas
```

Solo puede ver:

* Ingeniería
* Sistemas
* Estudiantes de Sistemas
* Materias SIS-XXX

NO puede ver:

* Medicina
* Psicología
* Derecho

---

## ✅ Ejemplo 2

Docente:

```txt
Facultad: Ingeniería
Carreras:
- Sistemas
- Industrial
```

Puede visualizar únicamente:

* Materias de Sistemas
* Materias de Industrial
* Estudiantes inscritos en esas carreras

---

# 📋 COMPONENTES PRINCIPALES

## 1️⃣ Filtro de Facultad

* Dropdown dinámico
* Carga carreras automáticamente

---

## 2️⃣ Tarjeta de Docente

### Información básica

* Nombre
* Especialidad
* Email
* Teléfono
* Oficina

### Seguridad

* Usuario
* Estado de cuenta
* Último acceso
* Botón “Restablecer contraseña”

### Permisos

* Facultad asignada
* Carreras permitidas
* Materias activas

---

## 3️⃣ Subtarjetas de Materias

Contenido:

* Código
* Nombre
* Horario
* Créditos
* Número de estudiantes
* Carrera relacionada
* Botón editar

---

# 🔄 MODALES

## ➕ Nuevo Docente

```txt
Modal: Registrar Docente
├─ Nombre *
├─ Especialidad *
├─ Email *
├─ Teléfono
├─ Facultad *
├─ Carreras permitidas *
├─ Usuario *
├─ Contraseña temporal *
├─ Estado (Activo/Inactivo)
└─ [Cancelar] [Crear]
```

---

## 🔐 Generar Credenciales

```txt
Modal: Credenciales
├─ Usuario generado automáticamente
├─ Contraseña temporal
├─ Rol: DOCENTE
├─ Facultad asignada
├─ Carreras permitidas
├─ Enviar credenciales por correo ☑
└─ [Guardar]
```

---

## 📝 Editar Materias

```txt
Modal: Editar Materia
├─ Código
├─ Nombre
├─ Carrera
├─ Horario
├─ Créditos
├─ Cupos
└─ [Guardar]
```

---

# 📊 ESTRUCTURA DE DATOS

```javascript
{
  docente: {
    id: "DOC-001",
    nombre: "Dr. Carlos Ramírez",
    especialidad: "Ingeniería en Sistemas",
    email: "carlos@universidad.edu",
    telefono: "+57 3001234567",

    credenciales: {
      usuario: "cramirez",
      passwordTemporal: "Temp2026*",
      rol: "DOCENTE",
      estado: "ACTIVO"
    },

    permisos: {
      facultad: "Ingeniería",
      carreras: [
        "Ingeniería en Sistemas",
        "Ingeniería Industrial"
      ]
    },

    materias: [
      {
        codigo: "SIS-301",
        nombre: "Base de Datos",
        carrera: "Ingeniería en Sistemas",
        creditos: 4,
        horario: "Lun-Mié 8:00-10:00",
        estudiantes: 35
      }
    ]
  }
}
```

---

# 🎯 REGLAS DEL SISTEMA

| Regla                                 | Acción                    |
| ------------------------------------- | ------------------------- |
| Docente solo visualiza su facultad    | ✅ Obligatorio             |
| Carrera debe pertenecer a la facultad | ❌ Bloquear si no coincide |
| Usuario institucional único           | ❌ No duplicados           |
| Contraseña segura                     | ✅ Mínimo 8 caracteres     |
| Horarios sin conflictos               | ✅ Validar automáticamente |
| Materias repetidas                    | ❌ Bloquear                |
| Acceso restringido por permisos       | ✅ Obligatorio             |

---

# 🎨 DISEÑO UI/UX

## Estilo Visual

* Moderno universitario
* Dashboard administrativo profesional
* Tarjetas suaves y limpias
* Diseño modular
* Responsive

---

## Colores sugeridos

### Ingeniería

* Azul
* Gris oscuro

### Medicina

* Verde
* Blanco

### Psicología

* Morado
* Gris claro

---

# 📱 RESPONSIVE

## Desktop

* Tarjetas completas
* Panel lateral
* Dashboard amplio

## Tablet

* Grid adaptable

## Mobile

* Tarjetas compactas
* Menú hamburguesa
* Navegación por pestañas

---

# 🚀 MEJORAS FUTURAS

* [ ] Inicio de sesión con Google institucional
* [ ] Recuperación de contraseña
* [ ] Historial de asistencia
* [ ] Dashboard estadístico
* [ ] Exportar notas PDF/Excel
* [ ] Notificaciones automáticas
* [ ] Chat docente-estudiante
* [ ] Control de permisos avanzado
* [ ] Auditoría de acciones
* [ ] Integración con calendario académico

---

# 📐 ESPECIFICACIONES TÉCNICAS

## Frontend

* React / Vue
* TailwindCSS
* Dashboard responsive
* Componentes reutilizables

## Backend

* FastAPI
* JWT Authentication
* RBAC (Role Based Access Control)

## Base de datos

* MySQL

---

# 🔒 LÓGICA DE PERMISOS

```txt
ADMIN
│
├── Gestiona todas las facultades
├── Puede crear docentes
└── Ve toda la información

DOCENTE
│
├── Solo ve su facultad
├── Solo sus carreras
├── Solo sus materias
├── Solo sus estudiantes
└── Solo puede registrar notas y asistencia
```

---

# 🎯 OBJETIVO FINAL DEL DISEÑO

Crear una plataforma universitaria moderna donde:

* Cada docente tenga acceso personalizado
* La información esté completamente segmentada
* Exista seguridad por facultad/carrera
* La experiencia sea intuitiva y profesional
* El diseño sea escalable para futuras funcionalidades

---

**Versión:** 2.0
**Estado:** Listo para Figma + Desarrollo
**Arquitectura:** Multi-facultad con control de acceso inteligente
