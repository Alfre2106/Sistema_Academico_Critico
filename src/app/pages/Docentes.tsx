import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData, Docente, DocenteCredenciales, DocentePermisos, DocenteMateria } from '../context/DataContext';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  Building,
  BookOpen,
  Users,
  Key,
  ShieldCheck,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import { Modal } from '../components/Modal';

const CARRERAS_POR_FACULTAD: Record<string, string[]> = {
  'Ingeniería': [
    'Ingeniería de Sistemas',
    'Ingeniería Civil',
    'Ingeniería Industrial',
    'Ingeniería Electrónica',
  ],
  'Ciencias Sociales': ['Psicología', 'Trabajo Social', 'Sociología'],
  'Ciencias de la Salud': ['Medicina', 'Enfermería', 'Fisioterapia'],
  'Artes y Humanidades': ['Diseño Gráfico', 'Comunicación Social', 'Filosofía'],
};

function generateUsername(nombre: string): string {
  const parts = nombre.toLowerCase().split(' ');
  if (parts.length >= 2) {
    return parts[0].charAt(0) + parts[1];
  }
  return parts[0];
}

function generateTemporalPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const special = '!@#$*';
  return (
    chars.charAt(Math.floor(Math.random() * chars.length)) +
    Array(4)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)).toLowerCase())
      .join('') +
    nums.charAt(Math.floor(Math.random() * nums.length)) +
    nums.charAt(Math.floor(Math.random() * nums.length)) +
    special.charAt(Math.floor(Math.random() * special.length))
  );
}

