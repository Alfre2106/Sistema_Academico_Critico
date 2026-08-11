```markdown
# 🎓 Sistema Académico Crítico

Sistema de gestión y control académico orientado al manejo integral de estudiantes, asignaturas, inscripciones y seguimiento de estados académicos críticos. Diseñado bajo una arquitectura modular para garantizar la integridad referencial y la consistencia de datos en procesos universitarios clave.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Python (FastAPI / Flask) / Java
* **Base de Datos:** MySQL / PostgreSQL (Modelado relacional con claves foráneas e integridad de datos)
* **API Architecture:** RESTful APIs, Respuestas JSON, Códigos de estado HTTP
* **Validación & Estructura:** Pydantic / DTOs, Arquitectura en capas (Controller/Router, Service, DAO/Repository)
* **Herramientas:** Git, GitHub, Postman, MySQL Workbench / DBeaver

---

## 🚀 Características Principales

* **Gestión de Entidades Académicas (CRUD):** Control completo de estudiantes, docentes, facultades y asignaturas.
* **Control de Inscripciones y Cursos:** Validación de cupos, prerrequisitos e historial académico.
* **Manejo de Estados Críticos:** Identificación y seguimiento de estudiantes en riesgo académico, alertas de rendimiento y promedios acumulados.
* **Consistencia de Datos:** Restricciones de integridad a nivel de base de datos para evitar duplicidad o incongruencias de matrícula.

---

## 🏗️ Estructura del Proyecto

```text
Sistema_Academico_Critico/
├── config/           # Configuración de variables de entorno y base de datos
├── database/         # Scripts SQL de creación de tablas, relaciones e índices
├── models/           # Modelos de datos y entidades relacionales
├── repositories/     # Capa de acceso a datos y ejecución de consultas SQL
├── services/         # Lógica de negocio (cálculo de promedios, validaciones de estado)
├── routers/          # Controladores HTTP y exposición de endpoints REST
├── main.py           # Punto de entrada de la aplicación
└── requirements.txt  # Dependencias del proyecto

```

---

## 📋 Endpoints Principales

| Método | Endpoint | Descripción |
| --- | --- | --- |
| **GET** | `/estudiantes` | Obtener listado general de estudiantes |
| **POST** | `/estudiantes` | Registrar nuevo estudiante con datos académicos |
| **GET** | `/estudiantes/{id}/historial` | Consultar materias e historial de notas |
| **GET** | `/academic/criticos` | Listar estudiantes en condición académica crítica |
| **POST** | `/inscripciones` | Matricular asignatura verificando prerrequisitos |

---

## ⚙️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
```bash
git clone [https://github.com/Alfre2106/Sistema_Academico_Critico.git](https://github.com/Alfre2106/Sistema_Academico_Critico.git)
cd Sistema_Academico_Critico

```


2. **Crear e inicializar el entorno virtual:**
```bash
python -m venv venv
# En Windows:
.\venv\Scripts\activate

```


3. **Instalar dependencias:**
```bash
pip install -r requirements.txt

```


4. **Configurar la base de datos:**
* Importa el script SQL ubicado en `database/schema.sql` en tu gestor de base de datos.
* Define tus credenciales en el archivo de configuración o `.env`.


5. **Iniciar el servidor:**
```bash
uvicorn main:app --reload

```



---

## 👨‍💻 Autor

**Alfredo Mercado Leal**

*Ingeniero de Sistemas / Desarrollador Full-Stack & Backend*

* 📧 titoleal41@gmail.com
* 📧 titomerle6@gmail.com


* 💼 [GitHub Profile](https://www.google.com/search?q=https://github.com/Alfre2106)


```

```
