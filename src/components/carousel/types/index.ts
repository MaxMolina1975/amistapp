export interface Promotion {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    link: string;  // Ruta a la subpágina
    category?: 'feature' | 'news' | 'update';
    badge?: string;
}
