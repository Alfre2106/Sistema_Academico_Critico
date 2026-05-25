import { TrendingUp, Award, BookOpen, Clock, Target } from 'lucide-react';

export function SeguimientoAcademico() {
  const materias = [
    { nombre: 'Base de Datos', creditos: 4, nota: 4.2, asistencia: 95, estado: 'Aprobado' },
    { nombre: 'Programación Avanzada', creditos: 4, nota: 4.5, asistencia: 92, estado: 'Aprobado' },
    { nombre: 'Algoritmos', creditos: 3, nota: 3.8, asistencia: 88, estado: 'Aprobado' },
    { nombre: 'Ética Profesional', creditos: 2, nota: 4.8, asistencia: 97, estado: 'Aprobado' },
    { nombre: 'Redes de Computadores', creditos: 4, nota: 4.1, asistencia: 90, estado: 'Aprobado' },
  ];

  const historialNotas = [
    { semestre: 'Semestre 1', promedio: 4.1, creditos: 18 },
    { semestre: 'Semestre 2', promedio: 4.0, creditos: 20 },
    { semestre: 'Semestre 3', promedio: 4.3, creditos: 19 },
    { semestre: 'Semestre 4', promedio: 4.4, creditos: 18 },
    { semestre: 'Semestre 5 (Actual)', promedio: 4.3, creditos: 17 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          Mi Seguimiento Académico
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl text-white">4.2</div>
              <div className="text-sm text-gray-400">Promedio General</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl text-white">85</div>
              <div className="text-sm text-gray-400">Créditos Aprobados</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl text-white">92%</div>
              <div className="text-sm text-gray-400">Asistencia Promedio</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl text-white">5</div>
              <div className="text-sm text-gray-400">Semestre Actual</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg text-white mb-4">Materias del Semestre Actual</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Materia</th>
                <th className="text-center text-sm text-gray-400 pb-3">Créditos</th>
                <th className="text-center text-sm text-gray-400 pb-3">Nota Actual</th>
                <th className="text-center text-sm text-gray-400 pb-3">Asistencia</th>
                <th className="text-center text-sm text-gray-400 pb-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 text-white">{materia.nombre}</td>
                  <td className="py-4 text-center text-gray-400">{materia.creditos}</td>
                  <td className="py-4 text-center">
                    <span
                      className={`${
                        materia.nota >= 4.5
                          ? 'text-green-400'
                          : materia.nota >= 4.0
                          ? 'text-blue-400'
                          : materia.nota >= 3.5
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {materia.nota.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span
                      className={`${
                        materia.asistencia >= 90
                          ? 'text-green-400'
                          : materia.asistencia >= 80
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {materia.asistencia}%
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                      {materia.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg text-white mb-4">Historial de Promedios por Semestre</h2>
        <div className="space-y-3">
          {historialNotas.map((semestre, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg"
            >
              <div>
                <div className="text-white font-medium">{semestre.semestre}</div>
                <div className="text-sm text-gray-400">{semestre.creditos} créditos</div>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl font-medium ${
                    semestre.promedio >= 4.5
                      ? 'text-green-400'
                      : semestre.promedio >= 4.0
                      ? 'text-blue-400'
                      : semestre.promedio >= 3.5
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {semestre.promedio.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Promedio</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-white mb-4">Progreso del Programa</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Créditos Completados</span>
                <span className="text-white">85 / 160</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: '53%' }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Te faltan <span className="text-white">75 créditos</span> para completar el programa
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-white mb-4">Próximos Objetivos</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Completar semestre actual con promedio mayor a 4.0</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Mantener asistencia superior al 90%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Completar 18 créditos este semestre</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
