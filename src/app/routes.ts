import { createBrowserRouter } from 'react-router';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Facultades } from './pages/Facultades';
import { Programas } from './pages/Programas';
import { Docentes } from './pages/Docentes';
import { Estudiantes } from './pages/Estudiantes';
import { CargaAcademica } from './pages/CargaAcademica';
import { Asistencia } from './pages/Asistencia';
import { Microcurriculo } from './pages/Microcurriculo';
import { Reportes } from './pages/Reportes';
import { Credenciales } from './pages/Credenciales';
import { Configuracion } from './pages/Configuracion';
import { AccesoDenegado } from './pages/AccesoDenegado';
import { Calificaciones } from './pages/Calificaciones';
import { SeguimientoAcademico } from './pages/SeguimientoAcademico';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'facultades',
        Component: Facultades,
      },
      {
        path: 'programas',
        Component: Programas,
      },
      {
        path: 'docentes',
        Component: Docentes,
      },
      {
        path: 'estudiantes',
        Component: Estudiantes,
      },
      {
        path: 'carga-academica',
        Component: CargaAcademica,
      },
      {
        path: 'asistencia',
        Component: Asistencia,
      },
      {
        path: 'microcurriculo',
        Component: Microcurriculo,
      },
      {
        path: 'reportes',
        Component: Reportes,
      },
      {
        path: 'credenciales',
        Component: Credenciales,
      },
      {
        path: 'configuracion',
        Component: Configuracion,
      },
      {
        path: 'acceso-denegado',
        Component: AccesoDenegado,
      },
      {
        path: 'calificaciones',
        Component: Calificaciones,
      },
      {
        path: 'seguimiento',
        Component: SeguimientoAcademico,
      },
    ],
  },
]);
