import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, className = '' }) => {
  // Extraer el ID del video de YouTube de la URL
  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`bg-red-50 p-4 rounded-lg ${className}`}>
        <p className="text-red-500">URL de video inválida</p>
      </div>
    );
  }

  return (
    <div className={`video-container ${className}`}>
      {title && <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>}
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || "Video de YouTube"}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};