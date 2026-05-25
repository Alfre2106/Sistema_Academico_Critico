import { useState, useMemo } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, FileText, Users, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { generatePDF } from '../utils/pdfGenerator';
import { generateExcel, gradeConditionalFormat, attendanceConditionalFormat } from '../utils/excelGenerator';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Reportes() {
  const { user } = useAuth();
  const { getEstadisticas, calificaciones, asistencia, estudiantes, cargaAcademica } = useData();
  const [reportType, setReportType] = useState<'academico' | 'asistencia' | 'general'>('general');

  const stats = useMemo(() => getEstadisticas(), [getEstadisticas]);

  const gradeDistribution = useMemo(() => {
    const ranges = [
      { name: '4.5 - 5.0', min: 4.5, max: 5.0, color: '#22C55E', count: 0 },
      { name: '4.0 - 4.4', min: 4.0, max: 4.5, color: '#3B82F6', count: 0 },
      { name: '3.5 - 3.9', min: 3.5, max: 4.0, color: '#F59E0B', count: 0 },
      { name: '3.0 - 3.4', min: 3.0, max: 3.5, color: '#FB923C', count: 0 },
      { name: '0.0 - 2.9', min: 0, max: 3.0, color: '#EF4444', count: 0 },
    ];

    calificaciones.forEach(cal => {
      const range = ranges.find(r => cal.final >= r.min && cal.final < r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [calificaciones]);

  const attendanceTrend = useMemo(() => {
    const grouped = asistencia.reduce((acc, record) => {
      if (!acc[record.fecha]) {
        acc[record.fecha] = { fecha: record.fecha, presentes: 0, total: 0 };
      }
      acc[record.fecha].total += 1;
      if (record.estado === 'Presente') acc[record.fecha].presentes += 1;
      return acc;
    }, {} as Record<string, { fecha: string; presentes: number; total: number }>);

    return Object.values(grouped)
      .map(item => ({
        fecha: item.fecha,
        porcentaje: (item.presentes / item.total) * 100
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .slice(-7);
  }, [asistencia]);

  const handleExportGeneralPDF = () => {
    generatePDF({
      header: {
        title: 'Reporte General Institucional',
        subtitle: 'Estadísticas y Análisis Académico',
        reportType: 'Reporte General',
        generatedBy: user?.name || 'Sistema',
        period: 'Período 2026-1',
      },
      kpis: [
        { label: 'Promedio Institucional', value: stats.promedioInstitucional.toFixed(2), color: '59,130,246' },
        { label: 'Asistencia General', value: `${stats.porcentajeAsistencia.toFixed(1)}%`, color: '34,197,94' },
        { label: 'Cursos Activos', value: stats.cursosActivos, color: '168,85,247' },
        { label: 'Total Estudiantes', value: stats.totalEstudiantes, color: '249,115,22' },
        { label: 'Total Docentes', value: stats.totalDocentes, color: '236,72,153' },
        { label: 'Total Facultades', value: stats.totalFacultades, color: '14,165,233' },
      ],
      sections: [
        {
          title: 'Estadísticas Institucionales',
          type: 'statistics',
          data: [
            { label: 'Promedio Institucional', value: stats.promedioInstitucional.toFixed(2) },
            { label: 'Porcentaje de Asistencia', value: `${stats.porcentajeAsistencia.toFixed(1)}%` },
            { label: 'Cursos Activos', value: stats.cursosActivos },
            { label: 'Total de Estudiantes', value: stats.totalEstudiantes },
            { label: 'Total de Docentes', value: stats.totalDocentes },
            { label: 'Total de Programas', value: stats.totalProgramas },
            { label: 'Total de Facultades', value: stats.totalFacultades },
          ],
        },
        {
          title: 'Distribución de Calificaciones',
          type: 'text',
          data: `La distribución de calificaciones muestra que ${gradeDistribution[0].count} estudiantes obtuvieron calificaciones excelentes (4.5-5.0), ${gradeDistribution[1].count} buenas (4.0-4.4), ${gradeDistribution[2].count} aceptables (3.5-3.9), ${gradeDistribution[3].count} básicas (3.0-3.4) y ${gradeDistribution[4].count} insuficientes (<3.0).`,
        },
      ],
      filename: `Reporte_General_${new Date().toISOString().split('T')[0]}.pdf`,
    });
  };

  const handleExportExcel = () => {
    generateExcel({
      filename: `Reportes_Institucionales_${new Date().toISOString().split('T')[0]}.xlsx`,
      sheets: [
        {
          name: 'Estadísticas',
          metadata: {
            title: 'ESTADÍSTICAS INSTITUCIONALES',
            subtitle: 'Período 2026-1',
            generatedBy: user?.name || 'Sistema',
          },
          columns: [
            { header: 'Indicador', key: 'indicador', width: 30, type: 'text' },
            { header: 'Valor', key: 'valor', width: 20, type: 'text' },
          ],
          data: [
            { indicador: 'Promedio Institucional', valor: stats.promedioInstitucional.toFixed(2) },
            { indicador: 'Porcentaje de Asistencia', valor: `${stats.porcentajeAsistencia.toFixed(1)}%` },
            { indicador: 'Cursos Activos', valor: stats.cursosActivos },
            { indicador: 'Total Estudiantes', valor: stats.totalEstudiantes },
            { indicador: 'Total Docentes', valor: stats.totalDocentes },
            { indicador: 'Total Programas', valor: stats.totalProgramas },
            { indicador: 'Total Facultades', valor: stats.totalFacultades },
          ],
        },
        {
          name: 'Distribución Calificaciones',
          columns: [
            { header: 'Rango', key: 'name', width: 20, type: 'text' },
            { header: 'Cantidad Estudiantes', key: 'count', width: 20, type: 'number' },
          ],
          data: gradeDistribution,
        },
      ],
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl text-white">Reportes y Estadísticas</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportGeneralPDF}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl text-white">{stats.promedioInstitucional.toFixed(2)}</div>
              <div className="text-sm text-gray-400">Promedio Institucional</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl text-white">{stats.porcentajeAsistencia.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Asistencia General</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl text-white">{stats.cursosActivos}</div>
              <div className="text-sm text-gray-400">Cursos Activos</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Users className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl text-white">{stats.totalEstudiantes}</div>
              <div className="text-sm text-gray-400">Total Estudiantes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-white mb-4">Distribución de Calificaciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="count" name="Estudiantes">
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-white mb-4">Tendencia de Asistencia (Últimos 7 Días)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="fecha" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="porcentaje" stroke="#3B82F6" strokeWidth={2} name="% Asistencia" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Tipos de Reportes Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setReportType('asistencia')}
            className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors"
          >
            <h3 className="text-white mb-1">Reporte de Asistencia</h3>
            <p className="text-sm text-gray-400">Por programa, facultad o periodo</p>
          </button>
          <button
            onClick={() => setReportType('academico')}
            className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors"
          >
            <h3 className="text-white mb-1">Reporte Académico</h3>
            <p className="text-sm text-gray-400">Notas y rendimiento estudiantil</p>
          </button>
          <button className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors">
            <h3 className="text-white mb-1">Reporte de Docentes</h3>
            <p className="text-sm text-gray-400">Carga académica y evaluación</p>
          </button>
          <button className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors">
            <h3 className="text-white mb-1">Reporte por Programa</h3>
            <p className="text-sm text-gray-400">Análisis por carrera</p>
          </button>
        </div>
      </div>
    </div>
  );
}
