import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, BookOpen, Check, X, Plus, Filter, Loader2 } from 'lucide-react';
import { tutorApi, TutorActivity } from '../../../lib/api/tutor';
import { useAuth } from '../../../lib/context/AuthContext';


export default function ActivitiesList() {
  const { currentUser } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState<TutorActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar actividades desde la API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await tutorApi.getActivities();
        setActivities(data);
      } catch (err) {
        console.error('Error al cargar actividades:', err);
        setError('No se pudieron cargar las actividades. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Función para marcar una actividad como completada
  const handleCompleteActivity = async (id: number) => {
    try {
      await tutorApi.updateActivityStatus(id, 'completed');
      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, status: 'completed' } : activity
      ));
    } catch (err) {
      console.error('Error al actualizar estado de actividad:', err);
    }
  };

  // Función para cancelar una actividad
  const handleCancelActivity = async (id: number) => {
    try {
      await tutorApi.updateActivityStatus(id, 'cancelled');
      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, status: 'cancelled' } : activity
      ));
    } catch (err) {
      console.error('Error al cancelar actividad:', err);
    }
  };

  // Filter activities based on status and search term
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = (
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && activity.status === selectedFilter;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, TutorActivity[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const getActivityTypeIcon = (type: string) => {
    switch(type) {
      case 'workshop': return <BookOpen className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'monitoring': return <Calendar className="w-4 h-4" />;
      case 'tutoring': return <BookOpen className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch(type) {
      case 'workshop': return 'Taller';
      case 'meeting': return 'Reunión';
      case 'monitoring': return 'Monitoreo';
      case 'tutoring': return 'Tutoría';
      default: return type;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityStatusLabel = (status: string) => {
    switch(status) {
      case 'upcoming': return 'Próxima';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Get today, tomorrow and yesterday dates for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Compare dates
    const dateValue = new Date(dateString);
    dateValue.setHours(0, 0, 0, 0);
    
    if (dateValue.getTime() === today.getTime()) {
      return 'Hoy';
    } else if (dateValue.getTime() === tomorrow.getTime()) {
      return 'Mañana';
    } else if (dateValue.getTime() === yesterday.getTime()) {
      return 'Ayer';
    }
    
    // Format date as day/month if it's not a special date
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Função para criar uma nova actividade
  const handleCreateActivity = () => {
    // Aquí se podría navegar a una página de creación de actividades
    // o abrir un modal para crear una nueva actividad
    console.log('Criar nova atividade');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Actividades</h1>
        <button 
          onClick={handleCreateActivity}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva actividad
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${selectedFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Todas
          </button>
          <button 
            onClick={() => setSelectedFilter('upcoming')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedFilter === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Próximas
          </button>
          <button 
            onClick={() => setSelectedFilter('completed')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedFilter === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Completadas
          </button>
          <button 
            onClick={() => setSelectedFilter('cancelled')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedFilter === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Canceladas
          </button>
        </div>
        
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar actividades..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Cargando actividades...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && activities.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No hay actividades registradas.</p>
          <button 
            onClick={handleCreateActivity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear primera actividad
          </button>
        </div>
      )}

      {/* Activities list */}
      {!isLoading && !error && activities.length > 0 && (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">{formatDate(date)}</h2>
              <div className="space-y-3">
                {groupedActivities[date].map(activity => (
                  <div key={activity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActivityStatusColor(activity.status)}`}>
                            {getActivityStatusLabel(activity.status)}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            {getActivityTypeIcon(activity.type)}
                            <span className="ml-1">{getActivityTypeLabel(activity.type)}</span>
                          </span>
                        </div>
                        <h3 className="text-md font-medium text-gray-800">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {new Date(activity.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {activity.time} ({activity.duration} min)
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            {activity.students.length} estudiante{activity.students.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      
                      {activity.status === 'upcoming' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCompleteActivity(activity.id)}
                            className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm font-medium flex items-center"
                          >
                            <Check className="h-3.5 w-3.5 mr-1.5" />
                            Completar
                          </button>
                          <button 
                            onClick={() => handleCancelActivity(activity.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-sm font-medium flex items-center"
                          >
                            <X className="h-3.5 w-3.5 mr-1.5" />
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron actividades que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
