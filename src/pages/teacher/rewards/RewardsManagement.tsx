import { useState, useEffect } from 'react';
import { 
  Gift, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Edit, 
  Trash,
  Tag,
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';
import { Reward, RewardCategory } from '../../../lib/types/rewards';
import { rewardsApi } from '../../../lib/api/rewards';
import { useAuth } from '../../../lib/context/AuthContext';

export function RewardsManagement() {
  const { currentUser } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RewardCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar recompensas desde la API
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await rewardsApi.getRewards();
        setRewards(data);
      } catch (err) {
        console.error('Error al cargar recompensas:', err);
        setError('No se pudieron cargar las recompensas. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, []);
  
  // Filtrar recompensas según búsqueda y filtros
  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = 
      reward.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || reward.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Agrupamos las recompensas por categoría para mostrarlas
  const groupedRewards: Record<RewardCategory, Reward[]> = {
    material: [],
    experience: [],
    privilege: [],
    digital: []
  };
  
  filteredRewards.forEach(reward => {
    groupedRewards[reward.category].push(reward);
  });

  // Categorías traducidas para mostrar en la UI
  const categoryTranslations: Record<RewardCategory, string> = {
    material: 'Material Físico',
    experience: 'Experiencias',
    privilege: 'Privilegios',
    digital: 'Contenido Digital'
  };

  // Colores para las categorías
  const categoryColors: Record<RewardCategory, {bg: string, text: string, border: string}> = {
    material: {bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200'},
    experience: {bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200'},
    privilege: {bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200'},
    digital: {bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200'}
  };

  const handleEdit = (reward: Reward) => {
    setCurrentReward(reward);
    setShowEditModal(true);
  };

  const handleDelete = (reward: Reward) => {
    setCurrentReward(reward);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (currentReward) {
      try {
        await rewardsApi.deleteReward(currentReward.id);
        setRewards(rewards.filter(r => r.id !== currentReward.id));
        setShowDeleteConfirm(false);
        setCurrentReward(null);
      } catch (err) {
        console.error('Error al eliminar recompensa:', err);
        // Mostrar mensaje de error
      }
    }
  };

  const openAddModal = () => {
    setCurrentReward(null);
    setShowAddModal(true);
  };
  
  const handleAddReward = async (newReward: Omit<Reward, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      const createdReward = await rewardsApi.createReward(newReward);
      setRewards([...rewards, createdReward]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error al crear recompensa:', err);
      // Mostrar mensaje de error
    }
  };
  
  const handleUpdateReward = async (id: string, updates: Partial<Reward>) => {
    try {
      const updatedReward = await rewardsApi.updateReward(id, updates);
      setRewards(rewards.map(r => r.id === id ? updatedReward : r));
      setShowEditModal(false);
      setCurrentReward(null);
    } catch (err) {
      console.error('Error al actualizar recompensa:', err);
      // Mostrar mensaje de error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Premios</h1>
        <p className="text-gray-600">Administra el catálogo de premios disponibles para los estudiantes</p>
      </header>
      
      {/* Estado de error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      {/* Barra de herramientas */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar premio..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as RewardCategory | 'all')}
              >
                <option value="all">Todas las categorías</option>
                <option value="material">Material Físico</option>
                <option value="experience">Experiencias</option>
                <option value="privilege">Privilegios</option>
                <option value="digital">Contenido Digital</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <button 
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            onClick={openAddModal}
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Añadir Premio</span>
          </button>
        </div>
      </div>
      
      {/* Estado de carga */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
          <span className="ml-2 text-gray-600">Cargando premios...</span>
        </div>
      )}
      
      {/* Estado vacío */}
      {!isLoading && !error && rewards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No hay premios disponibles</h3>
          <p className="text-gray-500 mb-4">Añade premios para que los estudiantes puedan canjearlos</p>
          <button 
            onClick={openAddModal}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Crear primer premio
          </button>
        </div>
      )}
      
      {/* Lista de recompensas por categoría */}
      {!isLoading && !error && rewards.length > 0 && (Object.keys(groupedRewards) as RewardCategory[]).map(category => {
        if (groupedRewards[category].length === 0) return null;
        
        return (
          <div key={category} className="mb-8">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-lg ${categoryColors[category].bg} flex items-center justify-center mr-3`}>
                <Gift className={`h-5 w-5 ${categoryColors[category].text}`} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{categoryTranslations[category]}</h2>
              <span className="ml-3 text-sm text-gray-500">{groupedRewards[category].length} premios</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedRewards[category].map(reward => (
                <div 
                  key={reward.id} 
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border ${reward.available ? 'border-gray-100' : 'border-gray-200 opacity-70'}`}
                >
                  {reward.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={reward.imageUrl} 
                        alt={reward.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{reward.title}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[category].bg} ${categoryColors[category].text}`}>
                        {categoryTranslations[category]}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{reward.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-violet-600">{reward.pointsCost} pts</div>
                      
                      {!reward.unlimited && reward.remainingQuantity !== undefined && (
                        <div className="text-sm text-gray-500">
                          Disponibles: {reward.remainingQuantity}
                        </div>
                      )}
                    </div>
                    
                    {reward.expiresAt && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Expira: {new Date(reward.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                      <button
                        onClick={() => handleEdit(reward)}
                        className="text-violet-600 hover:text-violet-800 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      
                      <button
                        onClick={() => handleDelete(reward)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {filteredRewards.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron premios</h3>
          <p className="text-gray-600 mb-6">
            No hay premios que coincidan con los criterios de búsqueda o filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Ver todos los premios
          </button>
        </div>
      )}
      
      {/* Modal de edición */}
      {showEditModal && currentReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Editar Premio
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    defaultValue={currentReward.title}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    defaultValue={currentReward.description}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pointsCost" className="block text-sm font-medium text-gray-700 mb-1">
                      Costo en Puntos
                    </label>
                    <input
                      type="number"
                      id="pointsCost"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      defaultValue={currentReward.pointsCost}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                      defaultValue={currentReward.category}
                    >
                      <option value="material">Material Físico</option>
                      <option value="experience">Experiencias</option>
                      <option value="privilege">Privilegios</option>
                      <option value="digital">Contenido Digital</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Imagen (opcional)
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    defaultValue={currentReward.imageUrl || ''}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="unlimited"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    defaultChecked={currentReward.unlimited}
                  />
                  <label htmlFor="unlimited" className="ml-2 block text-sm text-gray-700">
                    Cantidad ilimitada
                  </label>
                </div>
                
                {!currentReward.unlimited && (
                  <div>
                    <label htmlFor="remainingQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad Disponible
                    </label>
                    <input
                      type="number"
                      id="remainingQuantity"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      defaultValue={currentReward.remainingQuantity || 0}
                      min="0"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Expiración (opcional)
                  </label>
                  <input
                    type="date"
                    id="expiresAt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    defaultValue={currentReward.expiresAt ? new Date(currentReward.expiresAt).toISOString().split('T')[0] : ''}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    defaultChecked={currentReward.available}
                  />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                    Disponible para canjear
                  </label>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    onClick={() => {
                      // Aquí iría la lógica para guardar los cambios
                      setShowEditModal(false);
                    }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para añadir nueva recompensa */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Añadir Nuevo Premio
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="new-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="new-title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Ej: Libro a elección"
                  />
                </div>
                
                <div>
                  <label htmlFor="new-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="new-description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Describe el premio y sus condiciones..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-pointsCost" className="block text-sm font-medium text-gray-700 mb-1">
                      Costo en Puntos
                    </label>
                    <input
                      type="number"
                      id="new-pointsCost"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Ej: 100"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="new-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      id="new-category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                    >
                      <option value="material">Material Físico</option>
                      <option value="experience">Experiencias</option>
                      <option value="privilege">Privilegios</option>
                      <option value="digital">Contenido Digital</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="new-imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Imagen (opcional)
                  </label>
                  <input
                    type="text"
                    id="new-imageUrl"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="new-unlimited"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    defaultChecked={true}
                  />
                  <label htmlFor="new-unlimited" className="ml-2 block text-sm text-gray-700">
                    Cantidad ilimitada
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="new-available"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    defaultChecked={true}
                  />
                  <label htmlFor="new-available" className="ml-2 block text-sm text-gray-700">
                    Disponible para canjear
                  </label>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    onClick={() => {
                      // Aquí iría la lógica para añadir el nuevo premio
                      setShowAddModal(false);
                    }}
                  >
                    Añadir Premio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && currentReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash className="h-6 w-6 text-red-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                ¿Eliminar este premio?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar <span className="font-medium">"{currentReward.title}"</span>?
              </p>
              
              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
