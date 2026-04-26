
'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intentar forzar la carga
    video.load();

    const handleScroll = () => {
      if (!containerRef.current || !video || !video.duration) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // El video empieza a "reproducirse" cuando entra al viewport y termina cuando sale
      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;

      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      // Usamos requestAnimationFrame para que la actualización coincida con el refresco de pantalla
      requestAnimationFrame(() => {
        video.currentTime = video.duration * progress;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Llamada inicial para posicionar el video según el scroll actual
    video.onloadedmetadata = () => {
      setIsLoaded(true);
      handleScroll();
    };

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[60vh] md:h-[80vh] bg-background overflow-hidden border-none">
      {/* Bloqueo agresivo de la extensión de velocidad y otros inyectados */}
      <style jsx global>{`
        /* Oculta el controlador de la extensión Video Speed Controller y similares */
        #controller, .vsc-controller, #vsc-column-container {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
        }
      `}</style>

      {/* Gradientes de difuminado con mayor cobertura */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background via-background/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background via-background/90 to-transparent z-20 pointer-events-none" />
      
      <video
        ref={videoRef}
        src="/scrollvideo.mp4"
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        className={`w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
