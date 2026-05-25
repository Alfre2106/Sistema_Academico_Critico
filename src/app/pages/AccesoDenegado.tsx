import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function AccesoDenegado() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-2xl text-white mb-3">Acceso Denegado</h1>

          <p className="text-gray-400 mb-2">
            No tienes permisos suficientes para acceder a este módulo.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual: <span className="text-blue-400 capitalize">{user?.role}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full text-gray-400 hover:text-white py-2 transition-colors text-sm"
            >
              Regresar a la página anterior
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400">
              Si crees que esto es un error, contacta al administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
