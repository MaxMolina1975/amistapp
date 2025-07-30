import { Users, MessageSquare, Lightbulb } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function Comunidad() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Red de Apoyo
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Comunidad educativa integrada
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Únete a nuestra comunidad de educadores, profesionales y padres comprometidos
                        con el desarrollo socioemocional de los estudiantes.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-pink-50 rounded-lg">
                            <Users className="w-8 h-8 text-pink-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Red de Profesionales</h3>
                            <p className="text-sm text-gray-600">
                                Conecta con educadores y expertos en desarrollo socioemocional.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-pink-50 rounded-lg">
                            <MessageSquare className="w-8 h-8 text-pink-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Foros de Discusión</h3>
                            <p className="text-sm text-gray-600">
                                Participa en conversaciones enriquecedoras sobre educación.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-pink-50 rounded-lg">
                            <Lightbulb className="w-8 h-8 text-pink-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Recursos Compartidos</h3>
                            <p className="text-sm text-gray-600">
                                Accede y comparte materiales educativos de calidad.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-pink-50 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-3">Actividades Comunitarias</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Webinars educativos
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Talleres virtuales
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Grupos de estudio
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-pink-50 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-3">Beneficios</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Apoyo profesional continuo
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Intercambio de experiencias
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Desarrollo profesional
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-pink-100 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Únete a la Comunidad</h3>
                        <p className="text-gray-600">
                            Forma parte de una red de profesionales comprometidos con la educación
                            socioemocional. Comparte experiencias, aprende de otros y contribuye
                            al desarrollo de mejores prácticas educativas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
