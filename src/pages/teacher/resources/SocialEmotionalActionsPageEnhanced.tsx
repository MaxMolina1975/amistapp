import React from 'react';
import { BackButton } from '../../../components/common/BackButton';

interface SocioEmotionalAction {
  accion: string;
  mensajeApp: string;
  competenciaSocioemocional: string;
  indicadorDesarrollo?: string;
  puntuacionApp: number;
  nivelCompetencia: string;
}

// Datos organizados por categorías
const regulacionEmocional: SocioEmotionalAction[] = [
  {
    accion: 'Respeta la opinión de un otro aún cuando piense distinto a él/ella.',
    mensajeApp: 'Admiro cómo respetas las opiniones de los demás, incluso cuando difieren de las tuyas.',
    competenciaSocioemocional: 'Regulación emocional',
    indicadorDesarrollo: '*Clima de convivencia escolar\n*Autoestima Escolar',
    puntuacionApp: 10,
    nivelCompetencia: 'Nivel competencia: Bajo',
  },
  {
    accion: 'Pide permiso',
    mensajeApp: 'Es genial ver cómo respetas los límites al pedir permiso antes de proceder.',
    competenciaSocioemocional: 'Regulación emocional',
    indicadorDesarrollo: '*Participación ciudadana, relativo a normas',
    puntuacionApp: 10,
    nivelCompetencia: 'Nivel competencia: Bajo',
  },
  {
    accion: 'No golpeo a nadie ni nada cuando está triste o enojado',
    mensajeApp: 'Me alegra saber que, incluso cuando estás enojado, mantienes la calma y no recurres a la violencia.',
    competenciaSocioemocional: 'Regulación emocional',
    indicadorDesarrollo: 'autoestima escolar y motivación escolar',
    puntuacionApp: 20,
    nivelCompetencia: 'Nivel competencia: Bajo',
  },
  {
    accion: 'Mantiene la calma cuando se enoja',
    mensajeApp: 'Admiro cómo puedes mantener la calma incluso cuando estás enojado/a.',
    competenciaSocioemocional: 'Regulación emocional',
    indicadorDesarrollo: 'Clima de convivencia escolar',
    puntuacionApp: 20,
    nivelCompetencia: 'Nivel competencia: Medio',
  },
  {
    accion: 'Se autocontrola',
    mensajeApp: 'Es genial ver cómo se autocontrola en todo momento, incluso cuando las emociones están a flor de piel.',
    competenciaSocioemocional: 'Regulación emocional',
    indicadorDesarrollo: 'Participación ciudadana, relativo a normas',
    puntuacionApp: 30,
    nivelCompetencia: 'Nivel competencia: Alto',
  },
  {
    accion: 'Piensa distintas alternativas para resolver un conflicto',
    mensajeApp: 'Es genial ver cómo buscas diferentes maneras de resolver los problemas que surgen.',
    competenciaSocioemocional: 'Regulación emocional',
    indicadorDesarrollo: 'Participación ciudadana, relativo a normas',
    puntuacionApp: 30,
    nivelCompetencia: 'Nivel competencia: Alto',
  },
];

const competenciaSocial: SocioEmotionalAction[] = [
  {
    accion: 'Escucha de manera empática',
    mensajeApp: 'Me gusta cómo sabes ponerte en el lugar de los demás al escuchar, es una habilidad muy valiosa.',
    competenciaSocioemocional: 'Competencia social',
    puntuacionApp: 10,
    nivelCompetencia: 'Nivel competencia: Bajo',
  },
  {
    accion: 'Mantiene una conversacion o juego respetuosamente',
    mensajeApp: 'Tu capacidad para mantener una conversación o juego respetuosamente es realmente admirable, contribuye a un ambiente positivo.',
    competenciaSocioemocional: 'Competencia social',
    indicadorDesarrollo: 'Participación ciudadana, relativo a normas',
    puntuacionApp: 10,
    nivelCompetencia: 'Nivel competencia: Bajo',
  },
  {
    accion: 'Espera su turno para jugar o hablar',
    mensajeApp: 'Tu capacidad para esperar pacientemente demuestra tu consideración y cortesía en las interacciones.',
    competenciaSocioemocional: 'Competencia social',
    indicadorDesarrollo: 'Participación ciudadana, relativo a normas',
    puntuacionApp: 20,
    nivelCompetencia: 'Nivel competencia: Medio',
  },
  {
    accion: 'Sabe trabajar en equipo.',
    mensajeApp: 'Me gusta cómo puedes colaborar eficazmente en un equipo, mostrando habilidades de comunicación y cooperación.',
    competenciaSocioemocional: 'Competencia social',
    puntuacionApp: 20,
    nivelCompetencia: 'Nivel competencia: Medio',
  },
  {
    accion: 'Da buenos consejos a otros compañeros',
    mensajeApp: 'Me inspira tu habilidad para brindar orientación y apoyo a tus compañeros, es un verdadero líder en el grupo.',
    competenciaSocioemocional: 'Competencia social',
    puntuacionApp: 30,
    nivelCompetencia: 'Nivel competencia: Alto',
  },
  {
    accion: 'ayudó o medio en un conflicto',
    mensajeApp: 'Agradezco mucho tu ayuda en el conflicto, tu intervención fue realmente valiosa.',
    competenciaSocioemocional: 'Competencia social',
    indicadorDesarrollo: 'Convivencia escolar',
    puntuacionApp: 30,
    nivelCompetencia: 'Nivel competencia: Alto',
  },
];