export function Docentes() {
  const { hasPermission } = useAuth();
  const { docentes, addDocente, updateDocente, deleteDocente, facultades } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacultad, setSelectedFacultad] = useState<string>('');
  const [selectedCarrera, setSelectedCarrera] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);

  const [editingDocente, setEditingDocente] = useState<Docente | null>(null);
  const [deletingDocente, setDeletingDocente] = useState<Docente | null>(null);
  const [currentDocente, setCurrentDocente] = useState<Docente | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    oficina: '',
    facultad: '',
    carreras: [] as string[],
    especialidad: '',
    estado: 'Activo' as 'Activo' | 'Licencia' | 'Inactivo',
  });

  const [credentialsData, setCredentialsData] = useState({
    usuario: '',
    passwordTemporal: '',
    enviarEmail: true,
  });

  const [materiaFormData, setMateriaFormData] = useState({
    codigo: '',
    nombre: '',
    carrera: '',
    horario: '',
    creditos: 0,
    estudiantes: 0,
  });

  const canEdit = hasPermission('crud_docentes');

  const filteredDocentes = useMemo(() => {
    return docentes.filter((d) => {
      const matchSearch =
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFacultad = !selectedFacultad || d.facultad === selectedFacultad;
      const matchCarrera =
        !selectedCarrera ||
        (d.permisos?.carreras || []).includes(selectedCarrera);
      return matchSearch && matchFacultad && matchCarrera;
    });
  }, [docentes, searchTerm, selectedFacultad, selectedCarrera]);

  const handleCreate = () => {
    setEditingDocente(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      oficina: '',
      facultad: '',
      carreras: [],
      especialidad: '',
      estado: 'Activo',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (docente: Docente) => {
    setEditingDocente(docente);
    setFormData({
      nombre: docente.nombre,
      email: docente.email,
      telefono: docente.telefono || '',
      oficina: docente.oficina || '',
      facultad: docente.facultad,
      carreras: docente.permisos?.carreras || [],
      especialidad: docente.especialidad || '',
      estado: docente.estado,
    });
    setIsModalOpen(true);
  };

  const handleGenerateCredentials = (docente: Docente) => {
    setCurrentDocente(docente);
    const usuario = generateUsername(docente.nombre);
    const passwordTemporal = generateTemporalPassword();
    setCredentialsData({
      usuario,
      passwordTemporal,
      enviarEmail: true,
    });
    setIsCredentialsModalOpen(true);
  };

  const handleSaveCredentials = () => {
    if (!currentDocente) return;

    const newCredentials: DocenteCredenciales = {
      usuario: credentialsData.usuario,
      passwordTemporal: credentialsData.passwordTemporal,
      rol: 'DOCENTE',
      estado: 'ACTIVO',
      ultimoAcceso: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    updateDocente(currentDocente.id, {
      credenciales: newCredentials,
    });

    if (credentialsData.enviarEmail) {
      console.log(`Credenciales enviadas a ${currentDocente.email}`);
    }

    setIsCredentialsModalOpen(false);
    setCurrentDocente(null);
  };

  const handleDelete = (docente: Docente) => {
    setDeletingDocente(docente);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingDocente) {
      deleteDocente(deletingDocente.id);
      setIsDeleteModalOpen(false);
      setDeletingDocente(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCodigo = editingDocente
      ? editingDocente.codigo
      : `DOC${String(Math.max(...docentes.map(d => parseInt(d.codigo.replace('DOC', '')) || 0), 0) + 1).padStart(3, '0')}`;

    const permisos: DocentePermisos = {
      facultad: formData.facultad,
      carreras: formData.carreras,
    };

    if (editingDocente) {
      updateDocente(editingDocente.id, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        oficina: formData.oficina,
        facultad: formData.facultad,
        especialidad: formData.especialidad,
        estado: formData.estado,
        permisos,
      });
    } else {
      const newDocente: Omit<Docente, 'id'> = {
        codigo: newCodigo,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        oficina: formData.oficina,
        facultad: formData.facultad,
        especialidad: formData.especialidad,
        estado: formData.estado,
        permisos,
        materias: [],
      };
      addDocente(newDocente);
    }

    setIsModalOpen(false);
    setEditingDocente(null);
  };

  const handleAddMateria = (docente: Docente) => {
    setCurrentDocente(docente);
    setMateriaFormData({
      codigo: '',
      nombre: '',
      carrera: docente.permisos?.carreras[0] || '',
      horario: '',
      creditos: 0,
      estudiantes: 0,
    });
    setIsMateriaModalOpen(true);
  };

  const handleSaveMateria = () => {
    if (!currentDocente) return;

    const newMateria: DocenteMateria = {
      codigo: materiaFormData.codigo,
      nombre: materiaFormData.nombre,
      carrera: materiaFormData.carrera,
      creditos: materiaFormData.creditos,
      horario: materiaFormData.horario,
      estudiantes: materiaFormData.estudiantes,
    };

    const existingMaterias = currentDocente.materias || [];
    updateDocente(currentDocente.id, {
      materias: [...existingMaterias, newMateria],
    });

    setIsMateriaModalOpen(false);
    setCurrentDocente(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Gestión de Docentes</h1>
        {canEdit && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Docente
          </button>
        )}
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar docente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedFacultad}
            onChange={(e) => {
              setSelectedFacultad(e.target.value);
              setSelectedCarrera('');
            }}
            className="bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Todas las Facultades</option>
            {Object.keys(CARRERAS_POR_FACULTAD).map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>

          <select
            value={selectedCarrera}
            onChange={(e) => setSelectedCarrera(e.target.value)}
            disabled={!selectedFacultad}
            className="bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Todas las Carreras</option>
            {selectedFacultad &&
              CARRERAS_POR_FACULTAD[selectedFacultad].map((car) => (
                <option key={car} value={car}>
                  {car}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredDocentes.map((docente) => (
            <div
              key={docente.id}
              className="bg-[#0f172a] border border-[#334155] rounded-xl p-6 hover:border-[#3b82f6] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{docente.nombre}</h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        docente.estado === 'Activo'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : docente.estado === 'Licencia'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {docente.estado === 'Activo' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {docente.estado === 'Licencia' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                      {docente.estado === 'Inactivo' && <XCircle className="w-3 h-3 inline mr-1" />}
                      {docente.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Especialidad: <span className="text-gray-300">{docente.especialidad}</span>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${docente.email}`} className="text-blue-400 hover:text-blue-300">
                        {docente.email}
                      </a>
                    </div>
                    {docente.telefono && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span className="text-gray-300">{docente.telefono}</span>
                      </div>
                    )}
                    {docente.oficina && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Building className="w-4 h-4" />
                        <span className="text-gray-300">{docente.oficina}</span>
                      </div>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(docente)}
                      className="p-2 hover:bg-[#334155] rounded-lg transition-colors"
                      title="Editar docente"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(docente)}
                      className="p-2 hover:bg-[#334155] rounded-lg transition-colors"
                      title="Eliminar docente"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              {docente.credenciales ? (
                <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-white">Credenciales de acceso</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Usuario</p>
                      <p className="text-sm text-gray-300 font-mono">{docente.credenciales.usuario}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estado</p>
                      <p className={`text-sm font-medium ${
                        docente.credenciales.estado === 'ACTIVO' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {docente.credenciales.estado}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Último acceso</p>
                      <p className="text-sm text-gray-300">{docente.credenciales.ultimoAcceso || 'Nunca'}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Facultad asignada</p>
                    <p className="text-sm text-gray-300">{docente.permisos?.facultad}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Carreras habilitadas</p>
                    <div className="flex flex-wrap gap-2">
                      {docente.permisos?.carreras.map((carrera) => (
                        <span
                          key={carrera}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/30"
                        >
                          {carrera}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                canEdit && (
                  <button
                    onClick={() => handleGenerateCredentials(docente)}
                    className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 py-2 px-4 rounded-lg text-sm font-medium transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Generar Credenciales
                  </button>
                )
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-white">Materias asignadas</h4>
                  </div>
                  {canEdit && (
                    <button
                      onClick={() => handleAddMateria(docente)}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar
                    </button>
                  )}
                </div>

                {docente.materias && docente.materias.length > 0 ? (
                  <div className="space-y-2">
                    {docente.materias.map((materia, idx) => (
                      <div
                        key={idx}
                        className="bg-[#1e293b] border border-[#334155] rounded-lg p-3 hover:border-[#3b82f6] transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-sm font-medium text-white">
                                {materia.nombre} ({materia.codigo})
                              </h5>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">Carrera: {materia.carrera}</p>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div className="flex items-center gap-1 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{materia.horario}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-400">
                                <Award className="w-3 h-3" />
                                <span>{materia.creditos} créditos</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-400">
                                <Users className="w-3 h-3" />
                                <span>{materia.estudiantes} estudiantes</span>
                              </div>
                            </div>
                          </div>
                          {canEdit && (
                            <button className="p-1 hover:bg-[#334155] rounded transition-colors">
                              <Edit className="w-3 h-3 text-gray-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No hay materias asignadas</p>
                )}
              </div>

              {docente.credenciales && (
                <div className="mt-4 pt-4 border-t border-[#334155]">
                  <button className="w-full bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Ver Portal Docente
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredDocentes.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No se encontraron docentes</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDocente ? 'Editar Docente' : 'Nuevo Docente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre Completo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Oficina</label>
              <input
                type="text"
                value={formData.oficina}
                onChange={(e) => setFormData({ ...formData, oficina: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Facultad <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.facultad}
              onChange={(e) => {
                setFormData({ ...formData, facultad: e.target.value, carreras: [] });
              }}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar facultad</option>
              {Object.keys(CARRERAS_POR_FACULTAD).map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Carreras Permitidas <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto bg-[#0f172a] border border-[#334155] rounded-lg p-3">
              {formData.facultad ? (
                CARRERAS_POR_FACULTAD[formData.facultad].map((carrera) => (
                  <label key={carrera} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={formData.carreras.includes(carrera)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, carreras: [...formData.carreras, carrera] });
                        } else {
                          setFormData({ ...formData, carreras: formData.carreras.filter((c) => c !== carrera) });
                        }
                      }}
                      className="w-4 h-4 rounded border-[#334155] bg-[#0f172a] text-blue-600 focus:ring-blue-500"
                    />
                    {carrera}
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Selecciona una facultad primero</p>
              )}
            </div>
            {formData.facultad && formData.carreras.length === 0 && (
              <p className="text-xs text-red-400 mt-1">Debes seleccionar al menos una carrera</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Especialidad</label>
            <input
              type="text"
              value={formData.especialidad}
              onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Estado</label>
            <select
              required
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Activo">Activo</option>
              <option value="Licencia">Licencia</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formData.facultad && formData.carreras.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingDocente ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        title="Generar Credenciales"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              Se generarán credenciales automáticas para el docente. El usuario puede cambiar la contraseña en su
              primer acceso.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Usuario generado</label>
            <input
              type="text"
              value={credentialsData.usuario}
              onChange={(e) => setCredentialsData({ ...credentialsData, usuario: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña temporal</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={credentialsData.passwordTemporal}
                onChange={(e) =>
                  setCredentialsData({ ...credentialsData, passwordTemporal: e.target.value })
                }
                className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() =>
                  setCredentialsData({ ...credentialsData, passwordTemporal: generateTemporalPassword() })
                }
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Regenerar
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={credentialsData.enviarEmail}
                onChange={(e) =>
                  setCredentialsData({ ...credentialsData, enviarEmail: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#334155] bg-[#0f172a] text-blue-600 focus:ring-blue-500"
              />
              Enviar credenciales por correo electrónico
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              onClick={() => setIsCredentialsModalOpen(false)}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCredentials}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Guardar Credenciales
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isMateriaModalOpen}
        onClose={() => setIsMateriaModalOpen(false)}
        title="Agregar Materia"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Código</label>
              <input
                type="text"
                value={materiaFormData.codigo}
                onChange={(e) => setMateriaFormData({ ...materiaFormData, codigo: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="SIS-301"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre</label>
              <input
                type="text"
                value={materiaFormData.nombre}
                onChange={(e) => setMateriaFormData({ ...materiaFormData, nombre: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Base de Datos"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Carrera</label>
            <select
              value={materiaFormData.carrera}
              onChange={(e) => setMateriaFormData({ ...materiaFormData, carrera: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              {currentDocente?.permisos?.carreras.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Horario</label>
            <input
              type="text"
              value={materiaFormData.horario}
              onChange={(e) => setMateriaFormData({ ...materiaFormData, horario: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Lun-Mié 8:00-10:00"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Créditos</label>
              <input
                type="number"
                min="1"
                value={materiaFormData.creditos}
                onChange={(e) =>
                  setMateriaFormData({ ...materiaFormData, creditos: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Estudiantes</label>
              <input
                type="number"
                min="0"
                value={materiaFormData.estudiantes}
                onChange={(e) =>
                  setMateriaFormData({ ...materiaFormData, estudiantes: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              onClick={() => setIsMateriaModalOpen(false)}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveMateria}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Agregar Materia
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-gray-300">
              ¿Estás seguro de que deseas eliminar al docente{' '}
              <span className="text-white font-medium">{deletingDocente?.nombre}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción eliminará también todas sus credenciales y materias asignadas.
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors"
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
