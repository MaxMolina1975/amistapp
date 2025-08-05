import { Heart, Brain, Users } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function AprendizajeEmocional() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Aprendizaje Socioemocional
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Desarrolla habilidades sociales y emocionales
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Nuestro programa de aprendizaje socioemocional está diseñado para ayudar a los estudiantes
                        a desarrollar habilidades esenciales para su bienestar y éxito académico.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Heart className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Inteligencia Emocional</h3>
                            <p className="text-sm text-gray-600">
                                Aprende a reconocer y gestionar emociones de manera efectiva.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Brain className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Autorregulación</h3>
                            <p className="text-sm text-gray-600">
                                Desarrolla habilidades para manejar el estrés y la ansiedad.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Users className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Habilidades Sociales</h3>
                            <p className="text-sm text-gray-600">
                                Mejora tus relaciones interpersonales y trabajo en equipo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
