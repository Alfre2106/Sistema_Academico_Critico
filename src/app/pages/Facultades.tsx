import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { facultades as initialFacultades } from '../data/mockData';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Modal } from '../components/Modal';

interface Facultad {
  id: number;
  nombre: string;
  programas: number;
  docentes: number;
  estudiantes: number;
}

export function Facultades() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [facultades, setFacultades] = useState<Facultad[]>(() => {
    const saved = localStorage.getItem('facultades');
    return saved ? JSON.parse(saved) : initialFacultades;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFacultad, setEditingFacultad] = useState<Facultad | null>(null);
  const [deletingFacultad, setDeletingFacultad] = useState<Facultad | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    programas: 0,
    docentes: 0,
    estudiantes: 0,
  });

  const canEdit = hasPermission('crud_facultades');

  useEffect(() => {
    localStorage.setItem('facultades', JSON.stringify(facultades));
  }, [facultades]);

  const filteredFacultades = facultades.filter((f) =>
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingFacultad(null);
    setFormData({ nombre: '', programas: 0, docentes: 0, estudiantes: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (facultad: Facultad) => {
    setEditingFacultad(facultad);
    setFormData({
      nombre: facultad.nombre,
      programas: facultad.programas,
      docentes: facultad.docentes,
      estudiantes: facultad.estudiantes,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (facultad: Facultad) => {
    setDeletingFacultad(facultad);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingFacultad) {
      setFacultades(facultades.filter((f) => f.id !== deletingFacultad.id));
      setIsDeleteModalOpen(false);
      setDeletingFacultad(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFacultad) {
      setFacultades(
        facultades.map((f) =>
          f.id === editingFacultad.id ? { ...f, ...formData } : f
        )
      );
    } else {
      const newFacultad: Facultad = {
        id: Math.max(...facultades.map((f) => f.id)) + 1,
        ...formData,
      };
      setFacultades([...facultades, newFacultad]);
    }
    setIsModalOpen(false);
    setEditingFacultad(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl text-white">Facultades</h1>
        {canEdit && (
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Facultad</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar facultad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-sm text-gray-400 pb-3">Nombre</th>
                <th className="text-left text-sm text-gray-400 pb-3">Programas</th>
                <th className="text-left text-sm text-gray-400 pb-3">Docentes</th>
                <th className="text-left text-sm text-gray-400 pb-3">Estudiantes</th>
                {canEdit && <th className="text-right text-sm text-gray-400 pb-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredFacultades.map((facultad) => (
                <tr key={facultad.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 text-white">{facultad.nombre}</td>
                  <td className="py-4 text-gray-400">{facultad.programas}</td>
                  <td className="py-4 text-gray-400">{facultad.docentes}</td>
                  <td className="py-4 text-gray-400">{facultad.estudiantes}</td>
                  {canEdit && (
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(facultad)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(facultad)}
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

        <div className="md:hidden space-y-3">
          {filteredFacultades.map((facultad) => (
            <div key={facultad.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-medium">{facultad.nombre}</h3>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(facultad)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(facultad)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Programas</div>
                  <div className="text-white">{facultad.programas}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Docentes</div>
                  <div className="text-white">{facultad.docentes}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Estudiantes</div>
                  <div className="text-white">{facultad.estudiantes}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFacultades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron facultades
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFacultad ? 'Editar Facultad' : 'Nueva Facultad'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Programas</label>
              <input
                type="number"
                required
                min="0"
                value={formData.programas}
                onChange={(e) => setFormData({ ...formData, programas: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Docentes</label>
              <input
                type="number"
                required
                min="0"
                value={formData.docentes}
                onChange={(e) => setFormData({ ...formData, docentes: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Estudiantes</label>
              <input
                type="number"
                required
                min="0"
                value={formData.estudiantes}
                onChange={(e) => setFormData({ ...formData, estudiantes: parseInt(e.target.value) })}
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
              {editingFacultad ? 'Actualizar' : 'Crear'}
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
            ¿Estás seguro de que deseas eliminar la facultad{' '}
            <span className="text-white font-medium">{deletingFacultad?.nombre}</span>?
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
