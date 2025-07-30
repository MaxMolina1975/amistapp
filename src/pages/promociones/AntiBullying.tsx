import { Shield, Heart, Users, AlertTriangle, MessageCircle } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';
import { VideoPlayer } from '../../components/video/VideoPlayer';

export function AntiBullying() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Prevención del Bullying
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        🚫 Dile adiós al bullying: crea un ambiente seguro con buenas prácticas
                    </h2>
                    <p className="text-gray-600 mb-6">
                        El bullying sigue siendo un gran desafío en las escuelas chilenas, afectando el bienestar de los estudiantes. 
                        La mejor forma de combatirlo es promover una cultura de respeto y empatía. Con AmistApp, profesores y alumnos 
                        pueden reforzar conductas positivas, ayudando a prevenir conflictos y fortalecer la convivencia. Cuando los 
                        estudiantes se sienten valorados y parte de una comunidad que los respalda, el acoso escolar pierde fuerza. 
                        Implementar herramientas de reconocimiento y educación socioemocional en el aula es clave para erradicar el 
                        bullying y construir colegios más seguros y felices.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Shield className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Protección</h3>
                            <p className="text-sm text-gray-600">
                                Crea un entorno seguro donde todos los estudiantes se sientan protegidos y respetados.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Heart className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Empatía</h3>
                            <p className="text-sm text-gray-600">
                                Fomenta la comprensión de los sentimientos ajenos y el respeto a la diversidad.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Users className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Comunidad</h3>
                            <p className="text-sm text-gray-600">
                                Construye una comunidad educativa donde todos participan en la prevención del acoso.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        🚫 ¿Qué hacer si observas bullying? Sigue estos 5 pasos
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">1️⃣ No ignores la situación 🚨</h4>
                            <p className="text-sm text-gray-600">
                                El bullying no se detiene solo. Si ves que alguien está siendo acosado, reconoce el problema y actúa. 
                                No pienses que "no es tu asunto", porque tu apoyo puede marcar la diferencia.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">2️⃣ Apoya a la víctima 🤝</h4>
                            <p className="text-sm text-gray-600">
                                Acércate a la persona afectada después del incidente, hazle saber que no está sola y que puede contar contigo. 
                                Un simple "Estoy contigo" puede darle seguridad y confianza.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">3️⃣ No enfrentes al agresor directamente ⚠️</h4>
                            <p className="text-sm text-gray-600">
                                Intervenir de forma agresiva podría empeorar la situación. En vez de eso, intenta desviar la atención, 
                                cambiar el tema o buscar ayuda de un adulto responsable.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">4️⃣ Informa a un adulto o autoridad escolar 🏫</h4>
                            <p className="text-sm text-gray-600">
                                Si el bullying es constante o grave, repórtalo a un profesor, orientador o encargado de convivencia escolar. 
                                No es ser "sapo", es proteger el bienestar de alguien que lo necesita.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">5️⃣ Fomenta un ambiente de respeto 🌍</h4>
                            <p className="text-sm text-gray-600">
                                Habla con otros compañeros sobre la importancia del respeto y la empatía. Si todos trabajan juntos 
                                para rechazar el bullying, será más difícil que continúe.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700">🎥 Video recomendado: "Cómo actuar frente al bullying"</h4>
                        <p className="text-sm text-gray-600 mt-2">
                            💡 Recuerda: Romper el silencio puede salvar a alguien del sufrimiento. Todos podemos ser parte del cambio. 
                            ¡No seas un espectador pasivo! 💪
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Si necesitas consejos más específicos según el contexto (colegio, redes sociales, etc.), 
                            contacta con el equipo de orientación de tu establecimiento. 😊
                        </p>
                        <div className="mt-4">
                            <VideoPlayer 
                                videoUrl="https://www.youtube.com/watch?v=0Ai8_SR8Ncw" 
                                title="Cómo actuar frente al bullying" 
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}