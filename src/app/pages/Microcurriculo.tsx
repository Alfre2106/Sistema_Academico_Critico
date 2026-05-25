import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { microcurriculos } from '../data/microcurriculoData';
import { FileText, Edit, Save, Eye, BookOpen } from 'lucide-react';
import jsPDF from 'jspdf';

export function Microcurriculo() {
  const { hasPermission, user } = useAuth();
  const [selectedMicrocurriculo, setSelectedMicrocurriculo] = useState(microcurriculos[0]);
  const [isEditing, setIsEditing] = useState(false);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('MICROCURRÍCULO', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(selectedMicrocurriculo.nombre, 105, 30, { align: 'center' });

    yPos = 50;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Código: ${selectedMicrocurriculo.codigo}`, 14, yPos);
    yPos += 6;
    doc.text(`Docente: ${selectedMicrocurriculo.docente}`, 14, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('DESCRIPCIÓN', 14, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const descLines = doc.splitTextToSize(selectedMicrocurriculo.descripcion, 180);
    doc.text(descLines, 14, yPos);
    yPos += descLines.length * 5 + 5;

    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('OBJETIVO GENERAL', 14, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const objLines = doc.splitTextToSize(selectedMicrocurriculo.objetivoGeneral, 180);
    doc.text(objLines, 14, yPos);
    yPos += objLines.length * 5 + 5;

    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('METODOLOGÍA', 14, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const metLines = doc.splitTextToSize(selectedMicrocurriculo.metodologia, 180);
    doc.text(metLines, 14, yPos);
    yPos += metLines.length * 5 + 5;

    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('COMPETENCIAS A DESARROLLAR', 14, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    selectedMicrocurriculo.competencias.forEach((comp, i) => {
      const compLines = doc.splitTextToSize(`${i + 1}. ${comp}`, 175);
      doc.text(compLines, 14, yPos);
      yPos += compLines.length * 5 + 2;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    yPos += 3;

    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('SISTEMA DE EVALUACIÓN', 14, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    selectedMicrocurriculo.evaluacion.forEach((ev) => {
      doc.text(`• ${ev.componente}: ${ev.porcentaje}`, 14, yPos);
      yPos += 5;
    });
    yPos += 5;

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-ES')} - Sistema Académico`,
      105,
      yPos,
      { align: 'center' }
    );

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Página ${i} de ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    doc.save(`Microcurriculo_${selectedMicrocurriculo.codigo}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const canEdit =
    hasPermission('edit_microcurriculo') ||
    (hasPermission('edit_microcurriculo_assigned') && selectedMicrocurriculo.docente === user?.name);
  const canOnlyView = hasPermission('view_microcurriculo') && !canEdit;

  const availableMicrocurriculos = user?.role === 'docente'
    ? microcurriculos.filter(m => m.docente === user.name)
    : microcurriculos;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl text-white">Plan Microcurricular</h1>
        {canEdit && !canOnlyView && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Materias
          </h2>
          <div className="space-y-2">
            {availableMicrocurriculos.map((micro) => (
              <button
                key={micro.id}
                onClick={() => {
                  setSelectedMicrocurriculo(micro);
                  setIsEditing(false);
                }}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                  selectedMicrocurriculo.id === micro.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="text-sm font-medium">{micro.nombre}</div>
                <div className="text-xs opacity-75">{micro.codigo}</div>
                {user?.role !== 'docente' && (
                  <div className="text-xs opacity-75 mt-1">{micro.docente}</div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl text-white">{availableMicrocurriculos.length}</div>
                <div className="text-xs text-gray-400">Microcurrículos</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
          <div className="mb-6 pb-4 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl text-white mb-1">{selectedMicrocurriculo.nombre}</h2>
                <p className="text-blue-400 text-sm sm:text-base">{selectedMicrocurriculo.codigo}</p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs sm:text-sm">
                    Modo Edición
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-lg text-xs sm:text-sm flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Vista Previa
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Docente: <span className="text-white">{selectedMicrocurriculo.docente}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Descripción de la Asignatura
              </label>
              <textarea
                disabled={!isEditing}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[100px] disabled:opacity-75 disabled:cursor-not-allowed resize-none"
                defaultValue={selectedMicrocurriculo.descripcion}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Objetivo General
                </label>
                <textarea
                  disabled={!isEditing}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[100px] disabled:opacity-75 disabled:cursor-not-allowed resize-none"
                  defaultValue={selectedMicrocurriculo.objetivoGeneral}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Metodología
                </label>
                <textarea
                  disabled={!isEditing}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[100px] disabled:opacity-75 disabled:cursor-not-allowed resize-none"
                  defaultValue={selectedMicrocurriculo.metodologia}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">
                Competencias a Desarrollar
              </label>
              <div className="space-y-2">
                {selectedMicrocurriculo.competencias.map((competencia, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      defaultChecked
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 disabled:opacity-75"
                    />
                    <span className="text-white text-sm">{competencia}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3">
                Sistema de Evaluación
              </label>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-sm text-gray-400 pb-3">Componente</th>
                      <th className="text-left text-sm text-gray-400 pb-3">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMicrocurriculo.evaluacion.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-3 text-white">{item.componente}</td>
                        <td className="py-3 text-gray-400">{item.porcentaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {canOnlyView && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-400">
                Tienes permisos de solo lectura para este microcurrículo.
              </p>
            </div>
          )}

          {user?.role === 'docente' && !canEdit && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400">
                Solo puedes editar los microcurrículos de las materias que impartes.
              </p>
            </div>
          )}

          {user?.role === 'admin' && (
            <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-white mb-3">Herramientas de Administración</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => alert('Microcurrículo aprobado exitosamente')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  Aprobar Microcurrículo
                </button>
                <button
                  onClick={() => alert('Solicitud de revisión enviada al docente')}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
                >
                  Solicitar Revisión
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  Exportar PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
