import React from 'react';
import './Loader.css';

const Loader = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Cargando...', 
  fullScreen = false,
  overlay = false 
}) => {
  const loaderClass = `loader loader-${size} loader-${color}`;
  const containerClass = `loader-container ${fullScreen ? 'loader-fullscreen' : ''} ${overlay ? 'loader-overlay' : ''}`;

  return (
    <div className={containerClass}>
      <div className={loaderClass}>
        <div className="loader-spinner"></div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loader; 