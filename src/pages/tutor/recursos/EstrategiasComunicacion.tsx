import { Scale, Pause, RefreshCw, ClipboardList, Repeat2, Ban, Users, MessageSquare, BookOpen, Target } from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';
import { VideoPlayer } from '../../../components/video/VideoPlayer';

export function EstrategiasComunicacion() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Estrategias Avanzadas para una Comunicación Efectiva
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        📢 Guía para Tutores: Estrategias Avanzadas para una Comunicación Efectiva en el Hogar
                    </h2>
                    
                    <div className="p-5 bg-blue-50 rounded-lg mb-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">🔹 Más allá de hablar: construir confianza a través del diálogo</h3>
                        <p className="text-gray-700 mb-4">
                            La comunicación efectiva no es solo sobre lo que decimos, sino cómo lo decimos y cómo hacemos que el otro se sienta. Aquí te presentamos herramientas avanzadas para fortalecer el vínculo con jóvenes y adolescentes en el hogar.
                        </p>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        🔑 Herramientas para una comunicación efectiva sin repetir lo básico
                    </h3>

                    {/* Estrategia 1 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Scale className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">1️⃣ Aplica la "Regla del 5:1" para mantener el equilibrio emocional ⚖</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Por cada corrección o crítica, asegúrate de haber hecho cinco comentarios positivos previamente.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Esto evita que se sientan atacados y refuerza la autoestima.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Ejemplo: "Me gusta cómo organizaste tu tiempo hoy. ¿Podemos hablar sobre cómo mejorar esa tarea que quedó pendiente?".</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 2 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Pause className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">2️⃣ Crea una "Palabra Clave" para evitar discusiones explosivas 🚦</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Acuerden una palabra o señal que cualquiera pueda usar cuando una conversación se vuelva tensa.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Sirve para pausar y retomar el tema cuando ambos estén más tranquilos.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Ejemplo: Si la palabra clave es "pausa", significa que necesitan un descanso antes de seguir hablando.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 3 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <RefreshCw className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">3️⃣ Utiliza la técnica de "Cambio de Perspectiva" 🔄</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Pregunta: "Si estuvieras en mi lugar, ¿qué harías?" o "¿Cómo crees que me siento con esto?".</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Esto fomenta la empatía y ayuda a que vean la situación desde otro punto de vista.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 4 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <ClipboardList className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">4️⃣ Comunica expectativas en lugar de órdenes 📜</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">En vez de "Tienes que limpiar tu pieza ahora", prueba con "Me gustaría que organizáramos los espacios juntos. ¿A qué hora podrías hacerlo?".</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">De esta forma, sienten que tienen más autonomía y responsabilidad.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 5 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Repeat2 className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">5️⃣ Usa la "Técnica del Espejo" para mejorar la comprensión 🪞</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">En vez de corregir inmediatamente, repite lo que dijeron con otras palabras para confirmar que entendiste.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Ejemplo:</span>
                                    </li>
                                    <li className="flex items-start pl-6">
                                        <span className="text-gray-700">🧒 "Me molesta que nunca confíes en mí."</span>
                                    </li>
                                    <li className="flex items-start pl-6">
                                        <span className="text-gray-700">👨‍👩‍👦 "Sientes que no te doy suficiente independencia. ¿Es así?"</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Esto ayuda a que se sientan comprendidos y reduce la resistencia en la conversación.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 6 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Ban className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">6️⃣ Evita las palabras absolutas ("siempre", "nunca") ⛔</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Decir "Nunca me ayudas en casa" o "Siempre llegas tarde" provoca rechazo y defensividad.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">En su lugar, di: "Últimamente he notado que no has ayudado mucho. ¿Cómo podemos cambiar eso?".</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 7 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Users className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">7️⃣ Usa "Reuniones Familiares Breves" para resolver conflictos 🤝</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Una vez a la semana, dedica 10-15 minutos para hablar sobre lo que está funcionando y lo que se puede mejorar en la convivencia.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Establece reglas básicas: todos pueden hablar, nadie interrumpe, y no se juzga.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 8 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <MessageSquare className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">8️⃣ Reformula críticas en sugerencias concretas 🏗</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">En vez de decir: "Eres muy desordenado", di "Si organizas tu escritorio, te será más fácil encontrar lo que necesitas".</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Esto hace que la conversación sea más productiva y menos confrontacional.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 9 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <BookOpen className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">9️⃣ Usa "Historias Personales" para conectar y enseñar 📖</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">En lugar de dar sermones, comparte una experiencia tuya: "Cuando tenía tu edad, también me costaba organizar mi tiempo. Algo que me ayudó fue...".</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Esto humaniza la conversación y la hace más accesible.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Estrategia 10 */}
                    <div className="p-5 bg-violet-50 rounded-lg mb-5 border-l-4 border-violet-500">
                        <div className="flex items-start">
                            <Target className="w-8 h-8 text-violet-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">🔟 Refuerza el sentido de equipo con metas familiares 🎯</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Plantea objetivos en conjunto, como "Este mes trabajaremos en ser más puntuales".</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-violet-600 mr-2">📌</span>
                                        <span className="text-gray-700">Celebra los avances en lugar de enfocarte solo en lo que falta mejorar.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Conclusión */}
                    <div className="p-5 bg-green-50 rounded-lg mb-6 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Conclusión</h3>
                        <p className="text-gray-700 mb-4">
                            La comunicación efectiva en el hogar no se trata solo de hablar bien, sino de generar un ambiente donde todos se sientan escuchados, comprendidos y respetados. Con estas herramientas, lograrás construir un diálogo más fluido y fortalecer la relación con los adolescentes.
                        </p>
                        <p className="text-gray-700 italic">
                            💡 "Cuando cambiamos la forma en que nos comunicamos, cambiamos la forma en que nos relacionamos." 💖
                        </p>
                    </div>

                    {/* Video recomendado */}
                    <div className="mt-8 p-5 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">🎥 Video recomendado</h4>
                        <p className="text-gray-700 mb-4">
                            "Cómo hablar con adolescentes sin discutir"
                        </p>
                        <div className="aspect-w-16 aspect-h-9 rounded-lg">
                            <VideoPlayer 
                                videoUrl="https://www.youtube.com/watch?v=zFLW8s2o2S4" 
                                title="Cómo hablar con adolescentes sin discutir" 
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}