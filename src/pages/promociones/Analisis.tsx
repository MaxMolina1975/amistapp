import { PieChart, TrendingUp, FileText } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function Analisis() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Análisis Avanzado
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Informes claros y detallados
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Obtén insights valiosos sobre el desarrollo socioemocional de tus estudiantes
                        con nuestras herramientas de análisis avanzado.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-indigo-50 rounded-lg">
                            <PieChart className="w-8 h-8 text-indigo-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Análisis Integral</h3>
                            <p className="text-sm text-gray-600">
                                Visualización completa del progreso individual y grupal.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-indigo-50 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-indigo-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Tendencias</h3>
                            <p className="text-sm text-gray-600">
                                Identifica patrones y áreas de mejora.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-indigo-50 rounded-lg">
                            <FileText className="w-8 h-8 text-indigo-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Reportes Personalizados</h3>
                            <p className="text-sm text-gray-600">
                                Genera informes detallados según tus necesidades.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-white border border-indigo-100 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-3">Métricas Clave</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Progreso emocional
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Habilidades sociales
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Autorregulación
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-white border border-indigo-100 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-3">Tipos de Informes</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Informes semanales
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Resúmenes mensuales
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Evaluaciones comparativas
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
