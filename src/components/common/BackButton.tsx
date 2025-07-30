import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    className?: string;
}

export function BackButton({ className = '' }: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${className}`}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
        </button>
    );
}
