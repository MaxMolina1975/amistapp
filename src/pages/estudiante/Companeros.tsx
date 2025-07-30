import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { Users, Search, MessageCircle, UserPlus, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Modal para crear nuevo grupo
import { Dialog } from '@headlessui/react';

interface Compañero {
  id: string;
  nombre: string;
  avatar: string;
  grado: string;
  estado: 'online' | 'offline';
  ultimaConexion?: string;
  puntosColaboracion: number;
}

export function Companeros() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [compañeros, setCompañeros] = useState<Compañero[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    // Aquí cargaríamos los compañeros desde una API o Firebase
    // Por ahora usamos datos de ejemplo
    const compañerosEjemplo: Compañero[] = [
      {
        id: '1',
        nombre: 'Ana García',
        avatar: 'https://i.pravatar.cc/150?img=1',
        grado: '6° Básico',
        estado: 'online',
        puntosColaboracion: 85
      },
      {
        id: '2',
        nombre: 'Carlos Rodríguez',
        avatar: 'https://i.pravatar.cc/150?img=8',
        grado: '6° Básico',
        estado: 'online',
        puntosColaboracion: 92
      },
      {
        id: '3',
        nombre: 'María López',
        avatar: 'https://i.pravatar.cc/150?img=5',
        grado: '6° Básico',
        estado: 'offline',
        ultimaConexion: '2025-03-24T15:30:00',
        puntosColaboracion: 78
      },
      {
        id: '4',
        nombre: 'Javier Méndez',
        avatar: 'https://i.pravatar.cc/150?img=12',
        grado: '6° Básico',
        estado: 'offline',
        ultimaConexion: '2025-03-23T14:15:00',
        puntosColaboracion: 63
      },
      {
        id: '5',
        nombre: 'Sofía Morales',
        avatar: 'https://i.pravatar.cc/150?img=9',
        grado: '6° Básico',
        estado: 'online',
        puntosColaboracion: 89
      }
    ];

    setCompañeros(compañerosEjemplo);
  }, [currentUser]);

  const compañerosFiltrados = compañeros.filter(compañero => {
    const cumpleBusqueda = compañero.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleFiltroEstado = 
      filtroEstado === 'todos' || 
      compañero.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleFiltroEstado;
  });

  const formatearUltimaConexion = (fecha?: string) => {
    if (!fecha) return 'Desconocida';
    
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferenciaMilisegundos = ahora.getTime() - fechaObj.getTime();
    
    // Menos de 24 horas
    if (diferenciaMilisegundos < 24 * 60 * 60 * 1000) {
      return `Hoy a las ${fechaObj.getHours()}:${fechaObj.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Menos de 48 horas
    if (diferenciaMilisegundos < 48 * 60 * 60 * 1000) {
      return `Ayer a las ${fechaObj.getHours()}:${fechaObj.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Más de 48 horas
    return fechaObj.toLocaleDateString();
  };

  // Función para manejar el envío de mensajes
  const handleSendMessage = (compañero: Compañero) => {
    // Navegar a la página de mensajes con el ID del compañero
    navigate(`/mensajes?userId=${compañero.id}`);
    toast.success(`Iniciando chat con ${compañero.nombre}`);
  };

  // Función para manejar la adición de amigos
  const handleAddFriend = (compañero: Compañero) => {
    // En una implementación real, esto enviaría una solicitud de amistad
    toast.success(`Solicitud de amistad enviada a ${compañero.nombre}`);
  };

  // Función para manejar la creación de un nuevo grupo
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error('El nombre del grupo no puede estar vacío');
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error('Debes seleccionar al menos un compañero para el grupo');
      return;
    }

    // En una implementación real, esto crearía un nuevo grupo en la base de datos
    toast.success(`Grupo "${newGroupName}" creado exitosamente`);
    
    // Cerrar el modal y resetear los campos
    setIsCreatingGroup(false);
    setNewGroupName('');
    setNewGroupDescription('');
    setSelectedStudents([]);
  };

  // Función para manejar la selección de estudiantes para el grupo
  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Función para manejar el clic en un grupo existente
  const handleGroupClick = (groupName: string) => {
    toast.success(`Abriendo grupo: ${groupName}`);
    // En una implementación real, esto abriría la vista del grupo
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Compañeros de Clase
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Buscador y filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Buscar compañero..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="filtroEstado"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="online">En línea</option>
                <option value="offline">Desconectados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de compañeros */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {compañerosFiltrados.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No se encontraron compañeros que coincidan con tu búsqueda</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {compañerosFiltrados.map((compañero) => (
                <li key={compañero.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img 
                          src={compañero.avatar} 
                          alt={`Avatar de ${compañero.nombre}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                          compañero.estado === 'online' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {compañero.nombre}
                        </h3>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 mr-3">
                            {compañero.grado}
                          </p>
                          {compañero.estado === 'offline' && compañero.ultimaConexion && (
                            <p className="text-xs text-gray-400">
                              Última conexión: {formatearUltimaConexion(compañero.ultimaConexion)}
                            </p>
                          )}
                        </div>
                        <div className="mt-1 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-600">
                            {compañero.puntosColaboracion} puntos de colaboración
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleSendMessage(compañero)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Mensaje
                      </button>
                      
                      <button 
                        onClick={() => handleAddFriend(compañero)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Agregar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sección de trabajo en equipo */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Trabajo en equipo</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grupos activos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => handleGroupClick('Proyecto de Emociones')} 
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <h4 className="text-base font-medium text-gray-900">Proyecto de Emociones</h4>
                <p className="text-sm text-gray-600 mb-3">Equipo de 4 miembros • Fecha límite: 2 de abril</p>
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Miembro" className="h-7 w-7 rounded-full ring-2 ring-white" />
                  <img src="https://i.pravatar.cc/150?img=8" alt="Miembro" className="h-7 w-7 rounded-full ring-2 ring-white" />
                  <img src="https://i.pravatar.cc/150?img=5" alt="Miembro" className="h-7 w-7 rounded-full ring-2 ring-white" />
                  <div className="h-7 w-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs ring-2 ring-white">
                    Tú
                  </div>
                </div>
              </div>
              
              <div 
                onClick={() => handleGroupClick('Taller de Comunicación')} 
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <h4 className="text-base font-medium text-gray-900">Taller de Comunicación</h4>
                <p className="text-sm text-gray-600 mb-3">Equipo de 3 miembros • Fecha límite: 10 de abril</p>
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/150?img=12" alt="Miembro" className="h-7 w-7 rounded-full ring-2 ring-white" />
                  <img src="https://i.pravatar.cc/150?img=9" alt="Miembro" className="h-7 w-7 rounded-full ring-2 ring-white" />
                  <div className="h-7 w-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs ring-2 ring-white">
                    Tú
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCreatingGroup(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Crear nuevo grupo
            </button>
          </div>
        </div>
      </main>

      {/* Modal para crear nuevo grupo */}
      <Dialog
        open={isCreatingGroup}
        onClose={() => setIsCreatingGroup(false)}
        className="relative z-10"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Crear nuevo grupo
                </Dialog.Title>
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Cerrar</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">
                    Nombre del grupo
                  </label>
                  <input
                    type="text"
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Ej: Proyecto de Ciencias"
                  />
                </div>

                <div>
                  <label htmlFor="group-description" className="block text-sm font-medium text-gray-700">
                    Descripción (opcional)
                  </label>
                  <textarea
                    id="group-description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Describe el propósito del grupo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar compañeros
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {compañeros.map((compañero) => (
                      <div key={compañero.id} className="flex items-center py-2">
                        <input
                          type="checkbox"
                          id={`student-${compañero.id}`}
                          checked={selectedStudents.includes(compañero.id)}
                          onChange={() => toggleStudentSelection(compañero.id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`student-${compañero.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                          {compañero.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Crear grupo
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Companeros;
