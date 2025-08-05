import { Heart, Users, Brain, CheckCircle, BarChart } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';
import { VideoPlayer } from '../../components/video/VideoPlayer';

export function ConvivenciaEducativa() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Mejora la Convivencia Educativa
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        📱 Tecnología para un aula más positiva
                    </h2>
                    <p className="text-gray-600 mb-6">
                        La convivencia escolar es clave para el aprendizaje y el bienestar de los estudiantes. 
                        Sin embargo, muchos profesores enfrentan desafíos para motivar a sus alumnos y crear 
                        un ambiente de respeto y colaboración. AmistApp surge como una solución innovadora, 
                        utilizando el refuerzo positivo para transformar la dinámica en el aula.
                    </p>
                    <p className="text-gray-600 mb-6">
                        Con AmistApp, los profesores pueden registrar a sus estudiantes y reconocer sus avances 
                        en habilidades socioemocionales, premiando acciones como el respeto, la empatía y el trabajo 
                        en equipo. Los estudiantes también pueden valorar a sus compañeros, fomentando una cultura 
                        de apoyo y reconocimiento mutuo.
                    </p>
                    <p className="text-gray-600 mb-6">
                        Además, la aplicación permite a los docentes y familias monitorear indicadores de convivencia 
                        para identificar áreas de mejora y reforzar buenas prácticas. Gracias a su enfoque basado en 
                        la educación emocional y la gamificación, AmistApp convierte el aprendizaje en una experiencia 
                        motivadora y positiva para todos.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Heart className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Respeto y Empatía</h3>
                            <p className="text-sm text-gray-600">
                                Fomenta la capacidad de ponerse en el lugar del otro y valorar la diversidad.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Users className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Trabajo en Equipo</h3>
                            <p className="text-sm text-gray-600">
                                Promueve la colaboración y la resolución conjunta de tareas y desafíos.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Brain className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Resolución de Conflictos</h3>
                            <p className="text-sm text-gray-600">
                                Desarrolla estrategias para enfrentar diferencias sin recurrir a la violencia.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        🔍 ¿Qué mide AmistApp en la convivencia escolar?
                    </h3>

                    <div className="space-y-4 mb-8">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✔ Respeto y empatía</h4>
                            <p className="text-sm text-gray-600">
                                Evaluación de la interacción entre estudiantes y su capacidad para ponerse en el lugar del otro.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✔ Trabajo en equipo y colaboración</h4>
                            <p className="text-sm text-gray-600">
                                Seguimiento de cómo los alumnos cooperan y resuelven tareas en conjunto.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✔ Responsabilidad y autonomía</h4>
                            <p className="text-sm text-gray-600">
                                Registro de conductas relacionadas con la toma de decisiones responsables y la gestión de emociones.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✔ Resolución pacífica de conflictos</h4>
                            <p className="text-sm text-gray-600">
                                Análisis de estrategias que utilizan los estudiantes para enfrentar diferencias sin recurrir a la violencia.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✔ Participación y sentido de comunidad</h4>
                            <p className="text-sm text-gray-600">
                                Medición del nivel de involucramiento de los estudiantes en actividades grupales y su compromiso con la convivencia escolar.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        📈 Asociación con los IDPS: Más allá del comportamiento individual
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                        En Chile, los Indicadores de Desarrollo Personal y Social (IDPS) son fundamentales para evaluar 
                        aspectos del desarrollo integral de los estudiantes. AmistApp ayuda a mejorar estos indicadores 
                        al registrar y premiar acciones positivas que impactan en áreas como:
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✅ Clima de convivencia escolar</h4>
                            <p className="text-sm text-gray-600">
                                Generación de un entorno seguro y positivo dentro del aula.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✅ Hábitos de vida saludable</h4>
                            <p className="text-sm text-gray-600">
                                Fomento del autocuidado, la alimentación equilibrada y la actividad física.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✅ Compromiso y motivación escolar</h4>
                            <p className="text-sm text-gray-600">
                                Estímulo a la participación activa y la valoración del aprendizaje.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">✅ Asistencia y puntualidad</h4>
                            <p className="text-sm text-gray-600">
                                Refuerzo del compromiso con la educación a través del reconocimiento de la responsabilidad.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700">🎥 Video recomendado: "¿Qué son los IDPS y por qué son clave en la educación?"</h4>
                        <VideoPlayer 
                            videoUrl="https://www.youtube.com/watch?v=QnEz0cGeeJI" 
                            className="mt-4"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                            💡 Recuerda: La convivencia positiva no solo mejora el bienestar emocional, sino que también 
                            impacta directamente en el rendimiento académico y el desarrollo integral de los estudiantes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}