import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Gift, Calendar, Package } from 'lucide-react';

interface RewardFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    points: number;
    stock: number;
    expiresAt?: Date;
    active: boolean;
  }) => void;
  initialData?: {
    name: string;
    description: string;
    points: number;
    stock: number;
    expiresAt?: Date;
    active: boolean;
  };
  onCancel: () => void;
  isLoading?: boolean;
}

export function RewardForm({ onSubmit, initialData, onCancel, isLoading }: RewardFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    points: initialData?.points || 100,
    stock: initialData?.stock || 10,
    expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : '',
    active: initialData?.active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      points: Number(formData.points),
      stock: Number(formData.stock),
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Nombre del Premio"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          icon={<Gift className="w-4 h-4" />}
          required
          placeholder="Ej: Día sin uniforme"
        />

        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          placeholder="Describe los detalles del premio..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Puntos Requeridos"
            type="number"
            value={formData.points}
            onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
            min={0}
            required
          />

          <Input
            label="Stock Disponible"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            icon={<Package className="w-4 h-4" />}
            min={0}
            required
          />
        </div>

        <Input
          label="Fecha de Expiración (opcional)"
          type="date"
          value={formData.expiresAt}
          onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
          icon={<Calendar className="w-4 h-4" />}
          min={new Date().toISOString().split('T')[0]}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
          />
          <label htmlFor="active" className="text-sm text-gray-700">
            Premio activo y disponible para canje
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {initialData ? 'Guardar Cambios' : 'Crear Premio'}
        </Button>
      </div>
    </form>
  );
}