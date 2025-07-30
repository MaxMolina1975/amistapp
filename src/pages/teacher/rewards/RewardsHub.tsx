import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  Coins,
  ArrowRight,
  Award,
  TrendingUp,
  BarChart2,
  Crown
} from 'lucide-react';
import { useAuth } from '../../../lib/context/AuthContext';
import { rewardsApi } from '../../../lib/api/rewards';

// Tipos para estadísticas
interface RewardsStats {
  totalPointsAwarded: number;
  totalRewardsRedeemed: number;
  totalRewards: number;
  mostPopularReward: {
    id: string;
    title: string;
    pointsCost: number;
    redeemedCount: number;
  };
  topPointsEarners: Array<{
    id: string | number;
    name: string;
    lastName: string;
    points: number;
    profileImage?: string;
  }>;
  pointsDistribution: {
    academic: number;
    social: number;
    emotional: number;
    behavioral: number;
  };
  monthlyAwards: {
    current: number;
    previous: number;
    change: number;
  };
}

export function RewardsHub() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RewardsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRedemptions, setPendingRedemptions] = useState<Array<{
    id: string;
    studentName: string;
    studentLastName: string;
    studentImage?: string;
    rewardName: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
  }>>([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    // Carga de datos desde la API
    const loadStats = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      
      try {
        // Obtener estadísticas de recompensas desde la API
        const teacherId = typeof currentUser.id === 'string' ? currentUser.id : currentUser.id.toString();
        const statsData = await rewardsApi.getTeacherRewardsStats(teacherId);
        
        // Obtener los estudiantes con más puntos
        const topStudents = await rewardsApi.getTopPointsEarners(teacherId, 5);
        
        // Configurar las estadísticas con los datos reales
        setStats({
          totalPointsAwarded: statsData.totalPointsAwarded,
          totalRewardsRedeemed: statsData.totalRewardsRedeemed,
          totalRewards: statsData.totalRewards,
          mostPopularReward: statsData.mostPopularReward,
          topPointsEarners: topStudents.map(student => ({
            id: student.id,
            name: student.name,
            lastName: student.lastName,
            points: student.points,
            profileImage: student.profileImage
          })),
          pointsDistribution: statsData.pointsDistribution,
          monthlyAwards: statsData.monthlyAwards
        });
        
        // Obtener solicitudes de canje pendientes
        const pendingClaims = await rewardsApi.getPendingClaims(teacherId);
        setPendingRedemptions(pendingClaims.map(claim => ({
          id: claim.id,
          studentName: claim.studentName,
          studentLastName: claim.studentLastName,
          studentImage: claim.studentImage,
          rewardName: claim.rewardName,
          requestDate: new Date(claim.requestDate).toISOString().split('T')[0],
          status: claim.status
        })));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar las estadísticas de recompensas:', error);
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, []);

  // Navegar a las diferentes secciones
  const navigateToRewardsManagement = () => {
    navigate('/teacher/rewards');
  };

  const navigateToPointsAssignment = () => {
    navigate('/teacher/points');
  };
  
  // Manejo de solicitudes de canje
  const handleRedemptionApproval = async (id: string, approved: boolean) => {
    try {
      if (approved) {
        await rewardsApi.approveRewardClaim(id);
      } else {
        await rewardsApi.rejectRewardClaim(id);
      }
      
      // Actualizar el estado local después de la acción
      setPendingRedemptions(prev => 
        prev.map(redemption => 
          redemption.id === id 
            ? {...redemption, status: approved ? 'approved' : 'rejected'} 
            : redemption
        )
      );
    } catch (error) {
      console.error(`Error al ${approved ? 'aprobar' : 'rechazar'} la solicitud:`, error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Sistema de Premios y Puntos</h1>
        <p className="text-gray-600">Gestiona premios, asigna puntos y monitorea el progreso de tus estudiantes</p>
      </div>

      {/* Secciones Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Sección de Gestión de Premios */}
        <div 
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100 hover:shadow-md transition-shadow cursor-pointer"
          onClick={navigateToRewardsManagement}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <Gift className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Gestión de Premios</h2>
              <p className="text-gray-600">Crea y administra premios canjeables</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">Premios Activos</p>
                <p className="text-xl font-bold text-gray-800">{isLoading ? '...' : stats?.totalRewards || 0}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">Premios Canjeados</p>
                <p className="text-xl font-bold text-gray-800">{isLoading ? '...' : stats?.totalRewardsRedeemed}</p>
              </div>
            </div>
            
            {/* Featured Reward - Suscripción a biblioteca digital */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs font-medium text-gray-500 mb-1">Premio Destacado</p>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src="https://plus.unsplash.com/premium_photo-1681487441850-fb21c22f5c48?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlnaXRhbCUyMGxpYnJhcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" 
                    alt="Biblioteca Digital" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Suscripción a biblioteca digital</h3>
                  <p className="text-xs text-gray-600">400 puntos · 3 disponibles</p>
                </div>
              </div>
            </div>
            
            {!isLoading && stats && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">Premio más Popular</p>
                <p className="text-sm font-semibold text-gray-800">{stats.mostPopularReward.title}</p>
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-xs text-indigo-600">
                    <span className="font-medium">{stats.mostPopularReward.redeemedCount}</span> canjes
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">{stats.mostPopularReward.pointsCost}</span> puntos
                  </p>
                </div>
              </div>
            )}
            
            <div className="text-right">
              <button className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                <span>Ir a gestión de premios</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Sección de Asignación de Puntos */}
        <div 
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow cursor-pointer"
          onClick={navigateToPointsAssignment}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
              <Coins className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Asignación de Puntos</h2>
              <p className="text-gray-600">Premia acciones positivas con puntos</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">Total Puntos Asignados</p>
                <p className="text-xl font-bold text-gray-800">{isLoading ? '...' : stats?.totalPointsAwarded}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">Premios Mensuales</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold text-gray-800 mr-2">{isLoading ? '...' : stats?.monthlyAwards.current}</p>
                  {!isLoading && stats && (
                    <span className={`text-xs ${stats.monthlyAwards.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.monthlyAwards.change >= 0 ? '+' : ''}{stats.monthlyAwards.change}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {!isLoading && stats && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">Distribución de Puntos</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Académico</span>
                      <span className="font-medium">{stats.pointsDistribution.academic}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${stats.pointsDistribution.academic}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Social</span>
                      <span className="font-medium">{stats.pointsDistribution.social}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${stats.pointsDistribution.social}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-right">
              <button className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800">
                <span>Ir a asignación de puntos</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Nueva sección para Suscripción Anual Activa */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Suscripción y Puntos Premium</h2>
        
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-violet-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mr-4">
                <Crown className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Suscripción Anual Activa</h2>
                <p className="text-gray-600">Administra tu suscripción y accede a beneficios premium</p>
              </div>
            </div>
            
            <button 
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              onClick={() => navigate('/teacher/subscription')}
            >
              Gestionar Suscripción
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 mb-1">Estado</p>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="font-medium text-gray-800">Activa</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Hasta el 20 de Marzo, 2026</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 mb-1">Puntos Disponibles</p>
              <p className="text-xl font-bold text-gray-800">1000</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">Ilimitados con suscripción activa</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 mb-1">Beneficios Premium</p>
              <ul className="text-xs text-gray-700 space-y-1 mt-1">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5"></div>
                  <span>Gestión de múltiples cursos</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5"></div>
                  <span>Reportes y estadísticas avanzadas</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5"></div>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estadísticas y Gráficos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Análisis del Sistema de Premios</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Coins className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Total Puntos</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800">{isLoading ? '...' : stats?.totalPointsAwarded}</div>
            <div className="text-sm text-gray-500">Asignados hasta ahora</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Gift className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Premios Canjeados</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800">{isLoading ? '...' : stats?.totalRewardsRedeemed}</div>
            <div className="text-sm text-gray-500">Total de canjes</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Categoría Popular</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800">Académico</div>
            <div className="text-sm text-gray-500">45% de los puntos</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Crecimiento</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800">+14.3%</div>
            <div className="text-sm text-gray-500">Últimos 30 días</div>
          </div>
        </div>
      </div>
      
      {/* Tabla de Estudiantes */}
      {!isLoading && stats && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estudiantes con Más Puntos</h2>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premios Canjeados
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topPointsEarners.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          {student.profileImage ? (
                            <img 
                              className="h-8 w-8 rounded-full" 
                              src={student.profileImage} 
                              alt={`${student.name} ${student.lastName}`} 
                            />
                          ) : (
                            <span className="text-indigo-800 font-medium text-xs">
                              {student.name[0]}{student.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name} {student.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Ranking #{stats.topPointsEarners.indexOf(student) + 1}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <Coins className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{student.points}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{Math.floor(Math.random() * 5) + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => navigateToPointsAssignment()}
                      >
                        Asignar Puntos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Solicitudes de Canje Pendientes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Solicitudes de Canje Pendientes</h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Solicitud
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRedemptions.map((redemption) => (
                <tr key={redemption.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {redemption.studentImage ? (
                          <img 
                            className="h-8 w-8 rounded-full" 
                            src={redemption.studentImage} 
                            alt={`${redemption.studentName} ${redemption.studentLastName}`} 
                          />
                        ) : (
                          <span className="text-indigo-800 font-medium text-xs">
                            {redemption.studentName[0]}{redemption.studentLastName[0]}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {redemption.studentName} {redemption.studentLastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{redemption.rewardName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{redemption.requestDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {redemption.status === 'pending' ? (
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleRedemptionApproval(redemption.id, true)}
                        >
                          Aprobar
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleRedemptionApproval(redemption.id, false)}
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">{redemption.status}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Acciones rápidas */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={navigateToRewardsManagement}
            className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
          >
            <Gift className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-800">Crear Nuevo Premio</span>
          </button>
          
          <button 
            onClick={navigateToPointsAssignment}
            className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
          >
            <Coins className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-gray-800">Asignar Puntos</span>
          </button>
          
          <button 
            className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-800">Ver Informes Detallados</span>
          </button>
        </div>
      </div>
    </div>
  );
}
