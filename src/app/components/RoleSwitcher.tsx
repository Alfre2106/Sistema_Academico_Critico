import { useState } from 'react';
import { useAuth, Role } from '../context/AuthContext';
import { ChevronDown, Users } from 'lucide-react';

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { value: Role; label: string; shortLabel: string; color: string }[] = [
    { value: 'admin', label: 'Administrador', shortLabel: 'Admin', color: 'text-purple-400' },
    { value: 'coordinador', label: 'Coordinador', shortLabel: 'Coord', color: 'text-blue-400' },
    { value: 'docente', label: 'Docente', shortLabel: 'Doc', color: 'text-green-400' },
    { value: 'estudiante', label: 'Estudiante', shortLabel: 'Est', color: 'text-yellow-400' },
  ];

  const currentRole = roles.find((r) => r.value === user?.role);

  const handleRoleChange = (role: Role) => {
    switchRole(role);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-2 sm:px-3 lg:px-4 py-2 transition-colors"
      >
        <Users className="w-4 h-4 text-gray-400 hidden sm:block" />
        <span className="text-xs sm:text-sm text-gray-400 hidden md:inline">Demo:</span>
        <span className={`text-xs sm:text-sm ${currentRole?.color} truncate max-w-[60px] sm:max-w-none`}>
          <span className="sm:hidden">{currentRole?.shortLabel}</span>
          <span className="hidden sm:inline">{currentRole?.label}</span>
        </span>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <p className="text-xs text-gray-400 px-2">
                Cambiar vista de demostración
              </p>
            </div>
            <div className="p-1">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    user?.role === role.value
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className={`text-sm ${role.color}`}>
                    {role.label}
                  </div>
                  {user?.role === role.value && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Vista actual
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
