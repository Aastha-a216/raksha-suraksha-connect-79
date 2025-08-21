import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  Bell,
  User
} from "lucide-react";
import EmergencyButton from "@/components/SafetyApp/EmergencyButton";
import QuickActions from "@/components/SafetyApp/QuickActions";
import LanguageSelector from "@/components/SafetyApp/LanguageSelector";
import LocationServices from "@/components/SafetyApp/LocationServices";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userName, setUserName] = useState('User');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking if user is new (in real app, check local storage or backend)
    const isNewUser = !localStorage.getItem('raksha_onboarding_complete');
    if (isNewUser) {
      setShowLanguageSelector(true);
    } else {
      setIsOnboardingComplete(true);
    }

    // Check for dark mode preference
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLanguageComplete = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
    setIsOnboardingComplete(true);
    localStorage.setItem('raksha_onboarding_complete', 'true');
    localStorage.setItem('raksha_language', language);
  };

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleEmergencyActivate = () => {
    // In real app, this would trigger actual emergency protocols
    console.log('Emergency activated for user:', userName);
  };

  // Language selection screen
  if (showLanguageSelector) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center animate-bounce-in">
            <div className="inline-flex p-4 rounded-full bg-gradient-trust text-trust-foreground mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Raksha Bandhan
            </h1>
            <p className="text-lg text-primary font-medium mb-1">
              सुरक्षा App
            </p>
            <p className="text-muted-foreground">
              Your personal safety companion
            </p>
          </div>
          
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageComplete}
          />
        </div>
      </div>
    );
  }

  // Main Safety Dashboard
  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-trust text-trust-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Raksha</h1>
                <p className="text-xs text-muted-foreground">Stay Safe • Stay Protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                {isDarkMode ? 
                  <Sun className="h-4 w-4" /> : 
                  <Moon className="h-4 w-4" />
                }
              </Button>
              
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                isCompact
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="p-4 bg-gradient-trust text-trust-foreground border-0 animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Welcome back, {userName}!</p>
              <p className="text-sm opacity-90">You're protected and connected</p>
            </div>
            <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
              <Bell className="h-3 w-3 mr-1" />
              Safe
            </Badge>
          </div>
        </Card>

        {/* Emergency SOS Button */}
        <div className="text-center py-6 animate-bounce-in">
          <EmergencyButton onEmergencyActivate={handleEmergencyActivate} />
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <QuickActions />
        </div>

        {/* Location Services */}
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <LocationServices />
        </div>

        {/* App Info Footer */}
        <Card className="p-4 bg-surface border-border/50 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Raksha Bandhan - Suraksha App</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ for your safety • Emergency services integration available
            </p>
            <div className="flex justify-center space-x-4 pt-2">
              <Badge variant="outline" className="text-xs">
                🌐 Multi-language
              </Badge>
              <Badge variant="outline" className="text-xs">
                📱 Mobile Ready
              </Badge>
              <Badge variant="outline" className="text-xs">
                🔒 Secure
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
