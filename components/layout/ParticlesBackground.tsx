export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-60" >
      {Array.from({ length: 200 }).map((_, index) => {
        const xStart = Math.random() * 100; // Position X de départ (0vw à 100vw)
        const offset = -10 + Math.random() * 20; // Amplitude du balancement (-10vw à +10vw)
        const xMid = xStart + offset;
        const xEnd = xStart + offset / 2;

        const yoyoTimePct = 30 + Math.random() * 50; // Point d'inflexion yoyo (30% à 80%)
        const yMid = 100 - yoyoTimePct; // Hauteur intermédiaire en vh

        const scale = Math.random(); // Échelle aléatoire
        const duration = 40 + Math.random() * 60; // Durée lente (10s à 30s)
        const delay = -(Math.random() * 30); // Décalage négatif : tout l'écran est rempli dès t=0 !
        const opacity = Math.random();

        return (
          <div
            key={index}
            className="particle"
            style={
              {
                '--x-start': `${xStart}vw`,
                '--x-mid': `${xMid}vw`,
                '--x-end': `${xEnd}vw`,
                '--y-mid': `${yMid}vh`,
                '--scale': scale,
                '--duration': `${duration}s`,
                '--delay': `${delay}s`,
                '--opacity': opacity,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}