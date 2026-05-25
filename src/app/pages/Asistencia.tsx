import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { estudiantes } from '../data/mockData';
import { CheckCircle, XCircle, Clock, FileText, Download, X, BookOpen, Users, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import { generatePDF } from '../utils/pdfGenerator';
import { generateExcel, attendanceConditionalFormat } from '../utils/excelGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface Materia {
  id: string;
  nombre: string;
  icono: React.ReactNode;
  estudiantes: number;
  asistenciaRegistrada: boolean;
}

const MATERIAS: Materia[] = [
  { id: 'base-datos', nombre: 'Base de Datos', icono: <BookOpen className="w-6 h-6" />, estudiantes: 32, asistenciaRegistrada: true },
  { id: 'prog-avanzada', nombre: 'Programación Avanzada', icono: <BookOpen className="w-6 h-6" />, estudiantes: 28, asistenciaRegistrada: false },
  { id: 'algoritmos', nombre: 'Algoritmos', icono: <BookOpen className="w-6 h-6" />, estudiantes: 25, asistenciaRegistrada: false },
];

const CHART_COLORS = {
  presente: '#22c55e',
  tarde: '#f59e0b',
  ausente: '#ef4444',
};

export function Asistencia() {
  const { user, hasPermission } = useAuth();
  const { asistencia: asistenciaData, addMultipleAsistencia } = useData();
  const [selectedDate, setSelectedDate] = useState('2026-04-20');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMateriaId, setSelectedMateriaId] = useState('base-datos');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [asistenciaForm, setAsistenciaForm] = useState<Record<string, 'Presente' | 'Ausente' | 'Tarde'>>({});

  const canRegister = hasPermission('register_asistencia');
  const isStudent = user?.role === 'estudiante';

  const selectedMateria = MATERIAS.find(m => m.id === selectedMateriaId);

  const filteredAsistencia = useMemo(() => {
    return asistenciaData.filter((a) => a.fecha === selectedDate);
  }, [asistenciaData, selectedDate]);

  const stats = useMemo(() => {
    const presentes = filteredAsistencia.filter(a => a.estado === 'Presente').length;
    const ausentes = filteredAsistencia.filter(a => a.estado === 'Ausente').length;
    const tardes = filteredAsistencia.filter(a => a.estado === 'Tarde').length;
    const total = filteredAsistencia.length || 1;

    return {
      presentes,
      ausentes,
      tardes,
      total,
      presentesPct: (presentes / total) * 100,
      ausentesPct: (ausentes / total) * 100,
      tardesPct: (tardes / total) * 100,
    };
  }, [filteredAsistencia]);

  const chartData = useMemo(() => [
    { name: 'Presentes', value: stats.presentes, color: CHART_COLORS.presente },
    { name: 'Ausentes', value: stats.ausentes, color: CHART_COLORS.ausente },
    { name: 'Tardes', value: stats.tardes, color: CHART_COLORS.tarde },
  ].filter(item => item.value > 0), [stats]);

  const registeredCount = useMemo(() => {
    return Object.keys(asistenciaForm).length;
  }, [asistenciaForm]);

  const totalStudents = estudiantes.slice(0, 4).length;

  const handleOpenRegistro = () => {
    const initialForm: Record<string, 'Presente' | 'Ausente' | 'Tarde'> = {};
    estudiantes.slice(0, 4).forEach((est) => {
      initialForm[est.codigo] = 'Presente';
    });
    setAsistenciaForm(initialForm);
    setIsModalOpen(true);
  };

  const handleSaveAsistencia = () => {
    const newRecords = Object.entries(asistenciaForm).map(([codigo, estado]) => {
      const estudiante = estudiantes.find((e) => e.codigo === codigo);
      return {
        estudiante: estudiante?.nombre || '',
        codigo,
        materia: selectedMateria?.nombre || '',
        fecha: selectedDate,
        estado,
      };
    });

    addMultipleAsistencia(newRecords);
    setIsModalOpen(false);
  };

  const handleExportPDF = () => {
    const porcentajeAsistencia = stats.total > 0 ? (stats.presentes / stats.total) * 100 : 0;

    generatePDF({
      header: {
        title: 'Reporte de Asistencia',
        subtitle: selectedDate,
        reportType: 'Control de Asistencia',
        generatedBy: user?.name || 'Sistema',
        period: 'Período 2026-1',
      },
      kpis: [
        { label: 'Asistencia', value: `${porcentajeAsistencia.toFixed(1)}%`, color: '34,197,94' },
        { label: 'Presentes', value: stats.presentes, color: '59,130,246' },
        { label: 'Total Registros', value: stats.total, color: '168,85,247' },
      ],
      sections: [
        {
          title: 'Registro de Asistencia',
          type: 'table',
          columns: [
            { header: 'Código', dataKey: 'codigo' },
            { header: 'Estudiante', dataKey: 'estudiante' },
            { header: 'Materia', dataKey: 'materia' },
            { header: 'Estado', dataKey: 'estado' },
          ],
          data: filteredAsistencia,
        },
        {
          title: 'Resumen de Asistencia',
          type: 'statistics',
          data: [
            { label: 'Total de Registros', value: stats.total },
            { label: 'Estudiantes Presentes', value: stats.presentes },
            { label: 'Estudiantes Ausentes', value: stats.ausentes },
            { label: 'Estudiantes con Retraso', value: stats.tardes },
            { label: 'Porcentaje de Asistencia', value: `${porcentajeAsistencia.toFixed(1)}%` },
          ],
        },
      ],
      filename: `Reporte_Asistencia_${selectedDate}_${new Date().toISOString().split('T')[0]}.pdf`,
    });
  };

  const handleExportExcel = () => {
    const asistenciaStats = asistenciaData.reduce((acc, record) => {
      const existingStudent = acc.find(s => s.codigo === record.codigo);
      if (existingStudent) {
        existingStudent.totalClases += 1;
        if (record.estado === 'Presente') existingStudent.presentes += 1;
        if (record.estado === 'Ausente') existingStudent.ausentes += 1;
        if (record.estado === 'Tarde') existingStudent.tardes += 1;
      } else {
        acc.push({
          codigo: record.codigo,
          estudiante: record.estudiante,
          totalClases: 1,
          presentes: record.estado === 'Presente' ? 1 : 0,
          ausentes: record.estado === 'Ausente' ? 1 : 0,
          tardes: record.estado === 'Tarde' ? 1 : 0,
        });
      }
      return acc;
    }, [] as Array<{ codigo: string; estudiante: string; totalClases: number; presentes: number; ausentes: number; tardes: number }>);

    const asistenciaStatsWithPercentage = asistenciaStats.map(stat => ({
      ...stat,
      porcentajeAsistencia: (stat.presentes / stat.totalClases) * 100,
    }));

    generateExcel({
      filename: `Asistencia_${selectedDate}_${new Date().toISOString().split('T')[0]}.xlsx`,
      sheets: [
        {
          name: 'Asistencia Diaria',
          metadata: {
            title: `ASISTENCIA - ${selectedDate}`,
            subtitle: 'Registro Diario',
            generatedBy: user?.name || 'Sistema',
          },
          columns: [
            { header: 'Código', key: 'codigo', width: 14, type: 'text' },
            { header: 'Estudiante', key: 'estudiante', width: 25, type: 'text' },
            { header: 'Materia', key: 'materia', width: 20, type: 'text' },
            { header: 'Estado', key: 'estado', width: 15, type: 'text' },
          ],
          data: filteredAsistencia,
        },
        {
          name: 'Estadísticas',
          columns: [
            { header: 'Código', key: 'codigo', width: 14, type: 'text' },
            { header: 'Estudiante', key: 'estudiante', width: 25, type: 'text' },
            { header: 'Total Clases', key: 'totalClases', width: 15, type: 'number' },
            { header: 'Presentes', key: 'presentes', width: 15, type: 'number' },
            { header: 'Ausentes', key: 'ausentes', width: 15, type: 'number' },
            { header: 'Tardes', key: 'tardes', width: 15, type: 'number' },
            { header: '% Asistencia', key: 'porcentajeAsistencia', width: 15, type: 'percentage' },
          ],
          data: asistenciaStatsWithPercentage,
          conditionalFormatting: [attendanceConditionalFormat()],
        },
      ],
    });
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const getInitials = (nombre: string) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (estado: 'Presente' | 'Ausente' | 'Tarde') => {
    switch (estado) {
      case 'Presente': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Tarde': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Ausente': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  if (isStudent) {
    const studentAsistencia = asistenciaData.filter((a) => a.codigo === '2023001');

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">Mi Asistencia</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">95%</div>
            <div className="text-sm text-gray-400">Asistencia General</div>
          </div>
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">48</div>
            <div className="text-sm text-gray-400">Clases Asistidas</div>
          </div>
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
            <div className="text-3xl font-bold text-red-400 mb-1">3</div>
            <div className="text-sm text-gray-400">Ausencias</div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Historial de Asistencia</h2>
          <div className="space-y-3">
            {studentAsistencia.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
                <div>
                  <div className="text-white font-medium">{item.materia}</div>
                  <div className="text-sm text-gray-400">{item.fecha}</div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  item.estado === 'Presente' ? 'bg-green-500/20 text-green-400' :
                  item.estado === 'Ausente' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.estado === 'Presente' && <CheckCircle className="w-4 h-4" />}
                  {item.estado === 'Ausente' && <XCircle className="w-4 h-4" />}
                  {item.estado === 'Tarde' && <Clock className="w-4 h-4" />}
                  {item.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Control de Asistencia</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-red-600/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600/90 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {/* Selector de Materias como Cards */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">Seleccionar Materia</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MATERIAS.map((materia) => (
            <button
              key={materia.id}
              onClick={() => setSelectedMateriaId(materia.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedMateriaId === materia.id
                  ? 'border-[#3b82f6] bg-[#1e293b]'
                  : 'border-[#334155] bg-[#1e293b] hover:border-[#475569]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  selectedMateriaId === materia.id ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'bg-[#334155] text-gray-400'
                }`}>
                  {materia.icono}
                </div>
                {materia.asistenciaRegistrada && (
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    Registrada
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold mb-1">{materia.nombre}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                {materia.estudiantes} estudiantes
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard de Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta Presentes */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-white">{stats.presentes}</div>
              <div className="text-sm text-gray-400">Presentes</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{stats.presentesPct.toFixed(0)}% del total</span>
            </div>
            <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${stats.presentesPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tarjeta Ausentes */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-white">{stats.ausentes}</div>
              <div className="text-sm text-gray-400">Ausentes</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{stats.ausentesPct.toFixed(0)}% del total</span>
            </div>
            <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{ width: `${stats.ausentesPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tarjeta Tardes */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-white">{stats.tardes}</div>
              <div className="text-sm text-gray-400">Tardes</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{stats.tardesPct.toFixed(0)}% del total</span>
            </div>
            <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all"
                style={{ width: `${stats.tardesPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <h3 className="text-white font-semibold mb-6">Distribución de Asistencia</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="35%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span className="text-gray-300 text-sm">{`${value}: ${entry.payload.value}`}</span>
                )}
              />
              <text
                x="35%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-bold text-3xl"
              >
                {stats.total}
              </text>
              <text
                x="35%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-400 text-sm"
              >
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtros Activos */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400">Filtros activos:</span>
          {activeFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => removeFilter(filter)}
              className="flex items-center gap-1 px-3 py-1 bg-[#3b82f6]/20 text-[#3b82f6] rounded-lg text-sm hover:bg-[#3b82f6]/30 transition-colors"
            >
              {filter}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Registro y Tabla */}
      {canRegister && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Registro de Asistencia</h2>
            <button
              onClick={handleOpenRegistro}
              className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors font-medium"
            >
              Tomar Asistencia
            </button>
          </div>

          <div className="space-y-3">
            {filteredAsistencia.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-[#0f172a] rounded-lg border border-[#334155]"
              >
                {/* Avatar con inicial */}
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${getAvatarColor(item.estado)}`}>
                  {getInitials(item.estudiante)}
                </div>

                <div className="flex-1">
                  <div className="text-white font-medium">{item.estudiante}</div>
                  <div className="text-sm text-gray-400">{item.codigo}</div>
                </div>

                <div className="text-sm text-gray-400">{item.materia}</div>

                {/* Chip de estado */}
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  item.estado === 'Presente' ? 'bg-green-500/20 text-green-400' :
                  item.estado === 'Ausente' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.estado === 'Presente' && <CheckCircle className="w-4 h-4" />}
                  {item.estado === 'Ausente' && <XCircle className="w-4 h-4" />}
                  {item.estado === 'Tarde' && <Clock className="w-4 h-4" />}
                  {item.estado}
                </span>
              </div>
            ))}

            {filteredAsistencia.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay registros de asistencia para esta fecha
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Tomar Asistencia */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tomar Asistencia"
        size="lg"
      >
        <div className="space-y-6">
          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{registeredCount} de {totalStudents} estudiantes registrados</span>
              <span>{Math.round((registeredCount / totalStudents) * 100)}%</span>
            </div>
            <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3b82f6] rounded-full transition-all"
                style={{ width: `${(registeredCount / totalStudents) * 100}%` }}
              />
            </div>
          </div>

          {/* Lista de estudiantes */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {estudiantes.slice(0, 4).map((estudiante) => {
              const estado = asistenciaForm[estudiante.codigo] || 'Presente';

              return (
                <div
                  key={estudiante.codigo}
                  className={`rounded-xl border-2 p-5 transition-all ${
                    estado === 'Presente' ? 'bg-green-500/10 border-green-500/30' :
                    estado === 'Tarde' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="mb-4">
                    <div className="text-white font-bold text-lg">{estudiante.nombre}</div>
                    <div className="text-gray-400 text-sm">{estudiante.codigo}</div>
                  </div>

                  {/* Toggle Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setAsistenciaForm({ ...asistenciaForm, [estudiante.codigo]: 'Presente' })}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        estado === 'Presente'
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-[#0f172a] border-[#334155] text-gray-400 hover:border-green-500/50'
                      }`}
                    >
                      <CheckCircle className="w-8 h-8" />
                      <span className="text-sm font-medium">Presente</span>
                    </button>

                    <button
                      onClick={() => setAsistenciaForm({ ...asistenciaForm, [estudiante.codigo]: 'Tarde' })}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        estado === 'Tarde'
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                          : 'bg-[#0f172a] border-[#334155] text-gray-400 hover:border-yellow-500/50'
                      }`}
                    >
                      <Clock className="w-8 h-8" />
                      <span className="text-sm font-medium">Tarde</span>
                    </button>

                    <button
                      onClick={() => setAsistenciaForm({ ...asistenciaForm, [estudiante.codigo]: 'Ausente' })}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        estado === 'Ausente'
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-[#0f172a] border-[#334155] text-gray-400 hover:border-red-500/50'
                      }`}
                    >
                      <XCircle className="w-8 h-8" />
                      <span className="text-sm font-medium">Ausente</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-[#334155]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAsistencia}
              className="flex-1 px-4 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors font-medium"
            >
              Guardar Asistencia
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
