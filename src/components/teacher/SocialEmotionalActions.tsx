import { useState, useMemo } from 'react';
import { Filter, Search, Info } from 'lucide-react';

// Definición de tipos para las acciones socioemocionales
export interface SocialEmotionalAction {
  id: string;
  action: string;
  message: string;
  competence: 'regulacion-emocional' | 'competencia-social' | 'conciencia-emocional';
  indicator: string;
  points: number;
  level: 'bajo' | 'medio' | 'alto';
}

interface SocialEmotionalActionsProps {
  onSelectAction?: (action: SocialEmotionalAction) => void;
  showSelectionButton?: boolean;
}

// Datos de acciones socioemocionales basados en la tabla proporcionada
const socialEmotionalActionsData: SocialEmotionalAction[] = [
  // Regulación emocional
  {
    id: 're-001',
    action: 'Me Compartió sus materiales.',
    message: 'Gracias por compartir tus materiales conmigo, demuestras generosidad y disposición para colaborar.',
    competence: 'regulacion-emocional',
    indicator: '',
    points: 10,
    level: 'bajo'
  },
  {
    id: 're-002',
    action: 'Evitó problemas con los demás o con el profesor',
    message: 'Me gusta cómo sabes evitar problemas con los demás o con el profesor, es una muestra de tu inteligencia emocional y respeto hacia los demás',
    competence: 'regulacion-emocional',
    indicator: '',
    points: 10,
    level: 'bajo'
  },
  {
    id: 're-003',
    action: 'No golpeó a nadie ni nada cuando se enojó.',
    message: 'Es genial ver cómo mantienes la calma incluso cuando estás enojado/a, evitando cualquier tipo de violencia.',
    competence: 'regulacion-emocional',
    indicator: '',
    points: 20,
    level: 'medio'
  },
  {
    id: 're-004',
    action: 'Mantuvo la calma cuando se enojó',
    message: 'Tu capacidad para manejar tu enojo de manera pacífica es realmente admirable.',
    competence: 'regulacion-emocional',
    indicator: '',
    points: 20,
    level: 'medio'
  },
  {
    id: 're-005',
    action: 'Supo qué hacer cuando le dio vergüenza.',
    message: 'Tu habilidad para saber qué hacer cuando te dio vergüenza es realmente admirable, muestra tu madurez emocional.',
    competence: 'regulacion-emocional',
    indicator: '',
    points: 30,
    level: 'alto'
  },
  {
    id: 're-006',
    action: 'Mantuvo la calma cuando discutió con el profesor o con un compañero',
    message: 'Me inspira tu manera de mantener la calma en situaciones conflictivas, es un ejemplo de control emocional y habilidad para comunicarte efectivamente.',
    competence: 'regulacion-emocional',
    indicator: '',
    points: 30,
    level: 'alto'
  },
  
  // Competencia social
  {
    id: 'cs-001',
    action: 'Escuchó mis sentimientos',
    message: 'Es genial ver cómo has escuchado mis sentimientos, esto significa mucho para mí y fortalece nuestra conexión.',
    competence: 'competencia-social',
    indicator: '',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'cs-002',
    action: 'Me dio las gracias o me pidió por favor',
    message: 'Agradezco mucho que me hayas dado las gracias o que me hayas pedido por favor, demuestra tu educación y consideración.',
    competence: 'competencia-social',
    indicator: '',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'cs-003',
    action: 'Se disculpó por una diferencia entre nosotros',
    message: 'Me inspira tu capacidad para disculparte y buscar la armonía, es un ejemplo de cómo mantener relaciones saludables a pesar de las diferencias.',
    competence: 'competencia-social',
    indicator: '',
    points: 20,
    level: 'medio'
  },
  {
    id: 'cs-004',
    action: 'Trabajamos en equipo Genial',
    message: 'Me encantó cómo colaboramos juntos, hicimos un gran equipo!',
    competence: 'competencia-social',
    indicator: '',
    points: 20,
    level: 'medio'
  },
  {
    id: 'cs-005',
    action: 'Me defendió ante otro compañero.',
    message: 'Quería agradecerte por haberme defendido ante otro compañero, realmente aprecio tu apoyo.',
    competence: 'competencia-social',
    indicator: '',
    points: 30,
    level: 'alto'
  },
  {
    id: 'cs-006',
    action: 'Me ayudó cuando tuve un problema.',
    message: 'Tu ayuda y apoyo fueron fundamentales para mí cuando tuve un problema, gracias por estar presente.',
    competence: 'competencia-social',
    indicator: 'Convivencia escolar',
    points: 30,
    level: 'alto'
  },
  
  // Conciencia emocional
  {
    id: 'ce-001',
    action: 'Me dijo cómo se sentía',
    message: 'Tu sinceridad al compartir cómo te sentías es realmente apreciada, demuestra tu honestidad y tu respeto por nuestra relación.',
    competence: 'conciencia-emocional',
    indicator: '',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'ce-002',
    action: 'Pidió ayuda o brindó ayuda.',
    message: 'Aprecio mucho que hayas pedido ayuda o que hayas ofrecido tu ayuda cuando fue necesario.',
    competence: 'conciencia-emocional',
    indicator: '',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'ce-003',
    action: 'Fue capaz de entender lo que sentía',
    message: 'Valoro mucho tu capacidad para entender mis sentimientos y emociones.',
    competence: 'conciencia-emocional',
    indicator: '',
    points: 20,
    level: 'medio'
  },
  {
    id: 'ce-004',
    action: 'Me escuchó cuando le conté lo que me pasó',
    message: 'Gracias por escucharme atentamente cuando te conté lo que me pasó, tu atención significa mucho para mí.',
    competence: 'conciencia-emocional',
    indicator: '',
    points: 20,
    level: 'medio'
  },
  {
    id: 'ce-005',
    action: 'Me dijo lo que pensaba y sentía respetándome',
    message: 'Aprecio mucho que me hayas dicho lo que pensabas y sentías, siempre respetando mi punto de vista.',
    competence: 'conciencia-emocional',
    indicator: '',
    points: 30,
    level: 'alto'
  },
  {
    id: 'ce-006',
    action: 'Empatizó conmigo en cuándo más lo necesitaba',
    message: 'Tu empatía cuando más la necesitaba fue invaluable para mí, gracias por estar ahí en ese momento difícil.',
    competence: 'conciencia-emocional',
    indicator: '',
    points: 30,
    level: 'alto'
  },
];

