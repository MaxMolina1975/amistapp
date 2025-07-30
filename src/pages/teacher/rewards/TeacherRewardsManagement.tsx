import { useState, useEffect } from 'react';
import { 
  Gift, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  Award,
  User
} from 'lucide-react';
import { useRewards } from '../../../lib/hooks/useRewards';
import { Reward, RewardClaim, RewardCategory } from '../../../lib/types';

export function TeacherRewardsManagement() {
  // Estados para gestionar premios
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddRewardForm, setShowAddRewardForm] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: 0,
    remainingQuantity: 0,
    category: 'material' as RewardCategory,
    active: true
  });

  // Estados para gestionar solicitudes de canje
  const [selectedClaim, setSelectedClaim] = useState<RewardClaim | null>(null);

  // TODO: Get actual teacher ID from auth context
  const { 
    rewards: apiRewards, 
    claims, 
    stats, 
    createReward, 
    updateReward, 
    deleteReward, 
    approveClaim, 
    rejectClaim,
    loading, 
    error, 
    refreshRewards 
  } = useRewards('teacher123', true);

  // Cargar datos al iniciar
  useEffect(() => {
    if (apiRewards) {
      setRewards(apiRewards);
    }
  }, [apiRewards]);

  // Filtrar premios según los criterios seleccionados
  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = 
      reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reward.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Agrupar premios por categoría
  const groupedRewards: Record<RewardCategory, Reward[]> = {
    material: [],
    experience: [],
    privilege: [],
    digital: []
  };

  filteredRewards.forEach(reward => {
    groupedRewards[reward.category].push(reward);
  });

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentReward) {
        // Actualizar premio existente
        await updateReward({
          ...formData,
          id: currentReward.id
        });
      } else {
        // Crear nuevo premio
        await createReward(formData);
      }
      
      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        pointsCost: 0,
        remainingQuantity: 0,
        category: 'material',
        active: true
      });
      setCurrentReward(null);
      setShowAddRewardForm(false);
      
      // Recargar datos
      refreshRewards();
    } catch (error) {
      console.error('Error al guardar el premio:', error);
    }
  };

  // Manejar eliminación de premio
  const handleDeleteReward = async (reward: Reward) => {
    if (window.confirm(`¿Estás seguro de eliminar el premio "${reward.title}"?`)) {
      try {
        await deleteReward(reward.id);
        setRewards(rewards.filter(r => r.id !== reward.id));
      } catch (error) {
        console.error('Error al eliminar el premio:', error);
      }
    }
  };

  // Manejar edición de premio
  const handleEditReward = (reward: Reward) => {
    setCurrentReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      pointsCost: reward.pointsCost,
      remainingQuantity: reward.remainingQuantity || 0,
      category: reward.category,
      active: reward.active !== false
    });
    setShowAddRewardForm(true);
  };

  // Manejar aprobación/rechazo de solicitudes
  const handleApproveClaim = async (claimId: string) => {
    await approveClaim(claimId);
    setSelectedClaim(null);
  };

  const handleRejectClaim = async (claimId: string) => {
    await rejectClaim(claimId);
    setSelectedClaim(null);
  };

  // Obtener texto y color según categoría
  const getCategoryInfo = (category: RewardCategory) => {
    switch (category) {
      case 'material':
        return { text: 'Material', color: 'text-blue-600 bg-blue-50' };
      case 'experience':
        return { text: 'Experiencia', color: 'text-green-600 bg-green-50' };
      case 'privilege':
        return { text: 'Privilegio', color: 'text-purple-600 bg-purple-50' };
      case 'digital':
        return { text: 'Digital', color: 'text-amber-600 bg-amber-50' };
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6 flex items-center justify-center">
      <div className="text-gray-500">Cargando premios...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Premios</h1>
        <p className="text-gray-600">Administra el catálogo de premios disponibles para los estudiantes</p>
      </header>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-gray-700">Premios Activos</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.activeRewards}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-700">Canjes Aprobados</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.approvedClaims || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-700">Canjes Pendientes</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingClaims || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-700">Puntos Distribuidos</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.pointsDistributed || 0}</p>
          </div>
        </div>
      )}

      {/* Filters and Add Button */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar premios..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="material">Material</option>
                <option value="experience">Experiencia</option>
                <option value="privilege">Privilegio</option>
                <option value="digital">Digital</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentReward(null);
              setFormData({
                title: '',
                description: '',
                pointsCost: 0,
                remainingQuantity: 0,
                category: 'material',
                active: true
              });
              setShowAddRewardForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Nuevo Premio
          </button>
        </div>
      </div>

      {/* Rewards List by Category */}
      <div className="space-y-8 mb-8">
        {(Object.keys(groupedRewards) as RewardCategory[]).map(category => {
          if (groupedRewards[category].length === 0) return null;
          
          const { text, color } = getCategoryInfo(category);
          
          return (
            <div key={category} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${color}`}>{text}</span>
                  <span className="ml-3 text-sm text-gray-500">{groupedRewards[category].length} premios</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedRewards[category].map(reward => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Gift className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{reward.title}</h3>
                          <p className="text-sm text-purple-600 font-medium">{reward.pointsCost} puntos</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReward(reward)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{reward.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      {reward.remainingQuantity !== undefined && (
                        <span>Stock: {reward.remainingQuantity > 0 ? reward.remainingQuantity : 'Ilimitado'}</span>
                      )}
                      <span className={reward.active !== false ? 'text-green-600' : 'text-red-600'}>
                        {reward.active !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {filteredRewards.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron premios</h3>
            <p className="text-gray-500 mb-6">
              No hay premios que coincidan con los criterios de búsqueda o filtros aplicados.
            </p>
            <button
              onClick={() => setFilterCategory('all')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ver todos los premios
            </button>
          </div>
        )}
      </div>

      {/* Pending Claims Section */}
      {claims && claims.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Solicitudes de Canje Pendientes</h2>
          
          <div className="space-y-4">
            {claims
              .filter(claim => claim.status === 'pending')
              .map(claim => {
                const reward = rewards.find(r => r.id === claim.rewardId);
                if (!reward) return null;

                return (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{reward.title}</h3>
                          <p className="text-sm text-gray-500">
                            Solicitado por {claim.user?.fullName || 'Usuario'} el {new Date(claim.claimedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRejectClaim(claim.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => handleApproveClaim(claim.id)}
                          className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          Aprobar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Add/Edit Reward Modal */}
      {showAddRewardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentReward ? 'Editar Premio' : 'Nuevo Premio'}
                </h2>
              </div>
              <button 
                onClick={() => setShowAddRewardForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Premio
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Día sin uniforme"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe el premio..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Puntos Requeridos
                  </label>
                  <input
                    type="number"
                    value={formData.pointsCost}
                    onChange={(e) => setFormData({...formData, pointsCost: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock (0 = ilimitado)
                  </label>
                  <input
                    type="number"
                    value={formData.remainingQuantity}
                    onChange={(e) => setFormData({...formData, remainingQuantity: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as RewardCategory})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="material">Material</option>
                  <option value="experience">Experiencia</option>
                  <option value="privilege">Privilegio</option>
                  <option value="digital">Digital</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Premio activo y disponible para canje
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddRewardForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {currentReward ? 'Actualizar Premio' : 'Crear Premio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}