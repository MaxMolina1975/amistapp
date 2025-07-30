import React from 'react';
import { Gift, Users, Clock, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface RewardCardProps {
  reward: {
    id: string;
    name: string;
    description: string;
    points: number;
    stock?: number;
    active: boolean;
    expiresAt?: Date;
    claimCount?: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function RewardCard({ reward, onEdit, onDelete }: RewardCardProps) {
  const isExpired = reward.expiresAt && new Date(reward.expiresAt) < new Date();
  const isOutOfStock = reward.stock === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
            <Gift className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{reward.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{reward.points} pts</span>
              {reward.stock !== undefined && (
                <>
                  <span>•</span>
                  <span>Stock: {reward.stock}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {reward.active ? (
            <Badge variant="success">Activo</Badge>
          ) : (
            <Badge variant="danger">Inactivo</Badge>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {reward.claimCount !== undefined && (
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{reward.claimCount} canjes</span>
            </div>
          )}
          {reward.expiresAt && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(reward.expiresAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            icon={<Edit2 className="w-4 h-4" />}
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {(isExpired || isOutOfStock) && (
        <div className="mt-3 bg-red-50 text-red-600 text-sm p-2 rounded-lg">
          {isExpired && "Este premio ha expirado"}
          {isOutOfStock && "No hay stock disponible"}
        </div>
      )}
    </div>
  );
}