// Mapeo de competencias para mostrar en la UI
const competenceLabels: Record<string, { name: string, color: string }> = {
  'regulacion-emocional': { name: 'Regulación emocional', color: 'blue' },
  'competencia-social': { name: 'Competencia social', color: 'green' },
  'conciencia-emocional': { name: 'Conciencia emocional', color: 'purple' }
};

// Mapeo de niveles para mostrar en la UI
const levelLabels: Record<string, { name: string, color: string }> = {
  'bajo': { name: 'Bajo', color: 'blue' },
  'medio': { name: 'Medio', color: 'amber' },
  'alto': { name: 'Alto', color: 'green' }
};

// Componente principal - cambiado a exportación por defecto para resolver problemas de compatibilidad
export default function SocialEmotionalActions({ onSelectAction, showSelectionButton = false }: SocialEmotionalActionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filtrar acciones según los criterios seleccionados
  const filteredActions = useMemo(() => {
    return socialEmotionalActions.filter(action => {
      const matchesSearch = action.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.indicator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompetence = selectedCompetence === 'all' || action.competence === selectedCompetence;
      const matchesLevel = selectedLevel === 'all' || action.level === selectedLevel;
      
      return matchesSearch && matchesCompetence && matchesLevel;
    });
  }, [searchTerm, selectedCompetence, selectedLevel]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Acciones Socioemocionales
        </h2>
        <p className="text-gray-600">
          Acciones positivas que puedes reconocer en tus estudiantes
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar acción..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por competencia
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={selectedCompetence}
              onChange={(e) => setSelectedCompetence(e.target.value)}
            >
              <option value="all">Todas las competencias</option>
              <option value="regulacion-emocional">Regulación emocional</option>
              <option value="competencia-social">Competencia social</option>
              <option value="conciencia-emocional">Conciencia emocional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por nivel
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">Todos los niveles</option>
              <option value="bajo">Nivel bajo</option>
              <option value="medio">Nivel medio</option>
              <option value="alto">Nivel alto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de acciones */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción (Disciplina Positiva)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mensaje app con IA
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competencia Socioemocional
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Indicador de Desarrollo Personal y Social
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntuación
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nivel de competencia
              </th>
              {showSelectionButton && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActions.map((action) => (
              <tr key={action.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{action.action}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{action.message || "Sin mensaje definido"}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full bg-${competenceLabels[action.competence].color}-100 text-${competenceLabels[action.competence].color}-700`}>
                    {competenceLabels[action.competence].name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">{action.indicator || "No especificado"}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-violet-600">{action.points} pts</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full bg-${levelLabels[action.level].color}-100 text-${levelLabels[action.level].color}-700`}>
                    {levelLabels[action.level].name}
                  </span>
                </td>
                {showSelectionButton && onSelectAction && (
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectAction(action)}
                      className="px-3 py-1 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                    >
                      Seleccionar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredActions.length === 0 && (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No se encontraron acciones</h3>
            <p className="text-gray-600">
              Intenta cambiar los filtros o términos de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="mb-1"><strong>IDPS:</strong> Indicadores de Desarrollo Personal y Social</p>
            <p className="mb-1"><strong>RIEBE:</strong> Referentes de la Investigación en Educación Basada en Evidencia</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exportación separada de los datos para mantener la compatibilidad con el código existente
export const socialEmotionalActions = socialEmotionalActionsData;