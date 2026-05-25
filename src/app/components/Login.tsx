import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, mockUsers } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Info } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-white mb-2">Sistema Académico</h1>
            <p className="text-sm text-gray-500 mb-2">Diseñado por: Alfredo Mercado - Edgar Rodelo - Miguelangel De La Hoz</p>
            <p className="text-gray-400">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="usuario@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-900/20 border border-red-800 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 text-sm transition-colors"
            >
              <Info className="w-4 h-4" />
              {showCredentials ? 'Ocultar' : 'Ver'} credenciales de prueba
            </button>

            {showCredentials && (
              <div className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
                <p className="text-xs text-gray-400 mb-3">
                  Haz clic en cualquier usuario para autocompletar:
                </p>
                {mockUsers.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    onClick={() => {
                      setEmail(user.email);
                      setPassword(user.password);
                      setError('');
                    }}
                    className="w-full text-left bg-gray-900 hover:bg-gray-850 border border-gray-700 rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white capitalize">{user.role}</span>
                      <span className="text-xs text-gray-500">{user.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{user.password}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-center text-gray-600 mt-6">
            Este es un prototipo con autenticación simulada
          </p>
        </div>
      </div>
    </div>
  );
}
