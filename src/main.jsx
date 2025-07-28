import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core'; // Importar MantineProvider

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado exitosamente:', registration.scope);
        
        // Manejar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nueva versión disponible
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.log('SW registro falló:', error);
      });
  });
}

// Mostrar notificación de actualización solo una vez por actualización
function showUpdateNotification() {
  if (!localStorage.getItem('sw-update-shown')) {
    localStorage.setItem('sw-update-shown', 'true');
    if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar ahora?')) {
      localStorage.removeItem('sw-update-shown'); // Limpiar antes de recargar
      window.location.reload();
    }
  }
}

// Al cargar la página, limpiar la variable para futuras actualizaciones
window.addEventListener('load', () => {
  localStorage.removeItem('sw-update-shown');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider 
      withGlobalStyles 
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
        primaryColor: 'blue',
        primaryShade: { light: 6, dark: 4 },
        colors: {
          blue: [
            '#e3f2fd',
            '#bbdefb', 
            '#90caf9',
            '#64b5f6',
            '#42a5f5',
            '#2196f3',
            '#009fe3', // Color principal de NegocioListo
            '#007bb6',
            '#005a8b',
            '#003d5f'
          ]
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSizes: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px',
          '2xl': '24px',
          '3xl': '30px',
          '4xl': '36px'
        },
        spacing: {
          xs: '8px',
          sm: '12px',
          md: '16px',
          lg: '24px',
          xl: '32px',
          '2xl': '48px'
        },
        radius: {
          xs: '4px',
          sm: '6px',
          md: '8px',
          lg: '12px',
          xl: '16px'
        },
        shadows: {
          xs: '0 1px 3px rgba(0, 0, 0, 0.12)',
          sm: '0 1px 5px rgba(0, 0, 0, 0.15)',
          md: '0 4px 12px rgba(0, 0, 0, 0.1)',
          lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
          xl: '0 12px 32px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <App />
    </MantineProvider>
  </StrictMode>,
)
