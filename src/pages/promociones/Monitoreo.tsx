import { LineChart, Clock, BarChart } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function Monitoreo() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Monitoreo en Tiempo Real
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Seguimiento detallado del progreso
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Mantente al tanto del desarrollo de tus estudiantes con nuestras herramientas
                        de monitoreo en tiempo real.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <LineChart className="w-8 h-8 text-blue-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Progreso Continuo</h3>
                            <p className="text-sm text-gray-600">
                                Visualiza el avance de cada estudiante en tiempo real.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <Clock className="w-8 h-8 text-blue-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Actualizaciones</h3>
                            <p className="text-sm text-gray-600">
                                Recibe notificaciones instantáneas sobre el desempeño.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <BarChart className="w-8 h-8 text-blue-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Estadísticas</h3>
                            <p className="text-sm text-gray-600">
                                Analiza tendencias y patrones de aprendizaje.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
