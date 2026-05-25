import { useAuth } from '../context/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';
import { NotificationPanel } from './NotificationPanel';
import { LogOut, Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      coordinador: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      docente: 'bg-green-500/20 text-green-400 border-green-500/30',
      estudiante: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return colors[role as keyof typeof colors] || colors.estudiante;
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>

          <h1 className="text-base sm:text-lg lg:text-xl text-white truncate">
            Sistema Académico
          </h1>

          <div className="hidden xl:flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-96">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="block">
            <RoleSwitcher />
          </div>

          <NotificationPanel />

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-700">
            <div className="text-right hidden lg:block">
              <div className="text-sm text-white">{user?.name}</div>
              <div
                className={`text-xs px-2 py-0.5 rounded border capitalize inline-block ${getRoleBadgeColor(
                  user?.role || ''
                )}`}
              >
                {user?.role}
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="sm:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
