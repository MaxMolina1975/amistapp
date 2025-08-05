import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { Calendar as CalendarIcon, Clock, BookOpen, PenTool, Users, AlertCircle } from 'lucide-react';

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // formato YYYY-MM-DD
  horaInicio?: string;
  horaFin?: string;
  tipo: 'tarea' | 'clase' | 'evaluacion' | 'grupal' | 'recordatorio';
  ubicacion?: string;
  importante: boolean;
}

// Helper para generar fechas
const obtenerFecha = (diasDespues: number = 0): string => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasDespues);
  return fecha.toISOString().split('T')[0];
};

export function Calendario() {
  const { currentUser } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mesActual, setMesActual] = useState<Date>(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>(obtenerFecha());
  const [eventosDia, setEventosDia] = useState<Evento[]>([]);

  useEffect(() => {
    // Aquí cargaríamos los eventos desde una API o Firebase
    // Por ahora usamos datos de ejemplo
    const eventosEjemplo: Evento[] = [
      {
        id: '1',
        titulo: 'Taller de emociones',
        descripcion: 'Actividad grupal para reconocer y expresar emociones',
        fecha: obtenerFecha(),
        horaInicio: '09:00',
        horaFin: '10:30',
        tipo: 'clase',
        ubicacion: 'Sala 205',
        importante: true
      },
      {
        id: '2',
        titulo: 'Entrega de diario reflexivo',
        descripcion: 'Completar y entregar el diario de reflexiones de la semana',
        fecha: obtenerFecha(1),
        horaInicio: '14:00',
        tipo: 'tarea',
        importante: false
      },
      {
        id: '3',
        titulo: 'Evaluación de habilidades sociales',
        descripcion: 'Test de evaluación sobre lo aprendido en el módulo de habilidades sociales',
        fecha: obtenerFecha(2),
        horaInicio: '10:00',
        horaFin: '11:30',
        tipo: 'evaluacion',
        ubicacion: 'Sala de evaluaciones',
        importante: true
      },
      {
        id: '4',
        titulo: 'Proyecto grupal',
        descripcion: 'Reunión con el equipo para avanzar en el proyecto de comunicación efectiva',
        fecha: obtenerFecha(3),
        horaInicio: '15:00',
        horaFin: '16:00',
        tipo: 'grupal',
        ubicacion: 'Biblioteca',
        importante: false
      },
      {
        id: '5',
        titulo: 'Recordatorio: Práctica de respiración',
        descripcion: 'Realizar la técnica de respiración para manejo del estrés (5 minutos)',
        fecha: obtenerFecha(),
        horaInicio: '18:00',
        tipo: 'recordatorio',
        importante: false
      },
      {
        id: '6',
        titulo: 'Clase de autorregulación',
        descripcion: 'Técnicas para manejar emociones intensas',
        fecha: obtenerFecha(4),
        horaInicio: '11:00',
        horaFin: '12:30',
        tipo: 'clase',
        ubicacion: 'Sala 201',
        importante: false
      },
      {
        id: '7',
        titulo: 'Entrega final de proyecto',
        descripcion: 'Fecha límite para entregar el proyecto de inteligencia emocional',
        fecha: obtenerFecha(7),
        tipo: 'tarea',
        importante: true
      }
    ];

    setEventos(eventosEjemplo);
  }, [currentUser]);

  useEffect(() => {
    const filtrarEventosDia = () => {
      const eventosDelDia = eventos.filter(evento => evento.fecha === diaSeleccionado);
      setEventosDia(eventosDelDia);
    };

    filtrarEventosDia();
  }, [diaSeleccionado, eventos]);

  const obtenerDiasMes = (year: number, month: number) => {
    // Obtenemos el primer día del mes y el primer día del siguiente mes
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    
    // Obtenemos el día de la semana del primer día (0 = domingo, 6 = sábado)
    const diaSemanaInicio = primerDia.getDay();
    
    // Calculamos el número de días en el mes
    const diasEnMes = ultimoDia.getDate();
    
    // Creamos un array para almacenar los días del mes
    const dias = [];
    
    // Añadimos los días del mes anterior para completar la primera semana
    for (let i = 0; i < diaSemanaInicio; i++) {
      const diaAnterior = new Date(year, month, -i);
      dias.unshift({
        fecha: diaAnterior.toISOString().split('T')[0],
        diaMes: diaAnterior.getDate(),
        esMesActual: false
      });
    }
    
    // Añadimos los días del mes actual
    for (let i = 1; i <= diasEnMes; i++) {
      const fecha = new Date(year, month, i);
      dias.push({
        fecha: fecha.toISOString().split('T')[0],
        diaMes: i,
        esMesActual: true
      });
    }
    
    // Añadimos los días del mes siguiente para completar la última semana
    const diasFaltantes = 42 - dias.length; // 6 semanas completas (7 días * 6 = 42)
    for (let i = 1; i <= diasFaltantes; i++) {
      const fecha = new Date(year, month + 1, i);
      dias.push({
        fecha: fecha.toISOString().split('T')[0],
        diaMes: i,
        esMesActual: false
      });
    }
    
    return dias;
  };

  const obtenerEventosPorDia = (fecha: string) => {
    return eventos.filter(evento => evento.fecha === fecha);
  };

  const avanzarMes = () => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const retrocederMes = () => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const irAHoy = () => {
    const hoy = new Date();
    setMesActual(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
    setDiaSeleccionado(hoy.toISOString().split('T')[0]);
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const nombresDiasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const obtenerIconoTipo = (tipo: string) => {
    switch(tipo) {
      case 'tarea':
        return <BookOpen className="h-4 w-4" />;
      case 'clase':
        return <PenTool className="h-4 w-4" />;
      case 'evaluacion':
        return <AlertCircle className="h-4 w-4" />;
      case 'grupal':
        return <Users className="h-4 w-4" />;
      case 'recordatorio':
        return <Clock className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const obtenerColorTipo = (tipo: string) => {
    switch(tipo) {
      case 'tarea':
        return 'bg-blue-100 text-blue-700';
      case 'clase':
        return 'bg-green-100 text-green-700';
      case 'evaluacion':
        return 'bg-red-100 text-red-700';
      case 'grupal':
        return 'bg-purple-100 text-purple-700';
      case 'recordatorio':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const diasMes = obtenerDiasMes(mesActual.getFullYear(), mesActual.getMonth());
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-purple-500" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Calendario
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Controles del calendario */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={retrocederMes}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={avanzarMes}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">
              {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </h2>
            
            <button 
              onClick={irAHoy}
              className="px-3 py-1 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-100"
            >
              Hoy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vista de calendario */}
          <div className="col-span-2 bg-white rounded-lg shadow overflow-hidden">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 border-b">
              {nombresDiasSemana.map((dia, index) => (
                <div key={index} className="py-2 text-center text-sm font-medium text-gray-700">
                  {dia}
                </div>
              ))}
            </div>
            
            {/* Días del mes */}
            <div className="grid grid-cols-7 h-96 overflow-y-auto">
              {diasMes.map((dia, index) => {
                const eventosDelDia = obtenerEventosPorDia(dia.fecha);
                const tieneEventos = eventosDelDia.length > 0;
                const tieneEventosImportantes = eventosDelDia.some(e => e.importante);
                const esDiaSeleccionado = dia.fecha === diaSeleccionado;
                const esHoy = dia.fecha === hoy;
                
                return (
                  <div 
                    key={index} 
                    className={`border-t border-r p-1 min-h-[80px] ${dia.esMesActual ? 'bg-white' : 'bg-gray-50'} ${esDiaSeleccionado ? 'bg-purple-50 border-purple-200' : ''}`}
                    onClick={() => setDiaSeleccionado(dia.fecha)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${!dia.esMesActual ? 'text-gray-400' : esHoy ? 'bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                        {dia.diaMes}
                      </span>
                      
                      {tieneEventosImportantes && (
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </div>
                    
                    {tieneEventos && (
                      <div className="mt-1 space-y-1">
                        {eventosDelDia.slice(0, 2).map((evento) => (
                          <div 
                            key={evento.id}
                            className={`px-1 py-0.5 rounded text-xs truncate ${obtenerColorTipo(evento.tipo)}`}
                          >
                            {evento.horaInicio && (
                              <span className="font-medium">{evento.horaInicio} </span>
                            )}
                            {evento.titulo}
                          </div>
                        ))}
                        
                        {eventosDelDia.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">
                            + {eventosDelDia.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eventos del día seleccionado */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {new Date(diaSeleccionado).toLocaleDateString(undefined, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </h3>
            </div>
            
            <div className="p-4 h-96 overflow-y-auto">
              {eventosDia.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay eventos programados para este día</p>
                  <button className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    Agregar evento
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {eventosDia
                    .sort((a, b) => {
                      if (!a.horaInicio) return 1;
                      if (!b.horaInicio) return -1;
                      return a.horaInicio.localeCompare(b.horaInicio);
                    })
                    .map((evento) => (
                      <div key={evento.id} className="border rounded-lg overflow-hidden">
                        <div className={`px-4 py-2 ${obtenerColorTipo(evento.tipo)} flex items-center justify-between`}>
                          <div className="flex items-center">
                            {obtenerIconoTipo(evento.tipo)}
                            <span className="ml-2 font-medium">
                              {evento.tipo === 'tarea' ? 'Tarea' : 
                                evento.tipo === 'clase' ? 'Clase' : 
                                evento.tipo === 'evaluacion' ? 'Evaluación' : 
                                evento.tipo === 'grupal' ? 'Trabajo Grupal' : 'Recordatorio'}
                            </span>
                          </div>
                          
                          {evento.importante && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                              Importante
                            </span>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h4 className="text-lg font-medium text-gray-900">{evento.titulo}</h4>
                          <p className="mt-1 text-sm text-gray-600">{evento.descripcion}</p>
                          
                          {(evento.horaInicio || evento.ubicacion) && (
                            <div className="mt-3 space-y-1">
                              {evento.horaInicio && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>
                                    {evento.horaInicio}
                                    {evento.horaFin && ` - ${evento.horaFin}`}
                                  </span>
                                </div>
                              )}
                              
                              {evento.ubicacion && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1114.5-4.9" />
                                  </svg>
                                  <span>{evento.ubicacion}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-4 flex space-x-2">
                            <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                              Editar
                            </button>
                            <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Calendario;
