import React, { useState } from 'react';
import { Star, X, List, ArrowLeft } from 'lucide-react';
import { SocialEmotionalActions, SocialEmotionalAction } from './SocialEmotionalActions';

interface PointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; type: 'bonus' | 'penalty'; description: string }) => void;
  studentName: string;
}

export function PointsModal({ isOpen, onClose, onSubmit, studentName }: PointsModalProps) {
  const [amount, setAmount] = useState(50);
  const [type, setType] = useState<'bonus' | 'penalty'>('bonus');
  const [description, setDescription] = useState('');
  const [showActionsTable, setShowActionsTable] = useState(false);
  const [selectedAction, setSelectedAction] = useState<SocialEmotionalAction | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      amount: type === 'penalty' ? -amount : amount, 
      type, 
      description: selectedAction 
        ? `${selectedAction.action} - ${description}`.trim() 
        : description 
    });
    onClose();
  };

  const handleSelectAction = (action: SocialEmotionalAction) => {
    setSelectedAction(action);
    setAmount(action.points);
    setDescription(action.message);
    setShowActionsTable(false);
  };

  // Renderiza la tabla de acciones socioemocionales
  if (showActionsTable) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <div className="flex items-center">
              <button 
                onClick={() => setShowActionsTable(false)}
                className="mr-3 p-1 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Seleccionar Acción Socioemocional</h2>
            </div>
            <button onClick={() => setShowActionsTable(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <SocialEmotionalActions 
              onSelectAction={handleSelectAction}
              showSelectionButton={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // Renderiza el modal principal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Gestionar Puntos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-gray-600">
              Asignar puntos a <span className="font-medium">{studentName}</span>
            </p>
          </div>

          {selectedAction && (
            <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{selectedAction.action}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedAction.competence === 'regulacion-emocional' ? 'Regulación emocional' : 
                    selectedAction.competence === 'competencia-social' ? 'Competencia social' : 'Conciencia emocional'}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedAction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setType('bonus')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  type === 'bonus'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                Bonificación
              </button>
              <button
                type="button"
                onClick={() => setType('penalty')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  type === 'penalty'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                Penalización
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de Puntos
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value)))}
              className="w-full p-2 border border-gray-200 rounded-lg"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
              rows={3}
              required
              placeholder="Explica el motivo de los puntos..."
            />
          </div>

          <button
            type="button"
            onClick={() => setShowActionsTable(true)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 flex items-center justify-center hover:bg-gray-50"
          >
            <List className="w-4 h-4 mr-2" />
            Seleccionar de la tabla de acciones
          </button>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Star className="w-4 h-4 mr-2" />
              Asignar Puntos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}