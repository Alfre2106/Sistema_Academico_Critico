import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'admin' | 'coordinador' | 'docente' | 'estudiante';

export interface User {
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = [
  {
    email: 'admin@example.com',
    password: 'Admin123!',
    name: 'Administrador Sistema',
    role: 'admin' as Role,
  },
  {
    email: 'coordinador@example.com',
    password: 'Coord123!',
    name: 'Juan Coordinador',
    role: 'coordinador' as Role,
  },
  {
    email: 'docente@example.com',
    password: 'Doc123!',
    name: 'Dr. Carlos Méndez',
    role: 'docente' as Role,
  },
  {
    email: 'estudiante@example.com',
    password: 'Est123!',
    name: 'Carlos Estudiante',
    role: 'estudiante' as Role,
  },
];

const rolePermissions: Record<Role, string[]> = {
  admin: [
    'view_all',
    'edit_all',
    'crud_users',
    'crud_facultades',
    'crud_programas',
    'crud_aulas',
    'crud_docentes',
    'crud_estudiantes',
    'edit_microcurriculo',
    'assign_roles',
    'view_reports',
    'view_diagrams',
    'manage_carga_academica',
    'view_asistencia',
    'register_asistencia',
  ],
  coordinador: [
    'view_programas',
    'edit_programas',
    'view_microcurriculo',
    'edit_microcurriculo',
    'manage_carga_academica',
    'view_asistencia',
    'view_docentes',
    'view_estudiantes',
    'assign_docentes',
  ],
  docente: [
    'view_horario',
    'register_asistencia',
    'view_estudiantes',
    'edit_microcurriculo_assigned',
    'view_asistencia',
  ],
  estudiante: [
    'view_horario',
    'view_materias',
    'view_asistencia_own',
    'view_microcurriculo',
    'view_notas',
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser({
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: Role) => {
    const foundUser = mockUsers.find((u) => u.role === role);
    if (foundUser) {
      setUser({
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { mockUsers, rolePermissions };
