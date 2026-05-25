import { useAuth, mockUsers, rolePermissions } from '../context/AuthContext';
import { Key, Info, Shield, Copy } from 'lucide-react';

export function Credenciales() {
  const { switchRole } = useAuth();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <Key className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl text-white">Credenciales de Prueba</h1>
          <p className="text-sm text-gray-400">
            Panel de desarrollo para testing de roles y permisos
          </p>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-300 mb-2">
              Este es un prototipo con autenticación simulada
            </p>
            <p className="text-xs text-blue-400">
              Usa las credenciales a continuación para probar diferentes roles y
              permisos. También puedes usar el Role Switcher en el header para cambiar
              entre vistas sin cerrar sesión.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mockUsers.map((user) => (
          <div
            key={user.email}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg text-white mb-1 capitalize">{user.role}</h3>
                <p className="text-sm text-gray-400">{user.name}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs ${
                  user.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-400'
                    : user.role === 'coordinador'
                    ? 'bg-blue-500/20 text-blue-400'
                    : user.role === 'docente'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white">{user.email}</div>
                  <button
                    onClick={() => copyToClipboard(user.email)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Contraseña</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white font-mono">{user.password}</div>
                  <button
                    onClick={() => copyToClipboard(user.password)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => switchRole(user.role)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm"
            >
              Iniciar como {user.role}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg text-white">Matriz de Permisos por Rol</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3 pr-4">Rol</th>
                <th className="text-left text-sm text-gray-400 pb-3">Permisos</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <tr key={role} className="border-b border-gray-800">
                  <td className="py-4 pr-4">
                    <span className="text-white capitalize">{role}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {permissions.slice(0, 6).map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                      {permissions.length > 6 && (
                        <span className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded">
                          +{permissions.length - 6} más
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
