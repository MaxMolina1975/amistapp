import React from 'react';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ClaimsListProps {
  claims: Array<{
    id: string;
    userId: string;
    rewardId: string;
    claimedAt: Date;
    status: 'pending' | 'approved' | 'rejected' | 'delivered';
    points: number;
    user?: {
      fullName: string;
    };
    reward?: {
      name: string;
    };
  }>;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
}

export function ClaimsList({ claims, onApprove, onReject }: ClaimsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" icon={<Clock className="w-4 h-4" />}>Pendiente</Badge>;
      case 'approved':
        return <Badge variant="success" icon={<CheckCircle className="w-4 h-4" />}>Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="danger" icon={<XCircle className="w-4 h-4" />}>Rechazado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div key={claim.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  {claim.user?.fullName || 'Usuario'}
                </h3>
                <p className="text-sm text-gray-500">
                  {claim.reward?.name || 'Premio'} • {claim.points} pts
                </p>
              </div>
            </div>
            {getStatusBadge(claim.status)}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Solicitado: {new Date(claim.claimedAt).toLocaleDateString()}
            </p>
            
            {claim.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(claim.id)}
                  icon={<XCircle className="w-4 h-4" />}
                >
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApprove(claim.id)}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  Aprobar
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {claims.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay solicitudes de canje pendientes
        </div>
      )}
    </div>
  );
}