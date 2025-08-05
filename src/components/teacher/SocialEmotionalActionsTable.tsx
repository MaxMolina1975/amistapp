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

interface SocialEmotionalActionsTableProps {
  onSelectAction?: (action: SocialEmotionalAction) => void;
  showSelectionButton?: boolean;
}

// Datos de acciones socioemocionales basados en la tabla proporcionada
export const socialEmotionalActions: SocialEmotionalAction[] = [
  // Regulación emocional
  {
    id: 're-001',
    action: 'Respeta la opinión de un otro aún cuando piense distinto a él/ella.',
    message: 'Admiro cómo respetas las opiniones de los demás, incluso cuando difieren de las tuyas.',
    competence: 'regulacion-emocional',
    indicator: 'Clima de convivencia escolar *Autoestima Escolar',
    points: 10,
    level: 'bajo'
  },
  {
    id: 're-002',
    action: 'Pide permiso',
    message: 'Es genial ver cómo respetas los límites al pedir permiso antes de proceder.',
    competence: 'regulacion-emocional',
    indicator: 'Participación ciudadana, relativo a normas',
    points: 10,
    level: 'bajo'
  },
  {
    id: 're-003',
    action: 'No golpeo a nadie ni nada cuando está triste o enojado.',
    message: 'Me alegra saber que, incluso cuando estás triste o enojado, mantienes la calma y no recurres a la violencia.',
    competence: 'regulacion-emocional',
    indicator: 'Autoestima escolar y motivación escolar',
    points: 20,
    level: 'medio'
  },
  {
    id: 're-004',
    action: 'Mantiene la calma cuando se enoja',
    message: 'Admiro cómo puedes mantener la calma incluso cuando estás enojado/a',
    competence: 'regulacion-emocional',
    indicator: 'Clima de convivencia escolar',
    points: 20,
    level: 'medio'
  },
  {
    id: 're-005',
    action: 'Se autocontrola',
    message: 'Es genial ver cómo te autocontrolas en todo momento, incluso cuando las emociones están a flor de piel.',
    competence: 'regulacion-emocional',
    indicator: 'Participación ciudadana, relativo a normas',
    points: 30,
    level: 'alto'
  },
  {
    id: 're-006',
    action: 'Piensa distintas alternativas para resolver un conflicto',
    message: 'Es genial ver como buscas diferentes maneras de resolver los problemas que surgen.',
    competence: 'regulacion-emocional',
    indicator: 'Participación ciudadana, relativo a normas',
    points: 30,
    level: 'alto'
  },
  
  // Competencia social
  {
    id: 'cs-001',
    action: 'Escucha de manera empática',
    message: 'Me gusta cómo sabes ponerte en el lugar de los demás al escuchar, es una habilidad muy valiosa',
    competence: 'competencia-social',
    indicator: 'Clima de convivencia escolar',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'cs-002',
    action: 'Mantiene una conversación o juego respetuosamente',
    message: 'Tu capacidad para mantener una conversación o juego respetuosamente es realmente admirable, contribuye a un ambiente positivo',
    competence: 'competencia-social',
    indicator: 'Participación ciudadana, relativo a normas',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'cs-003',
    action: 'Espera su turno para jugar o hablar',
    message: 'Tu capacidad para esperar pacientemente demuestra tu consideración y cortesía en las interacciones',
    competence: 'competencia-social',
    indicator: 'Participación ciudadana, relativo a normas',
    points: 20,
    level: 'medio'
  },
  {
    id: 'cs-004',
    action: 'Sabe trabajar en equipo.',
    message: 'Me gusta cómo puedes colaborar eficazmente en un equipo, mostrando habilidades de comunicación y cooperación.',
    competence: 'competencia-social',
    indicator: 'Participación y formación ciudadana',
    points: 20,
    level: 'medio'
  },
  {
    id: 'cs-005',
    action: 'Da buenos consejos a otros compañeros',
    message: 'Me inspira tu habilidad para brindar orientación y apoyo a tus compañeros, es un verdadero líder en el grupo.',
    competence: 'competencia-social',
    indicator: 'Autoestima académica y motivación escolar',
    points: 30,
    level: 'alto'
  },
  {
    id: 'cs-006',
    action: 'Ayudó o medió en un conflicto',
    message: 'Agradezco mucho tu ayuda en el conflicto, tu intervención fue realmente valiosa.',
    competence: 'competencia-social',
    indicator: 'Convivencia escolar',
    points: 30,
    level: 'alto'
  },
  
  // Conciencia emocional
  {
    id: 'ce-001',
    action: 'Dice fácilmente lo que siente de manera respetuosa',
    message: 'Tu capacidad para expresar tus emociones de manera respetuosa es realmente admirable, contribuye a un ambiente de apertura y comprensión',
    competence: 'conciencia-emocional',
    indicator: 'Autoestima académica y motivación escolar',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'ce-002',
    action: 'Conoce los propios afectos',
    message: 'Admiro tu profundo autoconocimiento emocional, que te permite ser consciente y comprensivo contigo mismo/a.',
    competence: 'conciencia-emocional',
    indicator: 'Autoestima académica y motivación escolar',
    points: 10,
    level: 'bajo'
  },
  {
    id: 'ce-003',
    action: 'Expresa afecto',
    message: 'Admiro tu habilidad para expresar afecto, siempre irradiando calidez y cariño hacia los demás',
    competence: 'conciencia-emocional',
    indicator: 'Clima de convivencia escolar',
    points: 20,
    level: 'medio'
  },
  {
    id: 'ce-004',
    action: 'Escucha cuando alguien le cuenta lo que siente',
    message: 'Tu capacidad para escuchar atentamente cuando alguien comparte sus sentimientos demuestra una gran empatía',
    competence: 'conciencia-emocional',
    indicator: 'Clima de convivencia escolar',
    points: 20,
    level: 'medio'
  },
  {
    id: 'ce-005',
    action: 'Dice lo que piensa y siente respetando a los demás',
    message: 'Valoro mucho tu honestidad al expresar tus pensamientos y sentimientos, siempre con respeto hacia los demás',
    competence: 'conciencia-emocional',
    indicator: 'Participación y formación ciudadana',
    points: 30,
    level: 'alto'
  },
  {
    id: 'ce-006',
    action: 'Comprende lo que siente el otro',
    message: 'Gracias por entender mis sentimientos cuando más lo necesitaba, lo valoro mucho.',
    competence: 'conciencia-emocional',
    indicator: 'Clima de convivencia escolar',
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

export function SocialEmotionalActionsTable({ onSelectAction, showSelectionButton = false }: SocialEmotionalActionsTableProps) {
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
            placeholder="Buscar acción, mensaje o indicador..."
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