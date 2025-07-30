import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  completada: boolean;
  tipo: 'tarea' | 'ejercicio' | 'evaluacion';
  prioridad: 'alta' | 'media' | 'baja';
}

export function Actividades() {
  const { currentUser } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  useEffect(() => {
    // Aquí cargaríamos las actividades desde una API o Firebase
    // Por ahora usamos datos de ejemplo
    const actividadesEjemplo: Actividad[] = [
      {
        id: '1',
        titulo: 'Reconocimiento de emociones',
        descripcion: 'Completar el ejercicio de identificación de emociones básicas',
        fechaLimite: '2025-03-28',
        completada: false,
        tipo: 'ejercicio',
        prioridad: 'alta'
      },
      {
        id: '2',
        titulo: 'Diario de emociones',
        descripcion: 'Registrar cómo te has sentido durante la última semana',
        fechaLimite: '2025-03-30',
        completada: false,
        tipo: 'tarea',
        prioridad: 'media'
      },
      {
        id: '3',
        titulo: 'Técnicas de respiración',
        descripcion: 'Practicar las técnicas de respiración para el manejo del estrés',
        fechaLimite: '2025-03-25',
        completada: true,
        tipo: 'ejercicio',
        prioridad: 'alta'
      },
      {
        id: '4',
        titulo: 'Evaluación de regulación emocional',
        descripcion: 'Completar la evaluación sobre los contenidos de regulación emocional',
        fechaLimite: '2025-04-05',
        completada: false,
        tipo: 'evaluacion',
        prioridad: 'alta'
      },
      {
        id: '5',
        titulo: 'Comunicación asertiva',
        descripcion: 'Realizar los ejercicios de comunicación asertiva con compañeros',
        fechaLimite: '2025-04-02',
        completada: false,
        tipo: 'tarea',
        prioridad: 'media'
      }
    ];

    setActividades(actividadesEjemplo);
  }, [currentUser]);

  const actividadesFiltradas = actividades.filter(actividad => {
    const cumpleFiltroTipo = filtroTipo === 'todos' || actividad.tipo === filtroTipo;
    const cumpleFiltroEstado = 
      filtroEstado === 'todos' || 
      (filtroEstado === 'completadas' && actividad.completada) || 
      (filtroEstado === 'pendientes' && !actividad.completada);
    
    return cumpleFiltroTipo && cumpleFiltroEstado;
  });

  const toggleCompletada = (id: string) => {
    setActividades(prevActividades => 
      prevActividades.map(actividad => 
        actividad.id === id ? { ...actividad, completada: !actividad.completada } : actividad
      )
    );
  };

  const obtenerColorPorTipo = (tipo: string) => {
    switch(tipo) {
      case 'ejercicio':
        return 'bg-blue-100 text-blue-700';
      case 'tarea':
        return 'bg-green-100 text-green-700';
      case 'evaluacion':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const obtenerColorPorPrioridad = (prioridad: string) => {
    switch(prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-700';
      case 'media':
        return 'bg-yellow-100 text-yellow-700';
      case 'baja':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const estaVencida = (fecha: string) => {
    return new Date(fecha) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-violet-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Mis Actividades
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="filtroTipo"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="ejercicio">Ejercicios</option>
                <option value="tarea">Tareas</option>
                <option value="evaluacion">Evaluaciones</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="filtroEstado"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="pendientes">Pendientes</option>
                <option value="completadas">Completadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de actividades */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {actividadesFiltradas.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No hay actividades que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {actividadesFiltradas.map((actividad) => (
                <li key={actividad.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleCompletada(actividad.id)}
                        className="flex-shrink-0 mt-1"
                      >
                        {actividad.completada ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                        )}
                      </button>
                      
                      <div>
                        <h3 className={`text-lg font-medium ${actividad.completada ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {actividad.titulo}
                        </h3>
                        <p className={`text-sm ${actividad.completada ? 'text-gray-400' : 'text-gray-600'}`}>
                          {actividad.descripcion}
                        </p>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorPorTipo(actividad.tipo)}`}>
                            {actividad.tipo === 'ejercicio' ? 'Ejercicio' : 
                              actividad.tipo === 'tarea' ? 'Tarea' : 'Evaluación'}
                          </span>
                          
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorPorPrioridad(actividad.prioridad)}`}>
                            {actividad.prioridad === 'alta' ? 'Prioridad alta' : 
                              actividad.prioridad === 'media' ? 'Prioridad media' : 'Prioridad baja'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className={`text-sm ${estaVencida(actividad.fechaLimite) && !actividad.completada ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          {estaVencida(actividad.fechaLimite) && !actividad.completada ? 
                            'Vencida: ' : 'Fecha límite: '}
                          {new Date(actividad.fechaLimite).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <Link
                        to={`/estudiante/actividad/${actividad.id}`}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default Actividades;
