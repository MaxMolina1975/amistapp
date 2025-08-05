import { Heart, Brain, Users, Ear, Sparkles, MessageCircle, Shield, Smartphone, Leaf, School } from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';
import { VideoPlayer } from '../../../components/video/VideoPlayer';

export function GuiaTutores() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Guía para Tutores: Acompañamiento Socioemocional
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        📘 Guía para Tutores: Acompañamiento Socioemocional en Jóvenes y Adolescentes
                    </h2>
                    
                    <div className="p-5 bg-blue-50 rounded-lg mb-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">🔹 ¿Por qué es importante el acompañamiento socioemocional?</h3>
                        <p className="text-gray-700 mb-4">
                            La adolescencia es una etapa de cambios emocionales, sociales y cognitivos. Un tutor comprometido puede ser clave en el desarrollo del bienestar emocional y en la construcción de relaciones saludables.
                        </p>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        🔑 Consejos para un acompañamiento efectivo
                    </h3>

                    {/* Consejo 1 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Ear className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">1️⃣ Escucha activa y sin juicios 👂</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Valida sus emociones sin minimizar sus preocupaciones.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Usa frases como: "Te escucho", "Entiendo que esto es importante para ti", "Cuéntame más sobre lo que sientes".</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 2 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Brain className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">2️⃣ Fomenta la regulación emocional 🌊</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Enséñales estrategias para manejar el estrés, como la respiración profunda o el mindfulness.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Anima a que expresen sus emociones con palabras, en lugar de actuar impulsivamente.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 3 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Sparkles className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">3️⃣ Refuerza la autoestima y la confianza 💪</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Destaca sus logros y esfuerzos en lugar de solo sus errores.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Evita comparaciones con otros y fomenta su identidad única.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 4 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <MessageCircle className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">4️⃣ Promueve la comunicación abierta 🗣</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Crea un ambiente donde se sientan seguros para hablar sin miedo a ser juzgados.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Usa preguntas abiertas: "¿Cómo te sentiste hoy en el colegio?" en vez de "¿Te fue bien?".</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 5 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Users className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">5️⃣ Enséñales habilidades sociales 🤝</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Modela conductas de empatía y respeto en tus propias interacciones.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Practiquen juntos la resolución de conflictos con el método: "Detente, Piensa, Actúa".</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 6 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Shield className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">6️⃣ Establece límites saludables 🚦</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Explica el por qué de las reglas en lugar de imponerlas arbitrariamente.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Sé flexible cuando sea necesario, pero firme en lo esencial.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 7 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Smartphone className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">7️⃣ Fomenta un uso saludable de la tecnología 📱</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Acuerda horarios para redes sociales y videojuegos sin prohibiciones extremas.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Enséñales sobre ciberseguridad y convivencia digital positiva.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 8 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Leaf className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">8️⃣ Sé un ejemplo de bienestar emocional 🌿</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Gestiona tus propias emociones de manera saludable para que ellos aprendan con tu ejemplo.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Comparte tus experiencias de crecimiento personal para generar confianza.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 9 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Heart className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">9️⃣ Incentiva el autocuidado y la vida saludable 🏃‍♂️🥗</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Anima hábitos como la actividad física, el descanso adecuado y la alimentación balanceada.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Pregunta: "¿Qué hiciste hoy para cuidar tu bienestar?".</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Consejo 10 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <School className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">🔟 Busca apoyo si es necesario 🏫</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Si notas cambios drásticos en su estado de ánimo o comportamiento, busca ayuda profesional.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">La orientación escolar, psicólogos o terapeutas pueden ser aliados clave.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Conclusión */}
                    <div className="p-5 bg-green-50 rounded-lg mb-6 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Conclusión</h3>
                        <p className="text-gray-700 mb-4">
                            El acompañamiento socioemocional no significa resolver sus problemas, sino estar presente, guiar y brindar herramientas para que puedan afrontar sus desafíos de manera positiva. ¡Tu rol como tutor puede marcar la diferencia en su bienestar y futuro!
                        </p>
                        <p className="text-gray-700 italic">
                            💡 "Escuchar, comprender y acompañar son las claves para fortalecer su mundo emocional." 💖
                        </p>
                    </div>

                    {/* Video recomendado */}
                    <div className="mt-8 p-5 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">🎥 Video recomendado</h4>
                        <p className="text-gray-700 mb-4">
                            "Cómo ayudar a adolescentes a gestionar sus emociones"
                        </p>
                        <div className="aspect-w-16 aspect-h-9">
                            <VideoPlayer 
                                videoUrl="https://www.youtube.com/watch?v=mFQ4YRmBeMI" 
                                title="Cómo ayudar a adolescentes a gestionar sus emociones" 
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}