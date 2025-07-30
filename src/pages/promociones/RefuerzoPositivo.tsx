import { Award, Star, Users } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export function RefuerzoPositivo() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Refuerzo Positivo en el Aula
                </h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        📢 Convierte tu aula en un espacio de motivación con refuerzo positivo
                    </h2>
                    <p className="text-gray-600 mb-6">
                        El refuerzo positivo es una herramienta clave para transformar la convivencia escolar. 
                        En lugar de enfocarnos en castigos, podemos motivar a los estudiantes reconociendo sus 
                        logros y buenas acciones. Con AmistApp, los profesores pueden premiar valores como el 
                        respeto, la responsabilidad y la colaboración, generando un ambiente más armonioso y 
                        motivador. Además, los propios estudiantes pueden reconocer a sus compañeros, reforzando 
                        un clima de apoyo y crecimiento. Cuando las buenas conductas se destacan, se convierten 
                        en hábitos, y el aula se transforma en un espacio donde todos quieren participar.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Award className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Reconocimiento</h3>
                            <p className="text-sm text-gray-600">
                                Premia los logros y esfuerzos de tus estudiantes de forma consistente.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Star className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Motivación</h3>
                            <p className="text-sm text-gray-600">
                                Impulsa el deseo de aprender y participar a través de incentivos positivos.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <Users className="w-8 h-8 text-violet-500 mb-3" />
                            <h3 className="font-semibold text-gray-700 mb-2">Comunidad</h3>
                            <p className="text-sm text-gray-600">
                                Crea un ambiente de apoyo mutuo donde los estudiantes se reconocen entre sí.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        10 Consejos para implementar el refuerzo positivo
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">1️⃣ Reconoce los pequeños logros 🎉</h4>
                            <p className="text-sm text-gray-600">
                                No esperes grandes acciones para felicitar a tus estudiantes. Un simple "¡Buen trabajo!" por su esfuerzo marcará la diferencia.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">2️⃣ Usa palabras de aliento constantemente 💬</h4>
                            <p className="text-sm text-gray-600">
                                Frases como "Confío en ti", "Sé que puedes hacerlo" o "Me gusta cómo trabajaste en esto" refuerzan la seguridad y motivación.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">3️⃣ Establece un sistema de recompensas 🏅</h4>
                            <p className="text-sm text-gray-600">
                                Puedes usar stickers, estrellas o puntos en AmistApp para reconocer a los estudiantes por sus buenas actitudes y comportamientos.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">4️⃣ Permite que los estudiantes se premien entre ellos 🤝</h4>
                            <p className="text-sm text-gray-600">
                                Fomentar el reconocimiento entre compañeros ayuda a fortalecer la comunidad y la empatía en el aula.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">5️⃣ Celebra el esfuerzo, no solo el resultado 🔥</h4>
                            <p className="text-sm text-gray-600">
                                Alienta a los estudiantes a seguir intentando, destacando su perseverancia en lugar de solo los logros finales.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">6️⃣ Crea rutinas de reconocimiento diario 📅</h4>
                            <p className="text-sm text-gray-600">
                                Dedica unos minutos al final del día para que los estudiantes compartan algo positivo sobre sus compañeros.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">7️⃣ Proporciona incentivos personalizados 🎯</h4>
                            <p className="text-sm text-gray-600">
                                Algunos estudiantes se motivan con elogios, otros con pequeñas recompensas o responsabilidades especiales. Conoce qué funciona mejor para cada uno.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">8️⃣ Convierte los errores en oportunidades de aprendizaje 🔄</h4>
                            <p className="text-sm text-gray-600">
                                Usa frases como "¿Qué aprendimos de esto?" en lugar de regaños, para que los estudiantes vean los errores como parte del proceso.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">9️⃣ Usa juegos y dinámicas para reforzar el comportamiento positivo 🎲</h4>
                            <p className="text-sm text-gray-600">
                                Gamificar el aula hace que los estudiantes se involucren más y disfruten aprender con refuerzos positivos.
                            </p>
                        </div>

                        <div className="p-4 bg-violet-50 rounded-lg">
                            <h4 className="font-semibold text-gray-700">🔟 Da el ejemplo con una actitud positiva 😊</h4>
                            <p className="text-sm text-gray-600">
                                Los estudiantes aprenden por imitación. Si ven que tú también usas refuerzo positivo con ellos y con otros, harán lo mismo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}