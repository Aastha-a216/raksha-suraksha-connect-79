import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Settings, 
  Moon, 
  Sun,
  Bell,
  User,
  Map
} from 'lucide-react';
import EmergencyButton from '@/components/SafetyApp/EmergencyButton';
import QuickActions from '@/components/SafetyApp/QuickActions';
import LocationServices from '@/components/SafetyApp/LocationServices';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { userProfile, signOut } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Check for dark mode preference
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

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
    console.log('Emergency activated for user:', userProfile?.name);
    
    // Send notifications to emergency contacts
    toast({
      title: t('sos_activated'),
      description: t('sos_message'),
    });
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    toast({
      title: t('language_changed'),
      description: t('language_changed_message'),
    });
  };

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
                <h1 className="text-lg font-bold text-foreground">{t('app_name')}</h1>
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
              
              <Link to="/settings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
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
              <p className="font-medium">
                {t('welcome_back')}, {userProfile?.name || 'User'}!
              </p>
              <p className="text-sm opacity-90">{t('you_are_safe')}</p>
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

        {/* Map View Button */}
        <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <Link to="/map">
            <Card className="p-4 bg-gradient-surface border-border/50 hover:shadow-elevated transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-primary text-primary-foreground">
                  <Map className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{t('map_view')}</h3>
                  <p className="text-sm text-muted-foreground">
                    View nearby emergency services on map
                  </p>
                </div>
                <div className="text-primary">→</div>
              </div>
            </Card>
          </Link>
        </div>

        {/* App Info Footer */}
        <Card className="p-4 bg-surface border-border/50 animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {t('app_name')} - {t('app_subtitle')}
              </span>
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

export default Dashboard;