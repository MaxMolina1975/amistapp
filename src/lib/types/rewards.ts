export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: RewardCategory;
  imageUrl?: string;
  available: boolean;
  unlimited: boolean;
  remainingQuantity?: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type RewardCategory = 'material' | 'experience' | 'privilege' | 'digital';

export const mockRewards: Reward[] = [
  {
    id: 'rew-001',
    title: 'Libro a elección',
    description: 'El estudiante puede elegir un libro de la colección del aula para llevarse a casa durante una semana.',
    pointsCost: 150,
    category: 'material',
    imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    available: true,
    unlimited: true,
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-03-01T15:30:00Z'
  },
  {
    id: 'rew-002',
    title: 'Tiempo libre',
    description: '15 minutos extra de recreo para el estudiante y dos amigos que elija.',
    pointsCost: 100,
    category: 'privilege',
    available: true,
    unlimited: true,
    createdAt: '2025-02-10T09:15:00Z',
    updatedAt: '2025-02-10T09:15:00Z'
  },
  {
    id: 'rew-003',
    title: 'Ayudante del profesor',
    description: 'Ser asistente del profesor durante un día completo de clase.',
    pointsCost: 200,
    category: 'experience',
    available: true,
    unlimited: true,
    createdAt: '2025-02-20T11:30:00Z',
    updatedAt: '2025-02-20T11:30:00Z'
  },
  {
    id: 'rew-004',
    title: 'Juego digital educativo',
    description: 'Código para descargar un juego educativo en la tablet o computadora.',
    pointsCost: 300,
    category: 'digital',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z2FtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    available: true,
    unlimited: false,
    remainingQuantity: 5,
    createdAt: '2025-03-05T14:45:00Z',
    updatedAt: '2025-03-15T16:20:00Z'
  },
  {
    id: 'rew-005',
    title: 'Certificado de Excelencia',
    description: 'Certificado personalizado y enmarcado que reconoce el logro del estudiante.',
    pointsCost: 250,
    category: 'material',
    available: true,
    unlimited: true,
    createdAt: '2025-01-30T08:00:00Z',
    updatedAt: '2025-01-30T08:00:00Z'
  },
  {
    id: 'rew-006',
    title: 'Clase de cocina especial',
    description: 'Participar en una clase especial de cocina donde aprenderán a preparar postres saludables.',
    pointsCost: 350,
    category: 'experience',
    imageUrl: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y29va2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    available: true,
    unlimited: false,
    remainingQuantity: 8,
    expiresAt: '2025-05-30T23:59:59Z',
    createdAt: '2025-03-10T10:30:00Z',
    updatedAt: '2025-03-10T10:30:00Z'
  },
  {
    id: 'rew-007',
    title: 'Día sin uniforme',
    description: 'El estudiante puede venir a clase un día sin el uniforme escolar (ropa apropiada).',
    pointsCost: 150,
    category: 'privilege',
    available: true,
    unlimited: true,
    createdAt: '2025-02-25T13:20:00Z',
    updatedAt: '2025-02-25T13:20:00Z'
  },
  {
    id: 'rew-008',
    title: 'Suscripción a biblioteca digital',
    description: 'Acceso durante un mes a una biblioteca digital con cientos de libros para todas las edades.',
    pointsCost: 400,
    category: 'digital',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1681487441850-fb21c22f5c48?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlnaXRhbCUyMGxpYnJhcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    available: true,
    unlimited: false,
    remainingQuantity: 3,
    createdAt: '2025-03-12T09:45:00Z',
    updatedAt: '2025-03-14T11:10:00Z'
  }
];
