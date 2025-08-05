import { useState, useEffect } from 'react';
import { Emotion, EmotionType, EmotionStats } from '../types';

export function useEmotions(userId: string) {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [stats, setStats] = useState<EmotionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmotions();
  }, [userId]);

  const fetchEmotions = async () => {
    try {
      setLoading(true);
      // Implementar llamada a API real
      const emotions = await fetch(`/api/emotions/${userId}`)
        .then(res => res.json())
        .catch(() => []);
      setEmotions(emotions || []);

      // Obtener estadísticas reales
      const stats = await fetch(`/api/emotions/stats/${userId}`)
        .then(res => res.json())
        .catch(() => null);
      setStats(stats);
    } catch (err) {
      setError('Error al cargar las emociones');
    } finally {
      setLoading(false);
    }
  };

  const recordEmotion = async (type: EmotionType, intensity: number, note?: string) => {
    try {
      const newEmotion: Emotion = {
        id: Date.now().toString(), // Temporary ID
        type,
        intensity,
        note,
        timestamp: new Date(),
        userId
      };
      
      // TODO: Implement API call to save emotion
      setEmotions(prev => [newEmotion, ...prev]);
      return true;
    } catch (err) {
      setError('Error al registrar la emoción');
      return false;
    }
  };

  const getEmotionColor = (type: EmotionType): string => {
    const colors: Record<EmotionType, string> = {
      happy: 'green',
      calm: 'blue',
      motivated: 'yellow',
      sad: 'purple',
      angry: 'red',
      anxious: 'orange',
      tired: 'gray',
      excited: 'pink'
    };
    return colors[type];
  };

  return {
    emotions,
    stats,
    loading,
    error,
    recordEmotion,
    getEmotionColor,
    refreshEmotions: fetchEmotions
  };
}