"Proyecto: 'Sistema Académico - Prototipo UI (Dark Admin Dashboard) — Roles y Auth'

Objetivo: Generar un prototipo de alta fidelidad (sin backend) con pantallas navegables, control de accesos por rol y un flujo de login con credenciales de prueba. El prototipo debe simular autorización mostrando/ocultando módulos según el rol (Administrador, Coordinador, Docente, Estudiante). Mantener diseño oscuro tipo dashboard con sidebar izquierdo, header superior, cards métricas y tablas.

Requisitos clave sobre roles y autenticación:

Implementar un componente de Login (pantalla y modal) que autentique contra credenciales mock.
Cada rol debe tener su propia vista principal (dashboard) y acceso sólo a los módulos permitidos.
Añadir un modo de demostración/probar roles (Role Switcher) en el header para cambiar entre vistas sin reingresar credenciales.
Mostrar mensajes de error para credenciales inválidas, y una pantalla de 'Acceso denegado' si un usuario intenta entrar a una ruta no permitida.
Incluir un panel de "Credenciales de prueba" en la página de ayuda/dev que liste los usuarios mock y sus permisos.
Credenciales mock (para poblar el prototipo)

Administrador
Correo: admin@example.com
Contraseña: Admin123!
Permisos: Ver/editar todo, CRUD usuarios, gestionar facultades/programas/aulas, ver/editar microcurrículos, asignar roles, ver reportes
Coordinador
Correo: coordinador@example.com
Contraseña: Coord123!
Permisos: Ver/editar programas y microcurrículos de su facultad, gestionar carga académica para su facultad, ver asistencia de cursos propios
Docente
Correo: docente@example.com
Contraseña: Doc123!
Permisos: Ver su horario, registrar asistencia, ver listas de estudiantes, editar PlanMicrocurriculo asignado
Estudiante
Correo: estudiante@example.com
Contraseña: Est123!
Permisos: Ver su horario, ver materias inscritas, marcar asistencia cuando aplique, ver microcurrículos y notas (simulado)
Usuario no autorizado (para testing de errores)
Correo: invalido@example.com
Contraseña: Wrong123!
Pantallas / frames por rol (crear variantes o páginas separadas)

Login (pantilla + modal) — with email/password inputs, mostrar tooltip con credenciales de prueba
Dashboard — Admin (widgets de métricas, quick-actions), Coordinador (métricas por facultad/programa), Docente (horario, próximas clases, control de asistencia), Estudiante (horario, materias, estado académico)
Facultades / Programas — Admin y Coordinador (CRUD) — leer solo para Docente, Estudiante
Docentes — Admin (CRUD), Coordinador (vincular a programas), Docente (ver perfil)
Estudiantes — Admin (CRUD), Coordinador (ver alumnos de facultad), Docente (ver listas), Estudiante (ver su perfil)
Carga Académica / Horarios — Admin y Coordinador (editar), Docente/Estudiante (ver)
Asistencia — Docente (registrar/journal), Admin/Coordinador (reportes), Estudiante (ver su registro)
Microcurrículo / PlanMicrocurriculo — Admin/Coordinador/Docente (editar según permisos), Estudiante (ver)
Diagramas / Admin Tools — solo Admin (diagrama de clases, export)
Pantalla 'Acceso denegado' y pantallas de error/loading
Matriz rápida de permisos (ejemplo descriptivo)

Administrador: acceder a todas las rutas y acciones CRUD.
Coordinador: CRUD en Programas/Microcurrículos/Asignación de carga dentro de su facultad; no puede crear usuarios globales.
Docente: ver y editar solo recursos relacionados con sus materias y horarios, registrar asistencia.
Estudiante: acceso lectura a su información y horarios; acciones mínimas.
Comportamiento de prototipado / Interacciones

Login -> valida credenciales mock -> redirige a dashboard correspondiente.
Role Switcher (header): dropdown para cambiar rol durante la demo (simula re-login).
Componentes condicionales: Sidebar con items visibles/ocultos por rol (crear variantes de Sidebar: Admin, Coordinador, Docente, Estudiante).
Rutas protegidas: al intentar navegar a una página no permitida mostrar 'Acceso denegado' y un CTA para volver al dashboard.
Tablas: botones y acciones (Editar, Eliminar, Ver) activas según permisos del rol.
Mock data: usar JSON mock para poblar tablas y cards; incluir un dataset de usuarios con rol asociado.
Implementación práctica en Figma (instrucciones para el Ai/plugin)

Crear componente 'Login' con variantes: default, error, loading, success.
Crear 4 variantes de Sidebar (Admin/Coordinador/Docente/Estudiante) y conectar cada variante a su respectiva home/dashboard en el prototipo.
En la página 'Dev / Credenciales' crear un panel con las credenciales mock y un botón 'Iniciar como...' que simule login al hacer click (link a la pantalla de ese rol).
Generar un 'Role Switcher' en el header que cambie la variante del Sidebar y la ruta activa para demo.
Añadir tooltips en el Login con la lista de credenciales de prueba (para testers).
En prototipado, crea flujos: Login (cred válidas) -> Dashboard rol X ; Login inválido -> mostrar error; Role Switcher -> navegar a dashboard objetivo sin reingreso.
Diagrama de clases y autorización

Incluir en la página 'Diagramas' un bloque que resuma la relación Usuario ↔ Rol ↔ Permisos: Clase Usuario con atributo 'rol' y una clase Rol con lista de permisos (CRUDFacultad, CRUDPrograma, GestionCarga, RegistrarAsistencia, VerReportes, etc.). Conectar Rol a las entidades sobre las que tiene permisos.
Representar en el UML que Administrador, Coordinador, Docente y Estudiante son roles asociados a la entidad Usuario (composición o asociación).
Notas UX y seguridad (simulación)

Indicar en el prototipo que las credenciales son de prueba y que la autenticación es simulada.
Mostrar estados visuales para sesión activa (avatar + nombre + rol en header).
Para acciones destructivas (Eliminar), mostrar modal de confirmación (solo Admin / Coordinador según el caso).