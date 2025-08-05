import { useState } from 'react';
import { Gift, Star, Trophy, Medal, Clock, CheckCircle, XCircle, Users, ArrowRight } from 'lucide-react';
import { useRewards } from '../../../lib/hooks/useRewards';
import { Reward } from '../../../lib/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';

export function StudentRewards() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id?.toString() || '';
  
  const { rewards, claims, claimReward, loading, error } = useRewards(userId);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const userPoints = currentUser?.points || 0;
  const navigate = useNavigate();

  const handleClaimReward = async (reward: Reward) => {
    if (userPoints < reward.pointsCost) {
      alert('No tienes suficientes puntos para este premio');
      return;
    }

    const success = await claimReward(reward.id);
    if (success) {
      alert('¡Premio canjeado con éxito! El profesor revisará tu solicitud.');
      setSelectedReward(null);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mis Premios</h1>
        <p className="text-gray-600">Canjea tus puntos por premios</p>
      </header>

      <div className="bg-blue-600 rounded-xl p-4 mb-6 text-white flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Mis Puntos</p>
          <p className="text-2xl font-bold">{userPoints}</p>
        </div>
        <Star className="w-8 h-8 opacity-50" />
      </div>

      {/* Tarjeta para asignar puntos a compañeros */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 mb-6 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Asignar Puntos a Compañeros</h3>
              <p className="text-sm text-white text-opacity-80">Reconoce las acciones positivas de tus compañeros</p>
            </div>
          </div>
        </div>
        <p className="text-sm mb-4 text-white text-opacity-90">
          Puedes asignar tus puntos a compañeros que demuestren comportamientos positivos.
          Los puntos se descontarán de tu balance actual.
        </p>
        <button 
          onClick={() => navigate('/student/points')}
          className="w-full py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <span>Asignar Puntos</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Available Rewards */}
      <div className="space-y-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{reward.title}</h3>
                  <p className="text-sm text-gray-500">{reward.pointsCost} puntos</p>
                </div>
              </div>
              <button 
                onClick={() => handleClaimReward(reward)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  userPoints >= reward.pointsCost
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={userPoints < reward.pointsCost}
              >
                {userPoints >= reward.pointsCost ? 'Canjear' : 'Bloqueado'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
            {reward.remainingQuantity && (
              <p className="text-sm text-gray-500">
                Disponibles: {reward.remainingQuantity}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Claims History */}
      {claims.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mis Canjes</h2>
          <div className="space-y-4">
            {claims.map((claim) => {
              const reward = rewards.find(r => r.id === claim.rewardId);
              if (!reward) return null;

              return (
                <div key={claim.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {claim.status === 'approved' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {claim.status === 'rejected' && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      {claim.status === 'pending' && (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{reward.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(claim.claimedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-600' :
                      claim.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {claim.status === 'approved' ? 'Aprobado' :
                       claim.status === 'rejected' ? 'Rechazado' :
                       'Pendiente'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}