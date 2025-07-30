import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { Award, Trophy, Star, TrendingUp, CheckCircle2, Lock } from 'lucide-react';

interface Logro {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  categoria: 'emocional' | 'social' | 'academico' | 'personal';
  desbloqueado: boolean;
  fechaDesbloqueo?: string;
  progreso?: number; // De 0 a 100
  puntos: number;
}

export function Logros() {
  const { currentUser } = useAuth();
  const [logros, setLogros] = useState<Logro[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

  useEffect(() => {
    // Aquí cargaríamos los logros desde una API o Firebase
    // Por ahora usamos datos de ejemplo
    const logrosEjemplo: Logro[] = [
      {
        id: '1',
        titulo: 'Explorador Emocional',
        descripcion: 'Identifica correctamente 10 emociones diferentes',
        icono: 'emotion',
        categoria: 'emocional',
        desbloqueado: true,
        fechaDesbloqueo: '2025-03-15',
        puntos: 50
      },
      {
        id: '2',
        titulo: 'Comunicador Efectivo',
        descripcion: 'Completa 5 actividades de comunicación asertiva',
        icono: 'speech',
        categoria: 'social',
        desbloqueado: true,
        fechaDesbloqueo: '2025-03-20',
        puntos: 75
      },
      {
        id: '3',
        titulo: 'Maestro de la Calma',
        descripcion: 'Practica técnicas de respiración por 7 días consecutivos',
        icono: 'breathe',
        categoria: 'personal',
        desbloqueado: false,
        progreso: 70,
        puntos: 100
      },
      {
        id: '4',
        titulo: 'Colaborador Estelar',
        descripcion: 'Participa activamente en 3 proyectos grupales',
        icono: 'team',
        categoria: 'social',
        desbloqueado: false,
        progreso: 33,
        puntos: 80
      },
      {
        id: '5',
        titulo: 'Pensador Reflexivo',
        descripcion: 'Completa tu diario de emociones durante 15 días',
        icono: 'diary',
        categoria: 'emocional',
        desbloqueado: false,
        progreso: 60,
        puntos: 90
      },
      {
        id: '6',
        titulo: 'Autoconocimiento Profundo',
        descripcion: 'Realiza un análisis completo de tus fortalezas y áreas de mejora',
        icono: 'selfAwareness',
        categoria: 'personal',
        desbloqueado: true,
        fechaDesbloqueo: '2025-03-10',
        puntos: 60
      },
      {
        id: '7',
        titulo: 'Liderazgo Inspirador',
        descripcion: 'Lidera un proyecto grupal y recibe evaluaciones positivas',
        icono: 'leader',
        categoria: 'social',
        desbloqueado: false,
        progreso: 0,
        puntos: 150
      },
      {
        id: '8',
        titulo: 'Excelencia Académica',
        descripcion: 'Obtén calificación perfecta en 3 evaluaciones consecutivas',
        icono: 'academic',
        categoria: 'academico',
        desbloqueado: false,
        progreso: 66,
        puntos: 120
      }
    ];

    setLogros(logrosEjemplo);
  }, [currentUser]);

  const logrosFiltrados = logros.filter(logro => {
    return filtroCategoria === 'todos' || logro.categoria === filtroCategoria;
  });

  const logrosDesbloqueados = logrosFiltrados.filter(logro => logro.desbloqueado);
  const logrosPendientes = logrosFiltrados.filter(logro => !logro.desbloqueado);

  const totalPuntos = logros.reduce((total, logro) => {
    return logro.desbloqueado ? total + logro.puntos : total;
  }, 0);

  const obtenerIconoLogro = (iconoTipo: string) => {
    switch (iconoTipo) {
      case 'emotion':
        return <div className="bg-purple-100 p-3 rounded-full"><Star className="h-6 w-6 text-purple-600" /></div>;
      case 'speech':
        return <div className="bg-blue-100 p-3 rounded-full"><Award className="h-6 w-6 text-blue-600" /></div>;
      case 'breathe':
        return <div className="bg-teal-100 p-3 rounded-full"><TrendingUp className="h-6 w-6 text-teal-600" /></div>;
      case 'team':
        return <div className="bg-green-100 p-3 rounded-full"><CheckCircle2 className="h-6 w-6 text-green-600" /></div>;
      case 'diary':
        return <div className="bg-pink-100 p-3 rounded-full"><Star className="h-6 w-6 text-pink-600" /></div>;
      case 'selfAwareness':
        return <div className="bg-indigo-100 p-3 rounded-full"><CheckCircle2 className="h-6 w-6 text-indigo-600" /></div>;
      case 'leader':
        return <div className="bg-orange-100 p-3 rounded-full"><Trophy className="h-6 w-6 text-orange-600" /></div>;
      case 'academic':
        return <div className="bg-yellow-100 p-3 rounded-full"><Award className="h-6 w-6 text-yellow-600" /></div>;
      default:
        return <div className="bg-gray-100 p-3 rounded-full"><Star className="h-6 w-6 text-gray-600" /></div>;
    }
  };

  const obtenerColorCategoria = (categoria: string) => {
    switch (categoria) {
      case 'emocional':
        return 'bg-purple-100 text-purple-800';
      case 'social':
        return 'bg-blue-100 text-blue-800';
      case 'academico':
        return 'bg-yellow-100 text-yellow-800';
      case 'personal':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString(undefined, { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-500" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Mis Logros
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Resumen de logros */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow mb-6">
          <div className="px-6 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-white text-xl font-bold">Total de puntos</h2>
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-white opacity-90 mr-2" />
                  <span className="text-white text-3xl font-extrabold">{totalPuntos}</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex flex-col items-center">
                <div className="text-white text-center">
                  <p className="text-xl font-bold">{logrosDesbloqueados.length}</p>
                  <p className="text-sm opacity-90">Logros desbloqueados</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex flex-col items-center">
                <div className="text-white text-center">
                  <p className="text-xl font-bold">{logros.length - logrosDesbloqueados.length}</p>
                  <p className="text-sm opacity-90">Logros pendientes</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <button className="bg-white text-yellow-600 px-4 py-2 rounded-md font-medium hover:bg-yellow-50 transition-colors">
                  Ver ranking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filtroCategoria === 'todos' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setFiltroCategoria('todos')}
            >
              Todos
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filtroCategoria === 'emocional' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
              onClick={() => setFiltroCategoria('emocional')}
            >
              Emocional
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filtroCategoria === 'social' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
              onClick={() => setFiltroCategoria('social')}
            >
              Social
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filtroCategoria === 'academico' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
              onClick={() => setFiltroCategoria('academico')}
            >
              Académico
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filtroCategoria === 'personal' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
              }`}
              onClick={() => setFiltroCategoria('personal')}
            >
              Personal
            </button>
          </div>
        </div>

        {/* Logros desbloqueados */}
        {logrosDesbloqueados.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Logros Desbloqueados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logrosDesbloqueados.map((logro) => (
                <div key={logro.id} className="bg-white rounded-lg shadow overflow-hidden border-2 border-yellow-300">
                  <div className="p-4">
                    <div className="flex items-start">
                      {obtenerIconoLogro(logro.icono)}
                      
                      <div className="ml-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-900">{logro.titulo}</h3>
                          <span className="ml-2 text-sm font-medium text-yellow-600">+{logro.puntos} pts</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{logro.descripcion}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorCategoria(logro.categoria)}`}>
                            {logro.categoria === 'emocional' ? 'Inteligencia Emocional' : 
                              logro.categoria === 'social' ? 'Habilidades Sociales' : 
                              logro.categoria === 'academico' ? 'Rendimiento Académico' : 'Desarrollo Personal'}
                          </span>
                          
                          {logro.fechaDesbloqueo && (
                            <span className="text-xs text-gray-500">
                              {formatearFecha(logro.fechaDesbloqueo)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logros pendientes */}
        {logrosPendientes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Logros Pendientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logrosPendientes.map((logro) => (
                <div key={logro.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="relative">
                        {obtenerIconoLogro(logro.icono)}
                        <div className="absolute -top-1 -right-1 bg-gray-100 rounded-full p-0.5">
                          <Lock className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-700">{logro.titulo}</h3>
                          <span className="ml-2 text-sm font-medium text-gray-500">+{logro.puntos} pts</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{logro.descripcion}</p>
                        
                        {logro.progreso !== undefined && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-600">Progreso</span>
                              <span className="text-gray-600 font-medium">{logro.progreso}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${logro.progreso}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorCategoria(logro.categoria)}`}>
                            {logro.categoria === 'emocional' ? 'Inteligencia Emocional' : 
                              logro.categoria === 'social' ? 'Habilidades Sociales' : 
                              logro.categoria === 'academico' ? 'Rendimiento Académico' : 'Desarrollo Personal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Logros;
