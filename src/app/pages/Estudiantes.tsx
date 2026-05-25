import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { estudiantes as initialEstudiantes } from '../data/mockData';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { Modal } from '../components/Modal';

interface Estudiante {
  id: number;
  codigo: string;
  nombre: string;
  programa: string;
  semestre: number;
  promedio: number;
}

export function Estudiantes() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(() => {
    const saved = localStorage.getItem('estudiantes');
    return saved ? JSON.parse(saved) : initialEstudiantes;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
  const [deletingEstudiante, setDeletingEstudiante] = useState<Estudiante | null>(null);
  const [viewingEstudiante, setViewingEstudiante] = useState<Estudiante | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    programa: '',
    semestre: 1,
    promedio: 0,
  });

  const canEdit = hasPermission('crud_estudiantes');

  useEffect(() => {
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
  }, [estudiantes]);

  const filteredEstudiantes = estudiantes.filter(
    (e) =>
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (estudiante: Estudiante) => {
    setViewingEstudiante(estudiante);
    setIsViewModalOpen(true);
  };

  const handleCreate = () => {
    setEditingEstudiante(null);
    setFormData({ codigo: '', nombre: '', programa: '', semestre: 1, promedio: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (estudiante: Estudiante) => {
    setEditingEstudiante(estudiante);
    setFormData({
      codigo: estudiante.codigo,
      nombre: estudiante.nombre,
      programa: estudiante.programa,
      semestre: estudiante.semestre,
      promedio: estudiante.promedio,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (estudiante: Estudiante) => {
    setDeletingEstudiante(estudiante);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingEstudiante) {
      setEstudiantes(estudiantes.filter((e) => e.id !== deletingEstudiante.id));
      setIsDeleteModalOpen(false);
      setDeletingEstudiante(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEstudiante) {
      setEstudiantes(
        estudiantes.map((est) =>
          est.id === editingEstudiante.id ? { ...est, ...formData } : est
        )
      );
    } else {
      const newEstudiante: Estudiante = {
        id: Math.max(...estudiantes.map((e) => e.id)) + 1,
        ...formData,
      };
      setEstudiantes([...estudiantes, newEstudiante]);
    }
    setIsModalOpen(false);
    setEditingEstudiante(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl text-white">Estudiantes</h1>
        {canEdit && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Estudiante</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Código</th>
                <th className="text-left text-sm text-gray-400 pb-3">Nombre</th>
                <th className="text-left text-sm text-gray-400 pb-3">Programa</th>
                <th className="text-left text-sm text-gray-400 pb-3">Semestre</th>
                <th className="text-left text-sm text-gray-400 pb-3">Promedio</th>
                <th className="text-right text-sm text-gray-400 pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstudiantes.map((estudiante) => (
                <tr key={estudiante.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 text-blue-400">{estudiante.codigo}</td>
                  <td className="py-4 text-white">{estudiante.nombre}</td>
                  <td className="py-4 text-gray-400">{estudiante.programa}</td>
                  <td className="py-4 text-gray-400">{estudiante.semestre}</td>
                  <td className="py-4">
                    <span
                      className={`${
                        estudiante.promedio >= 4.0
                          ? 'text-green-400'
                          : estudiante.promedio >= 3.5
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {estudiante.promedio.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(estudiante)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleEdit(estudiante)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(estudiante)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-3">
          {filteredEstudiantes.map((estudiante) => (
            <div key={estudiante.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{estudiante.nombre}</h3>
                  <p className="text-blue-400 text-sm">{estudiante.codigo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(estudiante)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleEdit(estudiante)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(estudiante)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Programa</div>
                  <div className="text-white text-xs">{estudiante.programa}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Semestre</div>
                  <div className="text-white">{estudiante.semestre}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Promedio</div>
                  <span
                    className={`${
                      estudiante.promedio >= 4.0
                        ? 'text-green-400'
                        : estudiante.promedio >= 3.5
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {estudiante.promedio.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Perfil del Estudiante"
      >
        {viewingEstudiante && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                {viewingEstudiante.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl text-white">{viewingEstudiante.nombre}</h3>
                <p className="text-blue-400">{viewingEstudiante.codigo}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Programa</label>
                <div className="text-white">{viewingEstudiante.programa}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Semestre Actual</label>
                <div className="text-white">{viewingEstudiante.semestre}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Promedio Acumulado</label>
              <div className={`text-2xl ${
                viewingEstudiante.promedio >= 4.0
                  ? 'text-green-400'
                  : viewingEstudiante.promedio >= 3.5
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}>
                {viewingEstudiante.promedio.toFixed(2)}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h4 className="text-white mb-3">Estadísticas Académicas</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Créditos Aprobados</div>
                  <div className="text-white text-lg">85</div>
                </div>
                <div>
                  <div className="text-gray-500">Asistencia</div>
                  <div className="text-green-400 text-lg">95%</div>
                </div>
                <div>
                  <div className="text-gray-500">Materias Actuales</div>
                  <div className="text-white text-lg">5</div>
                </div>
                <div>
                  <div className="text-gray-500">Estado</div>
                  <div className="text-green-400 text-lg">Activo</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h4 className="text-white mb-3">Información de Contacto</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-gray-500">Email</div>
                  <div className="text-white">{viewingEstudiante.codigo}@universidad.edu</div>
                </div>
                <div>
                  <div className="text-gray-500">Teléfono</div>
                  <div className="text-white">+57 300 123 4567</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEstudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Código Estudiantil</label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre Completo</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Programa</label>
            <select
              required
              value={formData.programa}
              onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar programa</option>
              <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
              <option value="Ingeniería Civil">Ingeniería Civil</option>
              <option value="Psicología">Psicología</option>
              <option value="Medicina">Medicina</option>
              <option value="Enfermería">Enfermería</option>
              <option value="Diseño Gráfico">Diseño Gráfico</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Semestre</label>
              <input
                type="number"
                required
                min="1"
                max="12"
                value={formData.semestre}
                onChange={(e) => setFormData({ ...formData, semestre: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Promedio</label>
              <input
                type="number"
                required
                min="0"
                max="5"
                step="0.1"
                value={formData.promedio}
                onChange={(e) => setFormData({ ...formData, promedio: parseFloat(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingEstudiante ? 'Actualizar' : 'Crear'}
            </button>
          </div>
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
            ¿Estás seguro de que deseas eliminar al estudiante{' '}
            <span className="text-white font-medium">{deletingEstudiante?.nombre}</span>?
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