const concienciaEmocional: SocioEmotionalAction[] = [
  {
    accion: 'Dice fácilmente lo que siente de manera respetuosa',
    mensajeApp: 'Tu capacidad para expresar tus emociones de manera respetuosa es realmente admirable, contribuye a un ambiente de apertura y comprensión.',
    competenciaSocioemocional: 'Conciencia emocional',
    puntuacionApp: 10,
    nivelCompetencia: 'Nivel competencia: Bajo',
  },
  {
    accion: 'Conoce los propios afectos',
    mensajeApp: 'Admiro tu profundo autoconocimiento emocional, que te permite ser consciente y comprensivo contigo mismo/a.',
    competenciaSocioemocional: 'Conciencia emocional',
    puntuacionApp: 10,
    nivelCompetencia: 'Nivel competencia: Bajo',
  },
  {
    accion: 'Expresa afecto',
    mensajeApp: 'Admiro tu habilidad para expresar afecto, siempre irradiando calidez y cariño hacia los demás.',
    competenciaSocioemocional: 'Conciencia emocional',
    puntuacionApp: 20,
    nivelCompetencia: 'Nivel competencia: Medio',
  },
  {
    accion: 'Escucha cuando alguien le cuenta lo que siente',
    mensajeApp: 'Admiro tu habilidad para escuchar cuando alguien te cuenta lo que siente.',
    competenciaSocioemocional: 'Conciencia emocional',
    puntuacionApp: 20,
    nivelCompetencia: 'Nivel competencia: Medio',
  },
  {
    accion: 'Dice lo que piensa y siente respetando a los demás',
    mensajeApp: 'Es admirable cómo dices lo que piensas y sientes, siempre respetando a los demás.',
    competenciaSocioemocional: 'Conciencia emocional',
    puntuacionApp: 30,
    nivelCompetencia: 'Nivel competencia: Alto',
  },
  {
    accion: 'Comprende lo que siente el otro',
    mensajeApp: 'Gracias por entender mis sentimientos cuando mas lo necesitaba, lo valoro mucho.',
    competenciaSocioemocional: 'Conciencia emocional',
    puntuacionApp: 30,
    nivelCompetencia: 'Nivel competencia: Alto',
  },
];

export function SocialEmotionalActionsPageEnhanced() {
  // Función para renderizar una tabla con color de fondo específico
  const renderTable = (items: SocioEmotionalAction[], title: string, bgColor: string, headerColor: string, rowColor: string) => {
    return (
      <div className="mb-6">
        <div className={`${headerColor} rounded-t-lg p-3`}>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        
        {/* Vista para dispositivos móviles (tarjetas verticales) */}
        <div className={`md:hidden ${bgColor} rounded-b-lg shadow-sm`}>
          {items.map((item, index) => (
            <div key={index} className={`${rowColor} p-4 border-b border-opacity-20 last:border-0`}>
              <div className="mb-3">
                <div className="font-medium text-sm">{item.accion}</div>
                <div className="text-xs text-gray-600 mt-1">{item.nivelCompetencia}</div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div>
                  <span className="font-semibold block">Mensaje app con IA:</span>
                  <span className="text-gray-700">{item.mensajeApp}</span>
                </div>
                
                <div>
                  <span className="font-semibold block">Competencia:</span>
                  <span className="text-gray-700">{item.competenciaSocioemocional}</span>
                </div>
                
                <div>
                  <span className="font-semibold block">IDPS:</span>
                  <span className="text-gray-700">{item.indicadorDesarrollo || '-'}</span>
                </div>
                
                <div>
                  <span className="font-semibold block">Puntos:</span>
                  <span className="font-bold">{item.puntuacionApp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Vista para tablets y desktop (tabla horizontal) */}
        <div className={`hidden md:block ${bgColor} rounded-b-lg overflow-hidden shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`${headerColor} bg-opacity-80`}>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones (Disciplina Positiva)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Mensaje app con IA</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Competencia Socioemocional</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">IDPS</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">App puntos</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={`${rowColor} border-b border-opacity-20 last:border-0`}>
                    <td className="px-3 py-2 text-xs md:text-sm">
                      <div className="font-medium">{item.accion}</div>
                      <div className="text-xs text-gray-600 mt-1">{item.nivelCompetencia}</div>
                    </td>
                    <td className="px-3 py-2 text-xs md:text-sm">{item.mensajeApp}</td>
                    <td className="px-3 py-2 text-xs md:text-sm">{item.competenciaSocioemocional}</td>
                    <td className="px-3 py-2 text-xs md:text-sm">{item.indicadorDesarrollo || '-'}</td>
                    <td className="px-3 py-2 text-xs md:text-sm text-center font-bold">{item.puntuacionApp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-3">
        <BackButton />
      </div>
      
      <header className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Acciones Socioemocionales</h1>
        <p className="text-sm md:text-base text-gray-600">Guía para fomentar el desarrollo socioemocional en el aula</p>
      </header>

      <div className="space-y-4">
        {/* Sección de Regulación Emocional */}
        {renderTable(
          regulacionEmocional, 
          'Regulación Emocional', 
          'bg-amber-50', 
          'bg-amber-600',
          'bg-amber-100'
        )}
        
        {/* Sección de Competencia Social */}
        {renderTable(
          competenciaSocial, 
          'Competencia Social', 
          'bg-blue-50', 
          'bg-blue-600',
          'bg-blue-100'
        )}
        
        {/* Sección de Conciencia Emocional */}
        {renderTable(
          concienciaEmocional, 
          'Conciencia Emocional', 
          'bg-pink-50', 
          'bg-pink-600',
          'bg-pink-100'
        )}
      </div>
      
      <footer className="mt-6 text-center text-xs text-gray-500">
        <p>Esta guía puede adaptarse a las necesidades específicas de sus estudiantes.</p>
      </footer>
    </div>
  );
}

export default SocialEmotionalActionsPageEnhanced;