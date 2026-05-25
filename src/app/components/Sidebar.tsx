import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  BarChart3,
  HelpCircle,
  Settings,
  X,
  Clock,
  Award,
  Target,
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

interface MenuSection {
  title: string;
  roles: string[];
  items: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections: MenuSection[] = [
  {
    title: 'Principal',
    roles: ['admin', 'coordinador', 'docente', 'estudiante'],
    items: [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        roles: ['admin', 'coordinador', 'docente', 'estudiante'],
      },
    ],
  },
  {
    title: 'Gestión Usuarios',
    roles: ['admin'],
    items: [
      {
        path: '/docentes',
        label: 'Docentes',
        icon: <GraduationCap className="w-5 h-5" />,
        roles: ['admin'],
      },
      {
        path: '/estudiantes',
        label: 'Estudiantes',
        icon: <Users className="w-5 h-5" />,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Gestión Académica',
    roles: ['admin', 'coordinador'],
    items: [
      {
        path: '/facultades',
        label: 'Facultades',
        icon: <Building2 className="w-5 h-5" />,
        roles: ['admin'],
      },
      {
        path: '/programas',
        label: 'Programas',
        icon: <BookOpen className="w-5 h-5" />,
        roles: ['admin', 'coordinador'],
      },
      {
        path: '/carga-academica',
        label: 'Carga Académica',
        icon: <Calendar className="w-5 h-5" />,
        roles: ['admin', 'coordinador'],
      },
      {
        path: '/microcurriculo',
        label: 'Microcurrículos',
        icon: <FileText className="w-5 h-5" />,
        roles: ['admin', 'coordinador'],
      },
    ],
  },
  {
    title: 'Mi Horario',
    roles: ['docente', 'estudiante'],
    items: [
      {
        path: '/carga-academica',
        label: 'Horario',
        icon: <Clock className="w-5 h-5" />,
        roles: ['docente', 'estudiante'],
      },
    ],
  },
  {
    title: 'Asistencias y Calificaciones',
    roles: ['docente'],
    items: [
      {
        path: '/asistencia',
        label: 'Tomar Asistencia',
        icon: <ClipboardCheck className="w-5 h-5" />,
        roles: ['docente'],
      },
      {
        path: '/calificaciones',
        label: 'Calificaciones',
        icon: <Award className="w-5 h-5" />,
        roles: ['docente'],
      },
      {
        path: '/microcurriculo',
        label: 'Plan de Clase',
        icon: <FileText className="w-5 h-5" />,
        roles: ['docente'],
      },
    ],
  },
  {
    title: 'Mi Seguimiento',
    roles: ['estudiante'],
    items: [
      {
        path: '/asistencia',
        label: 'Mis Asistencias',
        icon: <ClipboardCheck className="w-5 h-5" />,
        roles: ['estudiante'],
      },
      {
        path: '/microcurriculo',
        label: 'Mis Materias',
        icon: <BookOpen className="w-5 h-5" />,
        roles: ['estudiante'],
      },
      {
        path: '/seguimiento',
        label: 'Seguimiento Académico',
        icon: <Target className="w-5 h-5" />,
        roles: ['estudiante'],
      },
    ],
  },
  {
    title: 'Seguimiento',
    roles: ['coordinador'],
    items: [
      {
        path: '/asistencia',
        label: 'Control Asistencia',
        icon: <ClipboardCheck className="w-5 h-5" />,
        roles: ['coordinador'],
      },
    ],
  },
  {
    title: 'Reportes',
    roles: ['admin'],
    items: [
      {
        path: '/asistencia',
        label: 'Control Asistencia',
        icon: <ClipboardCheck className="w-5 h-5" />,
        roles: ['admin'],
      },
      {
        path: '/reportes',
        label: 'Reportes',
        icon: <BarChart3 className="w-5 h-5" />,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Ayuda',
    roles: ['admin', 'coordinador', 'docente', 'estudiante'],
    items: [
      {
        path: '/credenciales',
        label: 'Credenciales',
        icon: <HelpCircle className="w-5 h-5" />,
        roles: ['admin', 'coordinador', 'docente', 'estudiante'],
      },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const canAccessSection = (section: MenuSection): boolean => {
    return section.roles.includes(user?.role || '');
  };

  const canAccessItem = (item: MenuItem): boolean => {
    return item.roles.includes(user?.role || '');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white font-medium">Menú</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {menuSections.map((section) => {
            if (!canAccessSection(section)) return null;

            return (
              <div key={section.title}>
                <h3 className="text-xs uppercase text-gray-500 mb-2 px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    if (!canAccessItem(item)) return null;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`
                        }
                      >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <NavLink
            to="/configuracion"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Configuración</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
