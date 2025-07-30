import { BookOpen, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecursosHub() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/tutor/dashboard')}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Panel
                    </button>
                </div>
                
                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Recursos para Tutores</h1>
                    <p className="text-lg text-gray-600 max-w-3xl">Guías y estrategias para el acompañamiento efectivo de adolescentes</p>
                </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Tarjeta para Guía de Tutores */}
                <div 
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/tutor/recursos/guia-tutores');
                    }}
                >
                    <div className="h-3 bg-violet-500"></div>
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mr-4">
                                <Heart className="w-7 h-7 text-violet-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Guía para Tutores</h2>
                        </div>
                        <p className="text-gray-600 mb-5 text-lg">
                            Acompañamiento socioemocional en jóvenes y adolescentes: consejos prácticos para fortalecer el bienestar emocional y construir relaciones saludables.
                        </p>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <span className="text-sm text-violet-600 font-medium">10 consejos prácticos</span>
                            <div className="flex items-center text-violet-500">
                                <span className="mr-2 font-medium">Ver guía</span>
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta para Estrategias de Comunicación */}
                <div 
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/tutor/recursos/estrategias-comunicacion');
                    }}
                >
                    <div className="h-3 bg-blue-500"></div>
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <MessageCircle className="w-7 h-7 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Estrategias de Comunicación</h2>
                        </div>
                        <p className="text-gray-600 mb-5 text-lg">
                            Herramientas avanzadas para una comunicación efectiva en el hogar: técnicas para construir confianza y fortalecer el vínculo con adolescentes.
                        </p>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <span className="text-sm text-blue-600 font-medium">9 estrategias avanzadas</span>
                            <div className="flex items-center text-blue-500">
                                <span className="mr-2 font-medium">Ver estrategias</span>
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-violet-50 rounded-xl shadow-sm border border-violet-100 p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">💡 ¿Por qué es importante?</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                    El acompañamiento socioemocional y la comunicación efectiva son pilares fundamentales para el desarrollo saludable de los adolescentes. Estos recursos te brindarán herramientas prácticas para fortalecer tu rol como tutor y crear un ambiente de confianza y apoyo.
                </p>
            </div>
                
            <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🔍 ¿Cómo usar estos recursos?</h3>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 font-bold">1.</span>
                        <span>Explora cada guía según tus necesidades específicas.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 font-bold">2.</span>
                        <span>Adapta las estrategias al contexto y personalidad de cada adolescente.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 font-bold">3.</span>
                        <span>Practica las técnicas de forma consistente para ver resultados.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 font-bold">4.</span>
                        <span>Comparte tus experiencias con otros tutores para enriquecer el aprendizaje.</span>
                    </li>
                </ul>
            </div>
            </div>
        </div>
    );
}