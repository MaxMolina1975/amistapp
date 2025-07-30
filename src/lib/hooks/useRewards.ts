import { useState, useEffect } from 'react';
import { Reward, RewardClaim, RewardStats } from '../types';
import { rewardsApi } from '../api/rewards';

export function useRewards(userId: string, isTeacher: boolean = false) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [stats, setStats] = useState<RewardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
    if (!isTeacher) {
      fetchClaims();
    }
  }, [userId, isTeacher]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      // Implementar llamada a API real
      const rewards = await rewardsApi.getRewards(userId, isTeacher);
      setRewards(rewards || []);
      
      // Obtener estadísticas reales
      const stats = await rewardsApi.getStats(userId, isTeacher);
      setStats(stats || null);
    } catch (err) {
      setError('Error al cargar los premios');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      // Implementar llamada a API real
      const claims = await rewardsApi.getClaims(userId);
      setClaims(claims || []);
    } catch (err) {
      setError('Error al cargar los canjes');
    }
  };

  const createReward = async (reward: Omit<Reward, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      const newReward: Reward = {
        ...reward,
        id: Date.now().toString(),
        createdAt: new Date(),
        createdBy: userId
      };
      setRewards(prev => [newReward, ...prev]);
      return true;
    } catch (err) {
      setError('Error al crear el premio');
      return false;
    }
  };

  const updateReward = async (id: string, updates: Partial<Reward>) => {
    try {
      setRewards(prev => 
        prev.map(reward => 
          reward.id === id ? { ...reward, ...updates } : reward
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar el premio');
      return false;
    }
  };

  const deleteReward = async (id: string) => {
    try {
      setRewards(prev => prev.filter(reward => reward.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el premio');
      return false;
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) throw new Error('Premio no encontrado');

      const newClaim: RewardClaim = {
        id: Date.now().toString(),
        rewardId,
        userId,
        claimedAt: new Date(),
        status: 'pending',
        points: reward.pointsCost
      };

      setClaims(prev => [newClaim, ...prev]);
      return true;
    } catch (err) {
      setError('Error al canjear el premio');
      return false;
    }
  };

  const updateClaimStatus = async (claimId: string, status: RewardClaim['status']) => {
    try {
      setClaims(prev =>
        prev.map(claim =>
          claim.id === claimId ? { ...claim, status } : claim
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar el estado del canje');
      return false;
    }
  };

  const approveClaim = async (claimId: string) => {
    return await updateClaimStatus(claimId, 'approved');
  };

  const rejectClaim = async (claimId: string) => {
    return await updateClaimStatus(claimId, 'rejected');
  };

  return {
    rewards,
    claims,
    stats,
    loading,
    error,
    createReward,
    updateReward,
    deleteReward,
    claimReward,
    updateClaimStatus,
    approveClaim,
    rejectClaim,
    refreshRewards: fetchRewards,
    refreshClaims: fetchClaims
  };
}