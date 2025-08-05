import React, { useState } from 'react';
import { Gift, Plus, AlertTriangle } from 'lucide-react';
import { useRewards } from '../lib/hooks/useRewards';
import { Modal } from '../components/ui/Modal';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { RewardForm } from '../components/rewards/RewardForm';
import { RewardCard } from '../components/rewards/RewardCard';
import { ClaimsList } from '../components/rewards/ClaimsList';

export function RewardManagement() {
  // TODO: Get actual teacher ID from auth context
  const { 
    rewards, 
    claims, 
    stats,
    createReward, 
    updateReward, 
    deleteReward,
    updateClaimStatus,
    loading,
    error 
  } = useRewards('teacher123', true);

  const [showNewRewardForm, setShowNewRewardForm] = useState(false);
  const [editingReward, setEditingReward] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    if (editingReward) {
      const success = await updateReward(editingReward.id, data);
      if (success) {
        setEditingReward(null);
      }
    } else {
      const success = await createReward(data);
      if (success) {
        setShowNewRewardForm(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteReward(id);
    if (success) {
      setShowDeleteConfirm(null);
    }
  };

  const handleClaimAction = async (claimId: string, status: 'approved' | 'rejected') => {
    await updateClaimStatus(claimId, status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-6 flex items-center justify-center">
        <div className="text-gray-500">Cargando premios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Premios</h1>
        <p className="text-gray-600">Administra el catálogo de premios</p>
      </header>

      {error && (
        <Alert 
          variant="error" 
          className="mb-6"
          onClose={() => {/* Clear error */}}
        >
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600">Premios Activos</h3>
            <p className="text-2xl font-bold text-violet-600">{stats.activeRewards}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600">Total Canjes</h3>
            <p className="text-2xl font-bold text-violet-600">{stats.totalClaims}</p>
          </div>
        </div>
      )}

      {/* New Reward Button */}
      <Button
        onClick={() => setShowNewRewardForm(true)}
        className="w-full mb-8"
        size="lg"
        icon={<Plus className="w-5 h-5" />}
      >
        Crear Nuevo Premio
      </Button>

      {/* Rewards List */}
      <div className="space-y-4 mb-8">
        {rewards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay premios disponibles</p>
          </div>
        ) : (
          rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              onEdit={() => setEditingReward(reward)}
              onDelete={() => setShowDeleteConfirm(reward.id)}
            />
          ))
        )}
      </div>

      {/* Claims Section */}
      {claims.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Solicitudes de Canje</h2>
          <ClaimsList
            claims={claims}
            onApprove={(id) => handleClaimAction(id, 'approved')}
            onReject={(id) => handleClaimAction(id, 'rejected')}
          />
        </section>
      )}

      {/* Modals */}
      <Modal
        isOpen={showNewRewardForm || editingReward !== null}
        onClose={() => {
          setShowNewRewardForm(false);
          setEditingReward(null);
        }}
        title={editingReward ? 'Editar Premio' : 'Nuevo Premio'}
      >
        <RewardForm
          onSubmit={handleSubmit}
          initialData={editingReward}
          onCancel={() => {
            setShowNewRewardForm(false);
            setEditingReward(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirmar Eliminación"
      >
        <div className="p-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">¿Estás seguro de eliminar este premio?</p>
          </div>
          <p className="text-gray-600 mb-6">
            Esta acción no se puede deshacer y eliminará el premio permanentemente.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}