import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Award, Edit, Save, Download, FileText } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { generateExcel, gradeConditionalFormat } from '../utils/excelGenerator';

export function Calificaciones() {
  const { user } = useAuth();
  const { calificaciones, updateCalificaciones } = useData();
  const [selectedMateria, setSelectedMateria] = useState('Base de Datos');
  const [isEditing, setIsEditing] = useState(false);
  const [localCalificaciones, setLocalCalificaciones] = useState(calificaciones);

  const filteredCalificaciones = useMemo(() => {
    return localCalificaciones.filter(c => c.materia === selectedMateria);
  }, [localCalificaciones, selectedMateria]);

  useEffect(() => {
    setLocalCalificaciones(calificaciones);
  }, [calificaciones]);

  const calcularNotaFinal = (parcial1: number, parcial2: number, proyecto: number, talleres: number): number => {
    return (parcial1 * 0.2) + (parcial2 * 0.2) + (proyecto * 0.3) + (talleres * 0.3);
  };

  const handleNotaChange = (id: number, campo: string, valor: number) => {
    setLocalCalificaciones(localCalificaciones.map(cal => {
      if (cal.id === id) {
        const updated = { ...cal, [campo]: valor };
        updated.final = calcularNotaFinal(updated.parcial1, updated.parcial2, updated.proyecto, updated.talleres);
        return updated;
      }
      return cal;
    }));
  };

  const handleSave = () => {
    updateCalificaciones(localCalificaciones);
    setIsEditing(false);
    alert('Calificaciones guardadas exitosamente');
  };

  const handleExportExcel = () => {
    const promedioGeneral = filteredCalificaciones.reduce((acc, c) => acc + c.final, 0) / filteredCalificaciones.length;
    const notaMasAlta = Math.max(...filteredCalificaciones.map(c => c.final));
    const notaMasBaja = Math.min(...filteredCalificaciones.map(c => c.final));
    const aprobados = filteredCalificaciones.filter(c => c.final >= 3.0).length;

    generateExcel({
      filename: `Calificaciones_${selectedMateria.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`,
      sheets: [
        {
          name: 'Calificaciones',
          metadata: {
            title: `CALIFICACIONES - ${selectedMateria}`,
            subtitle: `Período Académico 2026-1`,
            generatedBy: user?.name || 'Sistema',
          },
          columns: [
            { header: 'Código', key: 'codigo', width: 14, type: 'text' },
            { header: 'Estudiante', key: 'estudiante', width: 25, type: 'text' },
            { header: 'Parcial 1 (20%)', key: 'parcial1', width: 17, type: 'number' },
            { header: 'Parcial 2 (20%)', key: 'parcial2', width: 17, type: 'number' },
            { header: 'Proyecto (30%)', key: 'proyecto', width: 17, type: 'number' },
            { header: 'Talleres (30%)', key: 'talleres', width: 17, type: 'number' },
            { header: 'Final', key: 'final', width: 12, type: 'number' },
          ],
          data: filteredCalificaciones,
          includeStatistics: false,
          conditionalFormatting: [gradeConditionalFormat()],
        },
        {
          name: 'Estadísticas',
          columns: [
            { header: 'Indicador', key: 'indicador', width: 30, type: 'text' },
            { header: 'Valor', key: 'valor', width: 20, type: 'text' },
          ],
          data: [
            { indicador: 'Promedio General', valor: promedioGeneral.toFixed(2) },
            { indicador: 'Nota Más Alta', valor: notaMasAlta.toFixed(2) },
            { indicador: 'Nota Más Baja', valor: notaMasBaja.toFixed(2) },
            { indicador: 'Estudiantes Aprobados', valor: `${aprobados} de ${filteredCalificaciones.length}` },
            { indicador: 'Porcentaje de Aprobación', valor: `${((aprobados / filteredCalificaciones.length) * 100).toFixed(1)}%` },
          ],
        },
      ],
    });
  };

  const handleExportPDF = () => {
    const promedioGeneral = filteredCalificaciones.reduce((acc, c) => acc + c.final, 0) / filteredCalificaciones.length;
    const notaMasAlta = Math.max(...filteredCalificaciones.map(c => c.final));
    const notaMasBaja = Math.min(...filteredCalificaciones.map(c => c.final));
    const aprobados = filteredCalificaciones.filter(c => c.final >= 3.0).length;

    generatePDF({
      header: {
        title: 'Reporte de Calificaciones',
        subtitle: selectedMateria,
        reportType: 'Calificaciones Académicas',
        generatedBy: user?.name || 'Sistema',
        period: 'Período 2026-1',
      },
      kpis: [
        { label: 'Promedio General', value: promedioGeneral.toFixed(2), color: '59,130,246' },
        { label: 'Aprobación', value: `${((aprobados / filteredCalificaciones.length) * 100).toFixed(0)}%`, color: '34,197,94' },
        { label: 'Total Estudiantes', value: filteredCalificaciones.length, color: '168,85,247' },
      ],
      sections: [
        {
          title: 'Calificaciones por Estudiante',
          type: 'table',
          columns: [
            { header: 'Código', dataKey: 'codigo' },
            { header: 'Estudiante', dataKey: 'estudiante' },
            { header: 'P1 (20%)', dataKey: 'parcial1' },
            { header: 'P2 (20%)', dataKey: 'parcial2' },
            { header: 'Proyecto (30%)', dataKey: 'proyecto' },
            { header: 'Talleres (30%)', dataKey: 'talleres' },
            { header: 'Final', dataKey: 'final' },
          ],
          data: filteredCalificaciones.map(c => ({
            codigo: c.codigo,
            estudiante: c.estudiante,
            parcial1: c.parcial1.toFixed(1),
            parcial2: c.parcial2.toFixed(1),
            proyecto: c.proyecto.toFixed(1),
            talleres: c.talleres.toFixed(1),
            final: c.final.toFixed(2),
          })),
        },
        {
          title: 'Estadísticas del Curso',
          type: 'statistics',
          data: [
            { label: 'Promedio General', value: promedioGeneral.toFixed(2) },
            { label: 'Nota Más Alta', value: notaMasAlta.toFixed(2) },
            { label: 'Nota Más Baja', value: notaMasBaja.toFixed(2) },
            { label: 'Aprobados', value: `${aprobados} de ${filteredCalificaciones.length}` },
            { label: 'Porcentaje Aprobación', value: `${((aprobados / filteredCalificaciones.length) * 100).toFixed(1)}%` },
          ],
        },
      ],
      filename: `Reporte_Calificaciones_${selectedMateria.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
    });
  };

  const getColorForGrade = (grade: number): string => {
    if (grade >= 4.5) return 'text-green-400';
    if (grade >= 4.0) return 'text-blue-400';
    if (grade >= 3.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const promedioGeneral = filteredCalificaciones.length > 0
    ? filteredCalificaciones.reduce((acc, c) => acc + c.final, 0) / filteredCalificaciones.length
    : 0;
  const notaMasAlta = filteredCalificaciones.length > 0 ? Math.max(...filteredCalificaciones.map(c => c.final)) : 0;
  const notaMasBaja = filteredCalificaciones.length > 0 ? Math.min(...filteredCalificaciones.map(c => c.final)) : 0;
  const aprobados = filteredCalificaciones.filter(c => c.final >= 3.0).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Calificaciones
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportPDF}
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
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Guardar
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Editar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Materia</label>
          <select
            value={selectedMateria}
            onChange={(e) => setSelectedMateria(e.target.value)}
            className="w-full sm:w-auto bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option>Base de Datos</option>
            <option>Programación Avanzada</option>
            <option>Algoritmos</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3 px-2">Código</th>
                <th className="text-left text-sm text-gray-400 pb-3 px-2">Estudiante</th>
                <th className="text-center text-sm text-gray-400 pb-3 px-2">Parcial 1<br/><span className="text-xs">(20%)</span></th>
                <th className="text-center text-sm text-gray-400 pb-3 px-2">Parcial 2<br/><span className="text-xs">(20%)</span></th>
                <th className="text-center text-sm text-gray-400 pb-3 px-2">Proyecto<br/><span className="text-xs">(30%)</span></th>
                <th className="text-center text-sm text-gray-400 pb-3 px-2">Talleres<br/><span className="text-xs">(20%)</span></th>
                <th className="text-center text-sm text-gray-400 pb-3 px-2">Final</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalificaciones.map((cal) => (
                <tr key={cal.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 px-2 text-blue-400 text-sm">{cal.codigo}</td>
                  <td className="py-4 px-2 text-white">{cal.estudiante}</td>
                  <td className="py-4 px-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={cal.parcial1}
                        onChange={(e) => handleNotaChange(cal.id, 'parcial1', parseFloat(e.target.value) || 0)}
                        className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className={getColorForGrade(cal.parcial1)}>{cal.parcial1.toFixed(1)}</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={cal.parcial2}
                        onChange={(e) => handleNotaChange(cal.id, 'parcial2', parseFloat(e.target.value) || 0)}
                        className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className={getColorForGrade(cal.parcial2)}>{cal.parcial2.toFixed(1)}</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={cal.proyecto}
                        onChange={(e) => handleNotaChange(cal.id, 'proyecto', parseFloat(e.target.value) || 0)}
                        className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className={getColorForGrade(cal.proyecto)}>{cal.proyecto.toFixed(1)}</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={cal.talleres}
                        onChange={(e) => handleNotaChange(cal.id, 'talleres', parseFloat(e.target.value) || 0)}
                        className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className={getColorForGrade(cal.talleres)}>{cal.talleres.toFixed(1)}</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={`font-medium ${getColorForGrade(cal.final)}`}>
                      {cal.final.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h3 className="text-white mb-3 text-sm">Estadísticas del Curso</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Promedio General</div>
              <div className="text-white text-lg">{promedioGeneral.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-400">Aprobados</div>
              <div className="text-green-400 text-lg">
                {filteredCalificaciones.length > 0 ? ((aprobados / filteredCalificaciones.length) * 100).toFixed(0) : 0}%
              </div>
            </div>
            <div>
              <div className="text-gray-400">Nota Más Alta</div>
              <div className="text-blue-400 text-lg">{notaMasAlta.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-400">Nota Más Baja</div>
              <div className="text-yellow-400 text-lg">{notaMasBaja.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
