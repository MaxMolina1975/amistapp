import { School, CheckCircle, AlertTriangle, AlertOctagon, Users, Heart, Brain } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function ModeloEscuelaTotal() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    El Nuevo Modelo de Escuela Total
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        🏫 El Nuevo Modelo de Escuela Total y su Relación con el Bienestar Emocional en AmistApp
                    </h2>
                    <p className="text-gray-600 mb-6">
                        La convivencia escolar es un pilar fundamental en el proceso de aprendizaje. Para fortalecerla, 
                        se ha implementado el Modelo de Escuela Total, que organiza la convivencia en tres niveles, 
                        permitiendo una intervención efectiva y ajustada a las necesidades de cada estudiante.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        📊 ¿Qué indica cada nivel?
                    </h3>

                    {/* Nivel 1 */}
                    <div className="p-6 bg-blue-50 rounded-lg mb-6 border-l-4 border-blue-500">
                        <div className="flex items-start">
                            <CheckCircle className="w-8 h-8 text-blue-500 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">🔵 Nivel 1 (100 a 60 puntos) – Convivencia positiva y autónoma</h4>
                                <p className="text-gray-600 mb-4">
                                    Este nivel representa a los estudiantes que demuestran buen manejo de sus emociones, 
                                    habilidades sociales desarrolladas y alta participación en la comunidad escolar. 
                                    Son alumnos que fomentan el respeto, la empatía y el trabajo en equipo, siendo 
                                    ejemplos positivos dentro del aula.
                                </p>
                                <div className="mb-4">
                                    <h5 className="font-semibold text-gray-700 mb-2">📌 En AmistApp:</h5>
                                    <p className="text-gray-600">
                                        Los estudiantes en este nivel reciben reconocimiento constante por sus logros en 
                                        convivencia y educación socioemocional, reforzando su bienestar emocional y 
                                        motivándolos a seguir siendo líderes positivos.
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">🛠 Estrategias sugeridas:</h5>
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-blue-500 mr-2">✔</span>
                                            <span className="text-gray-600">Seguir reforzando sus logros con premios o reconocimientos.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-500 mr-2">✔</span>
                                            <span className="text-gray-600">Darles roles de liderazgo en actividades grupales.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-500 mr-2">✔</span>
                                            <span className="text-gray-600">Fomentar el apoyo entre pares para que ayuden a estudiantes en niveles inferiores.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nivel 2 */}
                    <div className="p-6 bg-orange-50 rounded-lg mb-6 border-l-4 border-orange-500">
                        <div className="flex items-start">
                            <AlertTriangle className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">🟠 Nivel 2 (59 a 30 puntos) – Riesgo de conflictos y dificultades socioemocionales</h4>
                                <p className="text-gray-600 mb-4">
                                    Este nivel agrupa a estudiantes que pueden presentar dificultades en la regulación emocional, 
                                    la comunicación asertiva o el trabajo en equipo. Si bien no generan grandes conflictos, 
                                    pueden mostrar signos de desmotivación, falta de compromiso o problemas para relacionarse 
                                    con sus compañeros.
                                </p>
                                <div className="mb-4">
                                    <h5 className="font-semibold text-gray-700 mb-2">📌 En AmistApp:</h5>
                                    <p className="text-gray-600">
                                        Aquí es clave el seguimiento y apoyo individual, ya que estos estudiantes pueden 
                                        beneficiarse de intervenciones específicas para mejorar su bienestar emocional 
                                        y su integración en el grupo.
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">🛠 Estrategias sugeridas:</h5>
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">✔</span>
                                            <span className="text-gray-600">Fomentar la participación en actividades de convivencia y refuerzo positivo.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">✔</span>
                                            <span className="text-gray-600">Brindar retroalimentación constructiva y oportunidades para mejorar sus habilidades socioemocionales.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-orange-500 mr-2">✔</span>
                                            <span className="text-gray-600">Utilizar técnicas de aprendizaje cooperativo para reforzar la empatía y el respeto.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nivel 3 */}
                    <div className="p-6 bg-red-50 rounded-lg mb-6 border-l-4 border-red-500">
                        <div className="flex items-start">
                            <AlertOctagon className="w-8 h-8 text-red-500 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">🔴 Nivel 3 (29 a 0 puntos) – Alta vulnerabilidad y necesidad de intervención inmediata</h4>
                                <p className="text-gray-600 mb-4">
                                    Los estudiantes en este nivel pueden estar enfrentando problemas graves de convivencia, 
                                    aislamiento social, dificultades emocionales o incluso ser víctimas o agresores en casos 
                                    de bullying. Es crucial actuar rápidamente para evitar que su bienestar emocional y 
                                    rendimiento académico se vean gravemente afectados.
                                </p>
                                <div className="mb-4">
                                    <h5 className="font-semibold text-gray-700 mb-2">📌 En AmistApp:</h5>
                                    <p className="text-gray-600">
                                        Se activan alertas para que docentes y familias puedan intervenir con estrategias 
                                        específicas de apoyo, seguimiento y contención emocional.
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">🛠 Estrategias sugeridas:</h5>
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-red-500 mr-2">✔</span>
                                            <span className="text-gray-600">Aplicar planes de intervención con especialistas en convivencia escolar o educación emocional.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-red-500 mr-2">✔</span>
                                            <span className="text-gray-600">Crear espacios seguros donde el estudiante pueda expresar sus emociones y recibir apoyo.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-red-500 mr-2">✔</span>
                                            <span className="text-gray-600">Implementar acompañamiento individual con profesores tutores o mediadores.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        🎯 Conclusión
                    </h3>
                    <p className="text-gray-600 mb-6">
                        El Modelo de Escuela Total permite identificar rápidamente las necesidades de cada estudiante, 
                        promoviendo una convivencia saludable. Con AmistApp, este modelo se fortalece, ya que la 
                        aplicación facilita la detección temprana y la intervención oportuna, mejorando el bienestar 
                        emocional de los estudiantes y creando un ambiente escolar más positivo y seguro.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Users className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Comunidad</h3>
                            <p className="text-sm text-gray-600">
                                Fortalece el sentido de pertenencia y la participación activa en la comunidad escolar.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Heart className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Bienestar</h3>
                            <p className="text-sm text-gray-600">
                                Promueve el bienestar emocional y la salud mental de todos los estudiantes.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Brain className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Aprendizaje</h3>
                            <p className="text-sm text-gray-600">
                                Mejora el rendimiento académico al crear un ambiente propicio para el aprendizaje.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700">💡 ¡Con AmistApp, transformemos la convivencia escolar con datos y acciones concretas! 🚀</h4>
                        <p className="text-sm text-gray-600 mt-2">
                            Implementa el Modelo de Escuela Total en tu establecimiento y observa cómo mejora el clima escolar, 
                            el bienestar emocional y el rendimiento académico de tus estudiantes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}