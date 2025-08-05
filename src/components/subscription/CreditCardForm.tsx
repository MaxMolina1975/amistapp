import React from 'react';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CreditCardFormProps {
  onSubmit: (data: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
  }) => void;
  isLoading?: boolean;
}

export function CreditCardForm({ onSubmit, isLoading }: CreditCardFormProps) {
  const [formData, setFormData] = React.useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Número de Tarjeta"
        value={formData.cardNumber}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          cardNumber: formatCardNumber(e.target.value)
        }))}
        maxLength={19}
        placeholder="1234 5678 9012 3456"
        icon={<CreditCard className="w-4 h-4" />}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fecha de Vencimiento"
          value={formData.expiryDate}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            expiryDate: formatExpiryDate(e.target.value)
          }))}
          maxLength={5}
          placeholder="MM/YY"
          icon={<Calendar className="w-4 h-4" />}
          required
        />

        <Input
          label="CVV"
          value={formData.cvv}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            cvv: e.target.value.replace(/[^0-9]/g, '')
          }))}
          maxLength={4}
          type="password"
          placeholder="123"
          icon={<Lock className="w-4 h-4" />}
          required
        />
      </div>

      <Input
        label="Titular de la Tarjeta"
        value={formData.cardHolder}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          cardHolder: e.target.value.toUpperCase()
        }))}
        placeholder="NOMBRE COMO APARECE EN LA TARJETA"
        required
      />

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          Renovar Suscripción
        </Button>
      </div>
    </form>
  );
}