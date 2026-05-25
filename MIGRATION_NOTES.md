# Notas de Migración - Códigos de Materias

## Fecha: Mayo 2026
## Versión: 1.1.0

---

## 📋 Resumen de Cambios

Se actualizó el sistema de códigos de materias para usar **prefijos basados en carrera** en lugar de iniciales del nombre de la materia.

### Antes (❌ Incorrecto)
Códigos basados en nombre de materia:
- `BD-501` → Base de Datos
- `PA-301` → Programación Avanzada
- `PS-201` → Psicología Social
- `AN-402` → Anatomía II

### Después (✓ Correcto)
Códigos basados en carrera:
- `SIS-301` → Base de Datos (Ingeniería de **Sistemas**)
- `SIS-302` → Programación Avanzada (Ingeniería de **Sistemas**)
- `PSI-201` → Psicología Social (**Psicología**)
- `MED-401` → Anatomía II (**Medicina**)

---

## 🔧 Cambios Técnicos Realizados

### 1. **Actualización de Datos Iniciales** (`DataContext.tsx`)
```typescript
// ANTES
{ codigo: 'BD-501', materia: 'Base de Datos' }

// DESPUÉS
{ codigo: 'SIS-301', materia: 'Base de Datos' }
```

### 2. **Migración Automática de LocalStorage**
Se creó `utils/dataMigration.ts` que:
- Detecta códigos antiguos en localStorage
- Los actualiza automáticamente al nuevo formato
- Se ejecuta automáticamente al cargar la aplicación

### 3. **Mapeo de Carreras a Prefijos** (`CargaAcademica.tsx`)
```typescript
const CARRERAS_POR_FACULTAD = {
  'Ingeniería': [
    { nombre: 'Ingeniería de Sistemas', prefijo: 'SIS' },
    { nombre: 'Ingeniería Civil', prefijo: 'CIV' },
    // ...
  ],
  'Ciencias Sociales': [
    { nombre: 'Psicología', prefijo: 'PSI' },
    // ...
  ],
  // ...
};
```

---

## ✅ Validaciones Implementadas

### Código de Materia
- ✓ Auto-genera prefijo según carrera seleccionada
- ✓ Sugiere siguiente número disponible
- ✓ Valida duplicados en tiempo real
- ✓ Muestra lista de códigos existentes

### Nombre de Materia
- ✓ Detecta nombres duplicados exactos
- ✓ Alerta sobre nombres similares
- ✓ Bloquea creación si ya existe

---

## 🚀 Para Usuarios Existentes

La migración es **automática**, pero si encuentras problemas:

### Opción 1: Dejar que la migración automática lo maneje
- La aplicación actualizará los códigos al cargar

### Opción 2: Limpiar datos manualmente (si hay problemas)
Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.clear();
location.reload();
```

---

## 📊 Prefijos de Carreras Disponibles

| Carrera | Prefijo |
|---------|---------|
| Ingeniería de Sistemas | `SIS` |
| Ingeniería Civil | `CIV` |
| Ingeniería Industrial | `IND` |
| Ingeniería Electrónica | `ELE` |
| Psicología | `PSI` |
| Trabajo Social | `TSO` |
| Sociología | `SOC` |
| Medicina | `MED` |
| Enfermería | `ENF` |
| Fisioterapia | `FIS` |
| Diseño Gráfico | `DIS` |
| Comunicación Social | `COM` |
| Filosofía | `FIL` |

---

## 🐛 Solución de Problemas

### Problema: Los códigos viejos siguen apareciendo
**Solución:**
1. Abre las DevTools (F12)
2. Ve a la pestaña "Application" → "Local Storage"
3. Busca la clave `academicSystem_cargaAcademica`
4. Elimínala
5. Recarga la página

### Problema: Error al crear nueva materia
**Solución:**
1. Verifica que hayas seleccionado Facultad y Carrera
2. El prefijo debe generarse automáticamente
3. Ingresa solo el número (ej: 303)

---

## ✨ Características Nuevas

1. **Selector de Facultad y Carrera** en cascada
2. **Auto-generación de códigos** con prefijo de carrera
3. **Validación de duplicados** en tiempo real
4. **Lista de códigos existentes** por carrera
5. **Detección de nombres similares**
6. **Validación de horarios** sin conflictos

---

## 📝 Commit Sugerido

```bash
git add .
git commit -m "fix: actualizar códigos de materias a formato basado en carrera

- Cambiar BD-501 → SIS-301 (Base de Datos)
- Cambiar PA-301 → SIS-302 (Programación Avanzada)
- Cambiar PS-201 → PSI-201 (Psicología Social)
- Cambiar AN-402 → MED-401 (Anatomía II)
- Agregar migración automática de localStorage
- Implementar validación de duplicados en tiempo real
- Agregar selector en cascada Facultad → Carrera"
```

---

**Autor:** Claude Code  
**Fecha:** Mayo 2026  
**Estado:** ✅ Completado
