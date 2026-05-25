import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  TrendingUp,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';
import {
  statsAdmin,
  statsCoordinador,
  statsDocente,
  statsEstudiante,
  horarioEstudiante,
  asistenciaData,
} from '../data/mockData';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="text-3xl text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl text-white mb-6">Dashboard Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Estudiantes"
          value={statsAdmin.totalEstudiantes.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500/20 text-blue-400"
          trend="+5.2%"
        />
        <StatCard
          title="Total Docentes"
          value={statsAdmin.totalDocentes}
          icon={<GraduationCap className="w-6 h-6" />}
          color="bg-purple-500/20 text-purple-400"
          trend="+2.1%"
        />
        <StatCard
          title="Programas Activos"
          value={statsAdmin.totalProgramas}
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          title="Facultades"
          value={statsAdmin.totalFacultades}
          icon={<Building2 className="w-6 h-6" />}
          color="bg-yellow-500/20 text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg text-white mb-4">Estadísticas Generales</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cursos Activos</span>
              <span className="text-white">{statsAdmin.cursosActivos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Asistencia Promedio</span>
              <span className="text-green-400">{statsAdmin.asistenciaPromedio}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg text-white mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/docentes')}
              className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
            >
              Gestionar Docentes
            </button>
            <button
              onClick={() => navigate('/estudiantes')}
              className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
            >
              Gestionar Estudiantes
            </button>
            <button
              onClick={() => navigate('/programas')}
              className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
            >
              Gestionar Programas
            </button>
            <button
              onClick={() => navigate('/reportes')}
              className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
            >
              Ver Reportes Generales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoordinadorDashboard() {
  return (
    <div>
      <h1 className="text-2xl text-white mb-6">Dashboard Coordinador</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Programas Asignados"
          value={statsCoordinador.programasAsignados}
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          title="Docentes"
          value={statsCoordinador.docentesAsignados}
          icon={<GraduationCap className="w-6 h-6" />}
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          title="Estudiantes Activos"
          value={statsCoordinador.estudiantesActivos}
          icon={<Users className="w-6 h-6" />}
          color="bg-green-500/20 text-green-400"
          trend="+3.5%"
        />
        <StatCard
          title="Cursos Activos"
          value={statsCoordinador.cursosActivos}
          icon={<Calendar className="w-6 h-6" />}
          color="bg-yellow-500/20 text-yellow-400"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg text-white mb-4">Gestión de Programas</h2>
        <p className="text-gray-400 text-sm">
          Administra programas académicos, asigna docentes y supervisa la carga académica de tu facultad.
        </p>
      </div>
    </div>
  );
}

function DocenteDashboard() {
  return (
    <div>
      <h1 className="text-2xl text-white mb-6">Dashboard Docente</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Materias Asignadas"
          value={statsDocente.materiasAsignadas}
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          title="Estudiantes Total"
          value={statsDocente.estudiantesTotal}
          icon={<Users className="w-6 h-6" />}
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          title="Asistencia Promedio"
          value={`${statsDocente.asistenciaPromedio}%`}
          icon={<Award className="w-6 h-6" />}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          title="Próxima Clase"
          value={statsDocente.proximaClase.split(' - ')[1]}
          icon={<Clock className="w-6 h-6" />}
          color="bg-yellow-500/20 text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg text-white mb-4">Próximas Clases</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-white mb-1">Base de Datos</div>
              <div className="text-xs text-gray-400">Lunes 8:00 AM - Salón A-301</div>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-white mb-1">Base de Datos</div>
              <div className="text-xs text-gray-400">Miércoles 8:00 AM - Salón A-301</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg text-white mb-4">Asistencia Reciente</h2>
          <div className="space-y-2">
            {asistenciaData.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{item.estudiante}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.estado === 'Presente'
                      ? 'bg-green-500/20 text-green-400'
                      : item.estado === 'Ausente'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {item.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EstudianteDashboard() {
  return (
    <div>
      <h1 className="text-2xl text-white mb-6">Dashboard Estudiante</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Materias Inscritas"
          value={statsEstudiante.materiasInscritas}
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          title="Créditos Actuales"
          value={statsEstudiante.creditosActuales}
          icon={<Award className="w-6 h-6" />}
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          title="Promedio General"
          value={statsEstudiante.promedioGeneral}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          title="Asistencia"
          value={`${statsEstudiante.asistenciaPromedio}%`}
          icon={<Calendar className="w-6 h-6" />}
          color="bg-yellow-500/20 text-yellow-400"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg text-white mb-4">Mi Horario Semanal</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Día</th>
                <th className="text-left text-sm text-gray-400 pb-3">Hora</th>
                <th className="text-left text-sm text-gray-400 pb-3">Materia</th>
                <th className="text-left text-sm text-gray-400 pb-3">Salón</th>
              </tr>
            </thead>
            <tbody>
              {horarioEstudiante.map((item, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-3 text-sm text-white">{item.dia}</td>
                  <td className="py-3 text-sm text-gray-400">{item.hora}</td>
                  <td className="py-3 text-sm text-white">{item.materia}</td>
                  <td className="py-3 text-sm text-gray-400">{item.salon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'coordinador':
      return <CoordinadorDashboard />;
    case 'docente':
      return <DocenteDashboard />;
    case 'estudiante':
      return <EstudianteDashboard />;
    default:
      return <div className="text-white">Rol no reconocido</div>;
  }
}
