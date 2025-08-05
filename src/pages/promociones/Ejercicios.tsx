import { Play, Book, Award } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function Ejercicios() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Ejercicios Dinámicos
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Actividades interactivas diarias
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Explora nuestra colección de ejercicios interactivos diseñados para 
                        desarrollar habilidades socioemocionales de forma divertida y efectiva.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <Play className="w-8 h-8 text-orange-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Actividades Interactivas</h3>
                            <p className="text-sm text-gray-600">
                                Juegos y ejercicios diseñados para el aprendizaje activo.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <Book className="w-8 h-8 text-orange-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Recursos Educativos</h3>
                            <p className="text-sm text-gray-600">
                                Material didáctico adaptado a diferentes niveles.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <Award className="w-8 h-8 text-orange-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Sistema de Logros</h3>
                            <p className="text-sm text-gray-600">
                                Reconocimientos por completar actividades y alcanzar metas.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold text-gray-700 mb-4">Categorías de Ejercicios</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-2">Ejercicios de Autoconocimiento</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    <li>Identificación de emociones</li>
                                    <li>Expresión emocional</li>
                                    <li>Reflexión personal</li>
                                </ul>
                            </div>
                            
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-2">Ejercicios de Interacción</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    <li>Trabajo en equipo</li>
                                    <li>Comunicación efectiva</li>
                                    <li>Resolución de conflictos</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-orange-100 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">¿Cómo Empezar?</h3>
                        <ol className="list-decimal list-inside text-gray-600 space-y-2">
                            <li>Selecciona tu nivel de inicio</li>
                            <li>Explora las actividades disponibles</li>
                            <li>Completa los ejercicios diarios</li>
                            <li>Realiza un seguimiento de tu progreso</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
