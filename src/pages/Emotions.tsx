import React, { useState } from 'react';
import { 
  Heart, 
  ThumbsUp, 
  Frown, 
  Smile, 
  Meh,
  Star,
  TrendingUp,
  Calendar,
  MessageCircle,
  X
} from 'lucide-react';
import { useEmotions } from '../lib/hooks/useEmotions';
import { EmotionType } from '../lib/types';

export function Emotions() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // TODO: Get actual user ID from auth context
  const { emotions, stats, recordEmotion, getEmotionColor, loading } = useEmotions('user123');

  const emotionOptions = [
    { type: 'happy' as EmotionType, icon: Smile, label: 'Feliz', color: 'green' },
    { type: 'calm' as EmotionType, icon: Meh, label: 'Tranquilo', color: 'blue' },
    { type: 'motivated' as EmotionType, icon: ThumbsUp, label: 'Motivado', color: 'yellow' },
    { type: 'sad' as EmotionType, icon: Frown, label: 'Triste', color: 'purple' }
  ];

  const handleEmotionSelect = (type: EmotionType) => {
    setSelectedEmotion(type);
    setShowNoteInput(true);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) return;
    
    const success = await recordEmotion(selectedEmotion, intensity, note);
    if (success) {
      setSelectedEmotion(null);
      setIntensity(3);
      setNote('');
      setShowNoteInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mis Emociones</h1>
        <p className="text-gray-600">Registra cómo te sientes hoy</p>
      </header>

      {/* Stats Overview */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Racha Diaria</p>
              <p className="text-xl font-bold text-blue-600">{stats.dailyStreak} días</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Índice Semanal</p>
              <p className="text-xl font-bold text-green-600">{stats.weeklyMood}</p>
            </div>
          </div>
        </div>
      )}

      {/* Emotion Selection */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {emotionOptions.map((emotion) => (
          <button
            key={emotion.type}
            onClick={() => handleEmotionSelect(emotion.type)}
            className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${
              selectedEmotion === emotion.type
                ? `border-${emotion.color}-400 bg-${emotion.color}-50`
                : 'border-gray-100 hover:border-gray-200'
            } flex flex-col items-center`}
          >
            <div className={`w-16 h-16 bg-${emotion.color}-100 rounded-full flex items-center justify-center mb-3`}>
              <emotion.icon className={`w-8 h-8 text-${emotion.color}-600`} />
            </div>
            <span className="text-gray-800 font-medium">{emotion.label}</span>
          </button>
        ))}
      </div>

      {/* Intensity Slider */}
      {selectedEmotion && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Qué tan intensa es esta emoción?</h3>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Muy poco</span>
              <span>Moderado</span>
              <span>Muy intenso</span>
            </div>
          </div>
        </div>
      )}

      {/* Note Input */}
      {showNoteInput && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Agregar una nota</h3>
            <button 
              onClick={() => setShowNoteInput(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Quieres agregar más detalles sobre cómo te sientes?"
            className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Submit Button */}
      {selectedEmotion && (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Registrar Emoción
        </button>
      )}

      {/* Recent History */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Registro Reciente</h2>
        <div className="space-y-4">
          {emotions.slice(0, 5).map((emotion, index) => (
            <div key={emotion.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${getEmotionColor(emotion.type)}-100 rounded-full flex items-center justify-center`}>
                    <Heart className={`w-5 h-5 text-${getEmotionColor(emotion.type)}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{emotion.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(emotion.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: emotion.intensity }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              {emotion.note && (
                <div className="mt-3 pl-13">
                  <p className="text-sm text-gray-600">{emotion.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}