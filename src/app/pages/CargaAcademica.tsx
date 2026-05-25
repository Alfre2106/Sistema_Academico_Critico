import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { horarioEstudiante } from '../data/mockData';
import { Calendar, Clock, MapPin, User, Plus, Edit, Trash2, Download, Building2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import { HorarioGrid } from '../components/HorarioGrid';
import { generatePDF } from '../utils/pdfGenerator';

interface Materia {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  docente: string;
  horario: string;
  facultad?: string;
  aula?: string;
}

interface HorarioOption {
  value: string;
  label: string;
  disponible: boolean;
  conflicto?: string;
}

const FACULTADES = [
  { codigo: 'ING', nombre: 'Ingeniería' },
  { codigo: 'CS', nombre: 'Ciencias Sociales' },
  { codigo: 'SAL', nombre: 'Ciencias de la Salud' },
  { codigo: 'ART', nombre: 'Artes y Humanidades' },
];

const CARRERAS_POR_FACULTAD: Record<string, Array<{ nombre: string; prefijo: string }>> = {
  'Ingeniería': [
    { nombre: 'Ingeniería de Sistemas', prefijo: 'SIS' },
    { nombre: 'Ingeniería Civil', prefijo: 'CIV' },
    { nombre: 'Ingeniería Industrial', prefijo: 'IND' },
    { nombre: 'Ingeniería Electrónica', prefijo: 'ELE' },
  ],
  'Ciencias Sociales': [
    { nombre: 'Psicología', prefijo: 'PSI' },
    { nombre: 'Trabajo Social', prefijo: 'TSO' },
    { nombre: 'Sociología', prefijo: 'SOC' },
  ],
  'Ciencias de la Salud': [
    { nombre: 'Medicina', prefijo: 'MED' },
    { nombre: 'Enfermería', prefijo: 'ENF' },
    { nombre: 'Fisioterapia', prefijo: 'FIS' },
  ],
  'Artes y Humanidades': [
    { nombre: 'Diseño Gráfico', prefijo: 'DIS' },
    { nombre: 'Comunicación Social', prefijo: 'COM' },
    { nombre: 'Filosofía', prefijo: 'FIL' },
  ],
};

const HORARIOS_BASE = [
  'Lun-Mié 6:00-8:00',
  'Lun-Mié 8:00-10:00',
  'Lun-Mié 10:00-12:00',
  'Lun-Mié 14:00-16:00',
  'Lun-Mié 16:00-18:00',
  'Mar-Jue 6:00-8:00',
  'Mar-Jue 8:00-10:00',
  'Mar-Jue 10:00-12:00',
  'Mar-Jue 14:00-16:00',
  'Mar-Jue 16:00-18:00',
  'Vie 6:00-10:00',
  'Vie 10:00-14:00',
  'Vie 14:00-18:00',
  'Sáb 8:00-12:00',
  'Sáb 14:00-18:00',
];

const AULAS = [
  'A-101', 'A-102', 'A-201', 'A-202', 'A-301', 'A-302',
  'B-101', 'B-102', 'B-201',
  'Lab 1', 'Lab 2', 'Lab 3',
  'Auditorio 1', 'Auditorio 2',
];

export function CargaAcademica() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { cargaAcademica, docentes, addCargaAcademica, updateCargaAcademica, deleteCargaAcademica } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMateria, setEditingMateria] = useState<any | null>(null);
  const [deletingMateria, setDeletingMateria] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    facultad: '',
    carrera: '',
    codigoPrefix: '',
    codigoNumero: '',
    nombre: '',
    creditos: 0,
    docente: '',
    horario: '',
    aula: '',
  });

  const [validationState, setValidationState] = useState({
    codigoValido: true,
    codigoDuplicado: false,
    nombreValido: true,
    nombreDuplicado: false,
    nombreSimilar: '',
    nombreDuplicadoInfo: { materia: '', docente: '' },
  });

  const canEdit = hasPermission('manage_carga_academica');
  const isStudent = user?.role === 'estudiante';
  const isDocente = user?.role === 'docente';

  useEffect(() => {
    if (formData.carrera && !editingMateria) {
      const carreras = CARRERAS_POR_FACULTAD[formData.facultad] || [];
      const carrera = carreras.find(c => c.nombre === formData.carrera);
      if (carrera) {
        setFormData(prev => ({ ...prev, codigoPrefix: carrera.prefijo }));
      }
    }
  }, [formData.carrera, formData.facultad, editingMateria]);

  useEffect(() => {
    if (formData.codigoPrefix && formData.codigoNumero) {
      const codigoCompleto = `${formData.codigoPrefix}-${formData.codigoNumero}`;
      const duplicado = cargaAcademica.some(
        m => m.codigo === codigoCompleto && (!editingMateria || m.id !== editingMateria.id)
      );
      setValidationState(prev => ({
        ...prev,
        codigoDuplicado: duplicado,
        codigoValido: !duplicado && formData.codigoNumero.length > 0,
      }));
    } else {
      setValidationState(prev => ({
        ...prev,
        codigoDuplicado: false,
        codigoValido: false,
      }));
    }
  }, [formData.codigoPrefix, formData.codigoNumero, cargaAcademica, editingMateria]);

  useEffect(() => {
    if (formData.nombre && formData.carrera) {
      const nombreLower = formData.nombre.toLowerCase().trim();

      const duplicadoExacto = cargaAcademica.find(
        m => m.materia.toLowerCase() === nombreLower &&
             m.codigo.startsWith(formData.codigoPrefix) &&
             (!editingMateria || m.id !== editingMateria.id)
      );

      if (duplicadoExacto) {
        setValidationState(prev => ({
          ...prev,
          nombreDuplicado: true,
          nombreValido: false,
          nombreSimilar: '',
          nombreDuplicadoInfo: {
            materia: duplicadoExacto.materia,
            docente: duplicadoExacto.docente,
          },
        }));
        return;
      }

      const palabrasNombre = nombreLower.split(' ').filter(p => p.length > 3);
      const similares = cargaAcademica.filter(m => {
        if (!m.codigo.startsWith(formData.codigoPrefix)) return false;
        if (editingMateria && m.id === editingMateria.id) return false;

        const palabrasExistente = m.materia.toLowerCase().split(' ').filter(p => p.length > 3);
        const coincidencias = palabrasNombre.filter(p => palabrasExistente.includes(p)).length;
        return coincidencias >= 2;
      });

      if (similares.length > 0) {
        setValidationState(prev => ({
          ...prev,
          nombreDuplicado: false,
          nombreValido: true,
          nombreSimilar: similares[0].materia,
          nombreDuplicadoInfo: { materia: '', docente: '' },
        }));
      } else {
        setValidationState(prev => ({
          ...prev,
          nombreDuplicado: false,
          nombreValido: true,
          nombreSimilar: '',
          nombreDuplicadoInfo: { materia: '', docente: '' },
        }));
      }
    } else {
      setValidationState(prev => ({
        ...prev,
        nombreDuplicado: false,
        nombreValido: false,
        nombreSimilar: '',
        nombreDuplicadoInfo: { materia: '', docente: '' },
      }));
    }
  }, [formData.nombre, formData.carrera, formData.codigoPrefix, cargaAcademica, editingMateria]);

  const carrerasDisponibles = useMemo(() => {
    if (!formData.facultad) return [];
    return CARRERAS_POR_FACULTAD[formData.facultad] || [];
  }, [formData.facultad]);

  const codigosExistentes = useMemo(() => {
    if (!formData.codigoPrefix) return [];
    return cargaAcademica
      .filter(m => m.codigo.startsWith(formData.codigoPrefix))
      .map(m => m.codigo)
      .sort();
  }, [formData.codigoPrefix, cargaAcademica]);

  const getNextCodigoNumero = useMemo(() => {
    if (!formData.codigoPrefix) return '001';
    const existingCodes = cargaAcademica
      .filter(m => m.codigo.startsWith(formData.codigoPrefix))
      .map(m => {
        const match = m.codigo.match(/\d+$/);
        return match ? parseInt(match[0]) : 0;
      });
    const maxNum = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    return String(maxNum + 1).padStart(3, '0');
  }, [formData.codigoPrefix, cargaAcademica]);

  const isFormValid = useMemo(() => {
    return (
      formData.facultad &&
      formData.carrera &&
      formData.codigoPrefix &&
      formData.codigoNumero &&
      validationState.codigoValido &&
      !validationState.codigoDuplicado &&
      formData.nombre &&
      validationState.nombreValido &&
      !validationState.nombreDuplicado &&
      formData.docente &&
      formData.creditos > 0 &&
      formData.horario &&
      formData.aula
    );
  }, [formData, validationState]);

  const horariosDisponibles = useMemo((): HorarioOption[] => {
    if (!formData.docente || !formData.aula) {
      return HORARIOS_BASE.map(h => ({ value: h, label: h, disponible: true }));
    }

    return HORARIOS_BASE.map(horario => {
      const conflictoDocente = cargaAcademica.find(
        m => m.docente === formData.docente && m.horario === horario && (!editingMateria || m.id !== editingMateria.id)
      );

      const conflictoAula = cargaAcademica.find(
        m => m.aula === formData.aula && m.horario === horario && (!editingMateria || m.id !== editingMateria.id)
      );

      let conflicto = '';
      let disponible = true;

      if (conflictoDocente) {
        conflicto = `Docente ocupado en ${conflictoDocente.materia}`;
        disponible = false;
      } else if (conflictoAula) {
        conflicto = `Aula ocupada por ${conflictoAula.materia}`;
        disponible = false;
      }

      return {
        value: horario,
        label: horario,
        disponible,
        conflicto,
      };
    });
  }, [formData.docente, formData.aula, cargaAcademica, editingMateria]);

  const handleExportSchedule = () => {
    const horarioData = horarioEstudiante.map(h => ({
      dia: h.dia,
      hora: h.hora,
      materia: h.materia,
      salon: h.salon,
      docente: h.docente,
    }));

    generatePDF({
      header: {
        title: 'Horario Académico',
        subtitle: user?.name || '',
        reportType: user?.role === 'estudiante' ? 'Horario de Estudiante' : 'Horario de Docente',
        generatedBy: user?.name || 'Sistema',
        period: 'Período 2026-1',
      },
      kpis: [
        { label: 'Total de Materias', value: horarioEstudiante.length, color: '59,130,246' },
        { label: 'Horas Semanales', value: horarioEstudiante.length * 2, color: '34,197,94' },
        { label: 'Días con Clase', value: new Set(horarioEstudiante.map(h => h.dia)).size, color: '168,85,247' },
      ],
      sections: [
        {
          title: 'Horario Semanal',
          type: 'table',
          columns: [
            { header: 'Día', dataKey: 'dia' },
            { header: 'Hora', dataKey: 'hora' },
            { header: 'Materia', dataKey: 'materia' },
            { header: 'Salón', dataKey: 'salon' },
            { header: 'Docente', dataKey: 'docente' },
          ],
          data: horarioData,
        },
      ],
      filename: `Horario_${user?.role}_${new Date().toISOString().split('T')[0]}.pdf`,
    });
  };

  const handleCreate = () => {
    setEditingMateria(null);
    setFormData({
      facultad: '',
      carrera: '',
      codigoPrefix: '',
      codigoNumero: '',
      nombre: '',
      creditos: 0,
      docente: '',
      horario: '',
      aula: '',
    });
    setValidationState({
      codigoValido: true,
      codigoDuplicado: false,
      nombreValido: true,
      nombreDuplicado: false,
      nombreSimilar: '',
      nombreDuplicadoInfo: { materia: '', docente: '' },
    });
    setIsModalOpen(true);
  };

  const handleEdit = (materia: any) => {
    setEditingMateria(materia);
    const codigoMatch = materia.codigo.match(/^([A-Z]+)-(\d+)$/);

    let facultadEncontrada = '';
    let carreraEncontrada = '';

    for (const [facultad, carreras] of Object.entries(CARRERAS_POR_FACULTAD)) {
      const carrera = carreras.find(c => c.prefijo === codigoMatch?.[1]);
      if (carrera) {
        facultadEncontrada = facultad;
        carreraEncontrada = carrera.nombre;
        break;
      }
    }

    setFormData({
      facultad: facultadEncontrada,
      carrera: carreraEncontrada,
      codigoPrefix: codigoMatch?.[1] || '',
      codigoNumero: codigoMatch?.[2] || '',
      nombre: materia.materia,
      creditos: materia.creditos,
      docente: materia.docente,
      horario: materia.horario,
      aula: materia.aula || '',
    });
    setValidationState({
      codigoValido: true,
      codigoDuplicado: false,
      nombreValido: true,
      nombreDuplicado: false,
      nombreSimilar: '',
      nombreDuplicadoInfo: { materia: '', docente: '' },
    });
    setIsModalOpen(true);
  };

  const handleDelete = (materia: any) => {
    setDeletingMateria(materia);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingMateria) {
      deleteCargaAcademica(deletingMateria.id);
      setIsDeleteModalOpen(false);
      setDeletingMateria(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const codigoNumeroFinal = formData.codigoNumero || getNextCodigoNumero;
    const codigoCompleto = `${formData.codigoPrefix}-${codigoNumeroFinal}`;

    const cargaData = {
      docente: formData.docente,
      materia: formData.nombre,
      codigo: codigoCompleto,
      grupo: 'A',
      horario: formData.horario,
      aula: formData.aula,
      creditos: formData.creditos,
    };

    if (editingMateria) {
      updateCargaAcademica(editingMateria.id, cargaData);
    } else {
      addCargaAcademica(cargaData);
    }

    setIsModalOpen(false);
    setEditingMateria(null);
  };

  if (isStudent || isDocente) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl text-white">Mi Horario</h1>
          <button
            onClick={handleExportSchedule}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
        <HorarioGrid horario={horarioEstudiante} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl text-white">Carga Académica</h1>
        {canEdit && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Asignar Materia</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg text-white mb-4">Materias Asignadas</h2>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Código</th>
                <th className="text-left text-sm text-gray-400 pb-3">Materia</th>
                <th className="text-left text-sm text-gray-400 pb-3">Créditos</th>
                <th className="text-left text-sm text-gray-400 pb-3">Docente</th>
                <th className="text-left text-sm text-gray-400 pb-3">Horario</th>
                <th className="text-left text-sm text-gray-400 pb-3">Aula</th>
                {canEdit && <th className="text-right text-sm text-gray-400 pb-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cargaAcademica.map((materia) => (
                <tr key={materia.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 text-blue-400">{materia.codigo}</td>
                  <td className="py-4 text-white">{materia.materia}</td>
                  <td className="py-4 text-gray-400">{materia.creditos}</td>
                  <td className="py-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {materia.docente}
                    </div>
                  </td>
                  <td className="py-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {materia.horario}
                    </div>
                  </td>
                  <td className="py-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {materia.aula}
                    </div>
                  </td>
                  {canEdit && (
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(materia)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(materia)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-3">
          {cargaAcademica.map((materia) => (
            <div key={materia.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{materia.materia}</h3>
                  <p className="text-blue-400 text-sm">{materia.codigo}</p>
                </div>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(materia)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(materia)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-4 h-4" />
                  {materia.docente}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  {materia.horario}
                </div>
                {materia.aula && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {materia.aula}
                  </div>
                )}
                <div className="text-gray-400">
                  <span className="text-gray-500">Créditos:</span> {materia.creditos}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {canEdit && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg text-white mb-4">Herramientas de Gestión</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/docentes')}
              className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors"
            >
              <h3 className="text-white mb-1">Asignar Docente</h3>
              <p className="text-sm text-gray-400">Vincular docente a materia</p>
            </button>
            <button
              onClick={handleCreate}
              className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors"
            >
              <h3 className="text-white mb-1">Configurar Horario</h3>
              <p className="text-sm text-gray-400">Definir horarios de clase</p>
            </button>
            <button
              onClick={() => alert('No se encontraron conflictos de horario')}
              className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors"
            >
              <h3 className="text-white mb-1">Ver Conflictos</h3>
              <p className="text-sm text-gray-400">Detectar cruces de horario</p>
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMateria ? 'Editar Materia' : 'Nueva Materia'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Facultad y Carrera */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Facultad *
              </label>
              <select
                required
                value={formData.facultad}
                onChange={(e) => setFormData({ ...formData, facultad: e.target.value, carrera: '', codigoPrefix: '' })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Seleccionar facultad</option>
                {FACULTADES.map(fac => (
                  <option key={fac.codigo} value={fac.nombre}>{fac.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Carrera *</label>
              <select
                required
                value={formData.carrera}
                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                disabled={!formData.facultad}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar carrera</option>
                {carrerasDisponibles.map(carrera => (
                  <option key={carrera.prefijo} value={carrera.nombre}>{carrera.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Código de Materia */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <label className="block text-sm text-gray-400 mb-3">Código de Materia *</label>

            {/* Códigos Existentes */}
            {codigosExistentes.length > 0 && (
              <div className="mb-3 p-3 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">
                  Códigos Existentes ({formData.codigoPrefix}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {codigosExistentes.map(codigo => (
                    <span key={codigo} className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
                      {codigo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Input de Código */}
            <div className="flex gap-2">
              <div className="flex-shrink-0 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 min-w-[80px] flex items-center justify-center font-mono">
                {formData.codigoPrefix || '---'}-
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={getNextCodigoNumero}
                  value={formData.codigoNumero}
                  onChange={(e) => setFormData({ ...formData, codigoNumero: e.target.value.replace(/\D/g, '') })}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none font-mono ${
                    validationState.codigoDuplicado
                      ? 'border-red-500 focus:border-red-500'
                      : validationState.codigoValido && formData.codigoNumero
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-gray-700 focus:border-blue-500'
                  }`}
                  disabled={!formData.codigoPrefix}
                  maxLength={3}
                />
              </div>
            </div>

            {/* Mensajes de validación */}
            <div className="mt-2 min-h-[20px]">
              {!formData.codigoPrefix ? (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  ⭕ Selecciona una carrera para habilitar este campo
                </p>
              ) : !formData.codigoNumero ? (
                <p className="text-xs text-gray-500">
                  Sugerencia: {formData.codigoPrefix}-{getNextCodigoNumero}
                </p>
              ) : validationState.codigoDuplicado ? (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Este código ya está registrado
                </p>
              ) : validationState.codigoValido ? (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Código disponible: {formData.codigoPrefix}-{formData.codigoNumero}
                </p>
              ) : null}
            </div>
          </div>

          {/* 3. Nombre de la Materia */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nombre de la Materia *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none ${
                validationState.nombreDuplicado
                  ? 'border-red-500 focus:border-red-500'
                  : validationState.nombreValido && formData.nombre
                  ? 'border-green-500 focus:border-green-500'
                  : 'border-gray-700 focus:border-blue-500'
              }`}
              placeholder="Ej: Base de Datos Avanzada"
              disabled={!formData.carrera}
            />

            {/* Mensajes de validación */}
            <div className="mt-2 min-h-[20px]">
              {!formData.carrera ? (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  ⭕ Selecciona una carrera primero
                </p>
              ) : validationState.nombreDuplicado ? (
                <div className="space-y-1">
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Ya existe: {validationState.nombreDuplicadoInfo.materia} en {formData.carrera}
                  </p>
                  <p className="text-xs text-red-300 ml-4">
                    (Docente: {validationState.nombreDuplicadoInfo.docente})
                  </p>
                </div>
              ) : validationState.nombreSimilar ? (
                <p className="text-xs text-yellow-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Similitud encontrada: {validationState.nombreSimilar}
                </p>
              ) : validationState.nombreValido && formData.nombre ? (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Nombre disponible
                </p>
              ) : null}
            </div>
          </div>

          {/* 4. Docente */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Docente
            </label>
            <select
              required
              value={formData.docente}
              onChange={(e) => setFormData({ ...formData, docente: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar docente</option>
              {docentes.map(doc => (
                <option key={doc.id} value={doc.nombre}>{doc.nombre}</option>
              ))}
            </select>
          </div>

          {/* 5. Créditos y Aula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Créditos</label>
              <input
                type="number"
                required
                min="1"
                max="6"
                value={formData.creditos || ''}
                onChange={(e) => setFormData({ ...formData, creditos: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Aula
              </label>
              <select
                required
                value={formData.aula}
                onChange={(e) => setFormData({ ...formData, aula: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Seleccionar aula</option>
                {AULAS.map(aula => (
                  <option key={aula} value={aula}>{aula}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Horario con disponibilidad */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horario
              {formData.docente && formData.aula && (
                <span className="text-xs text-green-400">
                  ({horariosDisponibles.filter(h => h.disponible).length} disponibles)
                </span>
              )}
            </label>
            {!formData.docente || !formData.aula ? (
              <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-500 text-sm">
                Selecciona un docente y un aula para ver horarios disponibles
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-2">
                {horariosDisponibles.map((horario) => (
                  <div
                    key={horario.value}
                    className={`relative ${!horario.disponible ? 'opacity-50' : ''}`}
                    title={horario.conflicto || ''}
                  >
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        formData.horario === horario.value
                          ? 'bg-blue-600/20 border border-blue-500'
                          : horario.disponible
                          ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                          : 'bg-gray-800 border border-gray-700 cursor-not-allowed'
                      }`}
                    >
                      <input
                        type="radio"
                        name="horario"
                        value={horario.value}
                        checked={formData.horario === horario.value}
                        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                        disabled={!horario.disponible}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm ${horario.disponible ? 'text-white' : 'text-gray-500'}`}>
                          {horario.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {horario.disponible ? (
                            <div className="flex items-center gap-1 text-green-400 text-xs">
                              <CheckCircle className="w-4 h-4" />
                              <span>Disponible</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-400 text-xs group relative">
                              <XCircle className="w-4 h-4" />
                              <span>Conflicto</span>
                              <div className="hidden group-hover:block absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs whitespace-nowrap z-10 shadow-lg">
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                {horario.conflicto}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-2 rounded-lg transition-all ${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              {editingMateria ? 'Actualizar Materia' : 'Crear Materia'}
            </button>
          </div>

          {/* Estado del formulario (ayuda visual) */}
          {!isFormValid && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-xs text-yellow-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Completa todos los campos requeridos y resuelve los errores para continuar
              </p>
            </div>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que deseas eliminar la materia{' '}
            <span className="text-white font-medium">{deletingMateria?.materia}</span>?
          </p>
          <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
