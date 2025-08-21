import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import PhoneAuth from '@/components/auth/PhoneAuth';
import ProfileSetup from '@/components/auth/ProfileSetup';
import Dashboard from '@/pages/Dashboard';
import MapView from '@/pages/MapView';
import Settings from '@/pages/Settings';

const AppContent = () => {
  const { user, userProfile, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('onboarding_complete'));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={() => {
          localStorage.setItem('onboarding_complete', 'true');
          setShowOnboarding(false);
        }} 
      />
    );
  }

  if (!user) return <PhoneAuth />;
  if (!userProfile?.name) return <ProfileSetup />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  </AuthProvider>
);

export default App;
