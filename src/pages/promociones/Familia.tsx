import { Home, MessageCircle, Calendar } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function Familia() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Conexión Familiar
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Integra a la familia en el aprendizaje
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Mantén a los padres y tutores involucrados activamente en el proceso 
                        de aprendizaje socioemocional de sus hijos.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <Home className="w-8 h-8 text-green-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Portal Familiar</h3>
                            <p className="text-sm text-gray-600">
                                Acceso exclusivo para padres y tutores con información actualizada.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg">
                            <MessageCircle className="w-8 h-8 text-green-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Comunicación Directa</h3>
                            <p className="text-sm text-gray-600">
                                Mensajería instantánea con docentes y profesionales.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg">
                            <Calendar className="w-8 h-8 text-green-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Actividades Familiares</h3>
                            <p className="text-sm text-gray-600">
                                Calendario de actividades y ejercicios para realizar en casa.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-green-100 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Beneficios de la Participación Familiar</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Mayor compromiso en el aprendizaje</li>
                            <li>Mejor comunicación entre escuela y hogar</li>
                            <li>Desarrollo integral del estudiante</li>
                            <li>Fortalecimiento de vínculos familiares</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
