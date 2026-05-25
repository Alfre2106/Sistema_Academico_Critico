import { Clock, MapPin, User } from 'lucide-react';

interface HorarioItem {
  dia: string;
  hora: string;
  materia: string;
  salon: string;
  docente: string;
}

interface HorarioGridProps {
  horario: HorarioItem[];
}

export function HorarioGrid({ horario }: HorarioGridProps) {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horas = [
    '6:00-8:00',
    '8:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
  ];

  const getClaseForSlot = (dia: string, hora: string) => {
    return horario.find((item) => item.dia === dia && item.hora === hora);
  };

  const getColorForMateria = (materia: string): string => {
    const colors = [
      'bg-blue-500/20 border-blue-500/50 text-blue-400',
      'bg-purple-500/20 border-purple-500/50 text-purple-400',
      'bg-green-500/20 border-green-500/50 text-green-400',
      'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      'bg-pink-500/20 border-pink-500/50 text-pink-400',
      'bg-indigo-500/20 border-indigo-500/50 text-indigo-400',
    ];

    const hash = materia.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Horario Académico
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-gray-800/50">
            <div className="p-3 border-r border-b border-gray-800 sticky left-0 bg-gray-800 z-10">
              <span className="text-sm text-gray-400">Hora</span>
            </div>
            {dias.map((dia) => (
              <div
                key={dia}
                className="p-3 border-r last:border-r-0 border-b border-gray-800 text-center"
              >
                <span className="text-sm text-white font-medium">{dia}</span>
              </div>
            ))}
          </div>

          {horas.map((hora, horaIndex) => (
            <div
              key={hora}
              className="grid grid-cols-[100px_repeat(6,1fr)] min-h-[120px]"
            >
              <div className="p-3 border-r border-b border-gray-800 sticky left-0 bg-gray-900 z-10 flex items-center">
                <span className="text-xs text-gray-400">{hora}</span>
              </div>
              {dias.map((dia, diaIndex) => {
                const clase = getClaseForSlot(dia, hora);
                return (
                  <div
                    key={`${dia}-${hora}`}
                    className="border-r last:border-r-0 border-b border-gray-800 p-2"
                  >
                    {clase ? (
                      <div
                        className={`h-full rounded-lg border-l-4 p-3 ${getColorForMateria(
                          clase.materia
                        )} hover:scale-[1.02] transition-transform cursor-pointer`}
                      >
                        <div className="text-sm font-medium mb-2 line-clamp-2">
                          {clase.materia}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs opacity-90">
                            <MapPin className="w-3 h-3" />
                            <span>{clase.salon}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs opacity-90">
                            <User className="w-3 h-3" />
                            <span className="truncate">{clase.docente}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-700">
                        <span className="text-xs">-</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-800/50 border-t border-gray-800">
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/50 rounded"></div>
            <span>Programación</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500/20 border border-purple-500/50 rounded"></div>
            <span>Base de Datos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded"></div>
            <span>Otras Materias</span>
          </div>
        </div>
      </div>
    </div>
  );
}
