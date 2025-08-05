/**
 * Formatea una fecha a una representación de tiempo relativo.
 * Por ejemplo: "hace 5 minutos", "hace 1 hora", "ayer", etc.
 * 
 * @param date La fecha a formatear
 * @returns Texto con el tiempo relativo
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Menos de un minuto
  if (diffInSeconds < 60) {
    return 'ahora mismo';
  }
  
  // Menos de una hora
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  // Menos de un día
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  
  // Menos de una semana
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    
    if (days === 1) {
      return 'ayer';
    }
    
    return `hace ${days} días`;
  }
  
  // Menos de un mes
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  
  // Para fechas más antiguas, mostrar la fecha completa
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea una fecha para mostrar solo la hora si es del mismo día,
 * "Ayer" si fue ayer, o la fecha completa si es más antigua.
 * 
 * @param date La fecha a formatear
 * @returns Texto con el formato apropiado según la antigüedad
 */
export function formatMessageDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Si es de hoy, mostrar solo la hora
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Si es de ayer, mostrar "Ayer"
  if (messageDate.getTime() === yesterday.getTime()) {
    return 'Ayer';
  }
  
  // Si es de esta semana, mostrar el día de la semana
  if (messageDate > new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  }
  
  // Para fechas más antiguas, mostrar la fecha completa
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}
