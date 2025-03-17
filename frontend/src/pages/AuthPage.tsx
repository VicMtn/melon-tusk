import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import logo from '../assets/images/logo.png';

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Rediriger vers la page d'accueil si l'utilisateur est connecté
  if (isAuthenticated) {
    return <Navigate to="/homepage" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grille de fond */}
      <div 
        className="absolute inset-0 bg-grid-primary/5 bg-[size:20px_20px] opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`
        }}
      />
      
      {/* Container principal avec z-index pour être au-dessus de la grille */}
      <div className="w-full max-w-md text-center relative z-[10]">
        {/* Section logo et titre */}
        <div className="relative z-[20] mb-8 transform hover:scale-105 transition-transform duration-300">
          <img 
            src={logo} 
            alt="Melon Tusk Logo" 
            className="w-32 h-32 mx-auto mb-6 drop-shadow-xl"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Melon Tusk
          </h1>
          <p className="text-gray-600 text-lg">
            Your gateway to cryptocurrency investment training
          </p>
        </div>

        {/* Section modal avec z-index inférieur au logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl transform -skew-y-1" />
          <div className="relative">
            <AuthModal isOpen={true} onClose={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 