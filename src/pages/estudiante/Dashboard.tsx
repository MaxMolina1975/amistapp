import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { BookOpen, Activity, Users, Award, Calendar, Settings, MessageSquare, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatNotification from '../../components/chat/ChatNotification';
import RecentContacts from '../../components/chat/RecentContacts';
import StudentChat from "../../components/chat/StudentChat";
import { PromotionCarousel } from '../../components/carousel';
import '../../components/carousel/styles/carousel.css';

interface StudentData {
    name: string;
    grade: string;
    school: string;
    progress: number;
    nextActivity?: string;
}

export function EstudianteDashboard() {
    const { currentUser } = useAuth();
    const [studentData, setStudentData] = useState<StudentData>({
        name: '',
        grade: '',
        school: '',
        progress: 0
    });

    useEffect(() => {
        // Aquí cargaríamos los datos del estudiante desde Firebase
        // Por ahora usamos datos de ejemplo
        setStudentData({
            name: 'Estudiante Ejemplo',
            grade: '6° Básico',
            school: 'Escuela Ejemplo',
            progress: 75,
            nextActivity: 'Ejercicio de autorregulación emocional'
        });
    }, [currentUser]);

    const menuItems = [
        {
            icon: <Activity className="w-8 h-8" />,
            title: 'Actividades',
            description: 'Ejercicios y tareas pendientes',
            link: '/estudiante/actividades',
            color: 'bg-blue-500'
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Compañeros',
            description: 'Interactúa con tu clase',
            link: '/estudiante/compañeros',
            color: 'bg-green-500'
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: 'Logros',
            description: 'Tus medallas y progreso',
            link: '/estudiante/logros',
            color: 'bg-yellow-500'
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: 'Calendario',
            description: 'Próximas actividades',
            link: '/estudiante/calendario',
            color: 'bg-purple-500'
        },
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: 'Mensajes',
            description: 'Chats privados',
            link: '/mensajes',
            color: 'bg-pink-500',
            notification: <ChatNotification variant="badge" />
        },
        {
            icon: <Settings className="w-8 h-8" />,
            title: 'Configuración',
            description: 'Ajusta tu perfil',
            link: '/estudiante/configuracion',
            color: 'bg-gray-500'
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'Acciones Socioemocionales',
            description: 'Recursos para el bienestar emocional',
            link: '/estudiante/resources/social-emotional-actions', // Asegúrate que esta ruta exista o créala
            color: 'bg-pink-100' // Usando un color similar al del dashboard del profesor, puedes ajustarlo
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <BookOpen className="h-10 w-10 text-violet-600" />
                            <h1 className="ml-3 text-2xl font-bold text-gray-900">
                                Bienvenido, {studentData.name}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">{studentData.grade}</p>
                            <p className="text-sm text-gray-600">{studentData.school}</p>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Tarjeta de Puntos (estilo tarjeta de crédito en miniatura) */}
            <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 max-w-xs mx-auto">
                    <div className="p-3 relative">
                        {/* Efecto de brillo en la esquina */}
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mt-6 -mr-6"></div>
                        
                        {/* Chip de tarjeta */}
                        <div className="absolute top-3 left-3 w-8 h-5 bg-yellow-200 opacity-80 rounded-sm"></div>
                        
                        <div className="mt-6 mb-1">
                            <p className="text-xs text-yellow-100 uppercase tracking-wider">Puntos Amistapp</p>
                            <div className="flex items-center mt-1">
                                <Award className="h-5 w-5 text-white mr-1" />
                                <p className="text-2xl font-bold text-white">185</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-white mt-2 mb-1">
                            <div>
                                <p className="font-semibold">3</p>
                                <p className="text-yellow-100">Logros</p>
                            </div>
                            <div>
                                <p className="font-semibold">5</p>
                                <p className="text-yellow-100">Pendientes</p>
                            </div>
                            <div>
                                <button className="bg-white text-yellow-500 hover:bg-yellow-100 text-xs font-medium py-1 px-2 rounded-full transition-colors">
                                    Ranking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Promotion Carousel */}
            <div className="mb-8 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Novedades y Características</h2>
                <PromotionCarousel />
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Progress Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tu Progreso</h2>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-violet-600 bg-violet-200">
                                    Avance
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-violet-600">
                                    {studentData.progress}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-violet-200">
                            <div
                                style={{ width: `${studentData.progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500 transition-all duration-500"
                            ></div>
                        </div>
                    </div>
                    {studentData.nextActivity && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                Próxima actividad: {studentData.nextActivity}
                            </p>
                        </div>
                    )}
                </div>

                {/* Contactos recientes */}
                <div className="mt-8">
                    <RecentContacts title="Contactos recientes" filter="all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        {/* Menu Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {menuItems.map((item, index) => (
                                <Link 
                                    to={item.link} 
                                    key={index}
                                    className="bg-white hover:bg-gray-50 rounded-lg shadow transition-all p-4 flex items-start relative"
                                >
                                    <div className={`${item.color} rounded-lg w-14 h-14 flex items-center justify-center relative`}>
                                        {item.icon}
                                        {item.notification && (
                                            <div className="absolute top-0 right-0">
                                                {item.notification}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    {/* Panel lateral - Notificaciones y Comunicación */}
                    <div className="space-y-6">
                        {/* Notificaciones */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
                                Notificaciones
                            </h2>
                            <ChatNotification limit={3} />
                        </div>

                        {/* Comunicación */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
                                Mis conversaciones
                            </h2>
                            <StudentChat compact={true} onlyShowList={true} />
                        </div>
                    </div>
                </div>

                {/* Chat completo */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
                        Mensajes
                    </h2>
                    <StudentChat compact={true} onlyShowList={false} />
                </div>
            </main>
        </div>
    );
}
