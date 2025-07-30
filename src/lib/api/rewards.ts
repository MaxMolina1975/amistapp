import axios from 'axios';
import { Reward, RewardClaim, RewardStats } from '../types';
import { SERVER_CONFIG } from '../../config';

const api = axios.create({
  baseURL: `${SERVER_CONFIG.BASE_URL}/api/rewards`
});

export const rewardsApi = {
  // Get all rewards
  getRewards: () => 
    api.get<Reward[]>('/').then(res => res.data),

  // Get reward statistics
  getStats: () =>
    api.get<RewardStats>('/stats').then(res => res.data),

  // Get teacher reward statistics
  getTeacherRewardsStats: (teacherId: string) =>
    api.get<any>(`/teacher/${teacherId}/stats`).then(res => res.data),

  // Get top points earners
  getTopPointsEarners: (teacherId: string, limit: number = 5) =>
    api.get<any[]>(`/teacher/${teacherId}/top-earners?limit=${limit}`).then(res => res.data),

  // Get pending claims for teacher
  getPendingClaims: (teacherId: string) =>
    api.get<any[]>(`/teacher/${teacherId}/pending-claims`).then(res => res.data),

  // Approve reward claim
  approveRewardClaim: (claimId: string) =>
    api.patch(`/claims/${claimId}/approve`).then(res => res.data),

  // Reject reward claim
  rejectRewardClaim: (claimId: string) =>
    api.patch(`/claims/${claimId}/reject`).then(res => res.data),

  // Create new reward
  createReward: (reward: Omit<Reward, 'id' | 'createdAt' | 'createdBy'>) =>
    api.post<Reward>('/', reward).then(res => res.data),

  // Update reward
  updateReward: (id: string, updates: Partial<Reward>) =>
    api.patch<Reward>(`/${id}`, updates).then(res => res.data),

  // Delete reward
  deleteReward: (id: string) =>
    api.delete(`/${id}`).then(res => res.data),

  // Get user claims
  getClaims: () =>
    api.get<RewardClaim[]>('/claims').then(res => res.data),

  // Create claim
  createClaim: (rewardId: string, points: number) =>
    api.post<RewardClaim>('/claims', { rewardId, points }).then(res => res.data),

  // Update claim status
  updateClaimStatus: (claimId: string, status: RewardClaim['status']) =>
    api.patch<RewardClaim>(`/claims/${claimId}`, { status }).then(res => res.data)
};