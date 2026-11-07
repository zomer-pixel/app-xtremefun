import React from 'react';
import './Home.css';

// 1. IMPORTAMOS TUS IMÁGENES LOCALES
// Asegúrate de que las extensiones (.jpg, .png) coincidan con tus archivos reales
import foto1 from '../assets/xtremefun1.webp'; 
import foto2 from '../assets/xtremefun2.webp';
import foto3 from '../assets/xtremefun3.webp';

const Home = () => {
  return (
    <main className="home-container">
      {/* Sección Izquierda: Textos y Botones */}
      <div className="hero-text-section">
        <span className="tagline">✨ PARQUE DE DIVERSIONES - BOLIVIA</span>
        
        <h1 className="hero-title">
          MÁS JUEGOS.<br />
          MÁS EMOCIÓN.<br />
          <span className="highlight-yellow">MÁS XTREME.</span>
        </h1>
        
        <p className="hero-description">
          Salta, juega, compite y celebra en Xtreme Fun, tu parque de diversiones en La Paz y El Alto. ¡Hay mucho por descubrir!
        </p>

        <div className="buttons-container">
          <button className="btn-yellow">Encuentra tu diversión ↗</button>
        </div>

        <div className="links-container">
          <a href="#cumpleanos" className="link-underline">Quiero celebrar ↗</a>
          <div className="sucursales-info">
            <p>Más formas de divertirte</p>
            <h3>3 sucursales para elegir</h3>
          </div>
        </div>
      </div>

      {/* Sección Derecha: Collage de Imágenes */}
      <div className="hero-images-section">
        <div className="image-collage">
          
          {/* Cuadro 1: Amarillo (Izquierda Arriba) */}
          <div className="image-box img-1">
            <img src={foto1} alt="Diversión en Trampolín" className="bg-image" />
            <span className="badge-red">¡OTRA VEZ!</span>
          </div>

          {/* Cuadro 2: Blanco (Derecha, alto) */}
          <div className="image-box img-2">
            <img src={foto2} alt="Tirolesa Xtreme" className="bg-image" />
            <span className="badge-yellow">CERO<br/>RUTINA</span>
          </div>

          {/* Cuadro 3: Verde (Izquierda Abajo) */}
          <div className="image-box img-3">
            <img src={foto3} alt="Juego en equipo" className="bg-image" />
            <span className="badge-green">ATRÉVETE A MÁS</span>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Home;