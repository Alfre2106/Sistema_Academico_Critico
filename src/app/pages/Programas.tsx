import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { programas as initialProgramas } from '../data/mockData';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { Modal } from '../components/Modal';

interface Programa {
  id: number;
  nombre: string;
  codigo: string;
  facultad: string;
  creditos: number;
  semestres: number;
}

export function Programas() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [programas, setProgramas] = useState<Programa[]>(() => {
    const saved = localStorage.getItem('programas');
    return saved ? JSON.parse(saved) : initialProgramas;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState<Programa | null>(null);
  const [deletingPrograma, setDeletingPrograma] = useState<Programa | null>(null);
  const [viewingPrograma, setViewingPrograma] = useState<Programa | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    facultad: '',
    creditos: 0,
    semestres: 0,
  });

  const canEdit = hasPermission('crud_programas') || hasPermission('edit_programas');
  const canCreate = hasPermission('crud_programas');

  useEffect(() => {
    localStorage.setItem('programas', JSON.stringify(programas));
  }, [programas]);

  const filteredProgramas = programas.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (programa: Programa) => {
    setViewingPrograma(programa);
    setIsViewModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPrograma(null);
    setFormData({ nombre: '', codigo: '', facultad: '', creditos: 0, semestres: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (programa: Programa) => {
    setEditingPrograma(programa);
    setFormData({
      nombre: programa.nombre,
      codigo: programa.codigo,
      facultad: programa.facultad,
      creditos: programa.creditos,
      semestres: programa.semestres,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (programa: Programa) => {
    setDeletingPrograma(programa);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingPrograma) {
      setProgramas(programas.filter((p) => p.id !== deletingPrograma.id));
      setIsDeleteModalOpen(false);
      setDeletingPrograma(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrograma) {
      setProgramas(
        programas.map((p) =>
          p.id === editingPrograma.id ? { ...p, ...formData } : p
        )
      );
    } else {
      const newPrograma: Programa = {
        id: Math.max(...programas.map((p) => p.id)) + 1,
        ...formData,
      };
      setProgramas([...programas, newPrograma]);
    }
    setIsModalOpen(false);
    setEditingPrograma(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl text-white">Programas Académicos</h1>
        {canCreate && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Programa</span>
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
              placeholder="Buscar programa..."
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
                <th className="text-left text-sm text-gray-400 pb-3">Facultad</th>
                <th className="text-left text-sm text-gray-400 pb-3">Créditos</th>
                <th className="text-left text-sm text-gray-400 pb-3">Semestres</th>
                <th className="text-right text-sm text-gray-400 pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProgramas.map((programa) => (
                <tr key={programa.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 text-blue-400">{programa.codigo}</td>
                  <td className="py-4 text-white">{programa.nombre}</td>
                  <td className="py-4 text-gray-400">{programa.facultad}</td>
                  <td className="py-4 text-gray-400">{programa.creditos}</td>
                  <td className="py-4 text-gray-400">{programa.semestres}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(programa)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleEdit(programa)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          {canCreate && (
                            <button
                              onClick={() => handleDelete(programa)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          )}
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
          {filteredProgramas.map((programa) => (
            <div key={programa.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{programa.nombre}</h3>
                  <p className="text-blue-400 text-sm">{programa.codigo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(programa)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleEdit(programa)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                      {canCreate && (
                        <button
                          onClick={() => handleDelete(programa)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Facultad</div>
                  <div className="text-white text-xs">{programa.facultad}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Créditos</div>
                  <div className="text-white">{programa.creditos}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Semestres</div>
                  <div className="text-white">{programa.semestres}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalles del Programa"
      >
        {viewingPrograma && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Código</label>
                <div className="text-blue-400">{viewingPrograma.codigo}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Nombre</label>
                <div className="text-white">{viewingPrograma.nombre}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Facultad</label>
              <div className="text-white">{viewingPrograma.facultad}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Total Créditos</label>
                <div className="text-white">{viewingPrograma.creditos}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Duración</label>
                <div className="text-white">{viewingPrograma.semestres} semestres</div>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
              <h3 className="text-white mb-2">Información Adicional</h3>
              <p className="text-sm text-gray-400">
                Este programa académico pertenece a la facultad de {viewingPrograma.facultad} y tiene una duración de {viewingPrograma.semestres} semestres con un total de {viewingPrograma.creditos} créditos académicos.
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPrograma ? 'Editar Programa' : 'Nuevo Programa'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Código</label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Facultad</label>
            <select
              required
              value={formData.facultad}
              onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar facultad</option>
              <option value="Ingeniería">Ingeniería</option>
              <option value="Ciencias Sociales">Ciencias Sociales</option>
              <option value="Ciencias de la Salud">Ciencias de la Salud</option>
              <option value="Artes y Humanidades">Artes y Humanidades</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Créditos</label>
              <input
                type="number"
                required
                min="0"
                value={formData.creditos}
                onChange={(e) => setFormData({ ...formData, creditos: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Semestres</label>
              <input
                type="number"
                required
                min="1"
                value={formData.semestres}
                onChange={(e) => setFormData({ ...formData, semestres: parseInt(e.target.value) })}
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
              {editingPrograma ? 'Actualizar' : 'Crear'}
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
            ¿Estás seguro de que deseas eliminar el programa{' '}
            <span className="text-white font-medium">{deletingPrograma?.nombre}</span>?
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
