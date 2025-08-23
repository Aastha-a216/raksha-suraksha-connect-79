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
  Map,
  Flashlight,
  Volume2,
  Share2,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmergencyButton from '@/components/SafetyApp/EmergencyButton';
import QuickActions from '@/components/SafetyApp/QuickActions';
import LocationServices from '@/components/SafetyApp/LocationServices';
import FakeCallFeature from '@/components/FakeCall/FakeCallFeature';
import LocationTracker from '@/components/LocationDetection/LocationTracker';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const { userProfile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      title: "🚨 SOS Activated",
      description: "Emergency contacts have been notified with your location",
    });
  };

  const handleLocationUpdate = (location: any) => {
    setUserLocation(location);
  };

  const triggerFlashlight = () => {
    toast({
      title: "🔦 Flashlight",
      description: "Flashlight activated (requires native app)"
    });
  };

  const triggerSiren = () => {
    toast({
      title: "🚨 Siren",
      description: "Emergency siren activated"
    });
  };

  const shareLocation = () => {
    if (userLocation) {
      toast({
        title: "📍 Location Shared",
        description: "Live location sent to emergency contacts"
      });
    } else {
      toast({
        title: "❌ Location Required",
        description: "Please enable location tracking first"
      });
    }
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
                <h1 className="text-lg font-bold text-foreground">Raksha Suraksha</h1>
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
              
              <Button
                onClick={() => navigate('/settings')}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
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
                Welcome back, {userProfile?.name || 'User'}!
              </p>
              <p className="text-sm opacity-90">You are safe & protected</p>
            </div>
            <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
              <Bell className="h-3 w-3 mr-1" />
              Safe
            </Badge>
          </div>
        </Card>

        {/* Location Tracking */}
        <LocationTracker 
          onLocationUpdate={handleLocationUpdate}
          autoTrack={true}
          trackingInterval={15000}
        />

        {/* Emergency SOS Button */}
        <div className="text-center py-6 animate-bounce-in">
          <EmergencyButton onEmergencyActivate={handleEmergencyActivate} />
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="p-4 bg-gradient-surface border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={triggerFlashlight}
              className="h-16 bg-gradient-trust hover:opacity-90 flex-col space-y-1"
            >
              <Flashlight className="h-5 w-5" />
              <span className="text-xs">Flashlight</span>
            </Button>
            
            <Button 
              onClick={triggerSiren}
              className="h-16 bg-gradient-emergency hover:opacity-90 flex-col space-y-1"
            >
              <Volume2 className="h-5 w-5" />
              <span className="text-xs">Siren</span>
            </Button>
            
            <Button 
              onClick={shareLocation}
              className="h-16 bg-gradient-safe hover:opacity-90 flex-col space-y-1"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-xs">Share Location</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/map')}
              className="h-16 bg-warning hover:bg-warning/90 text-warning-foreground flex-col space-y-1"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Emergency Map</span>
            </Button>
          </div>
        </Card>

        {/* Fake Call Feature */}
        <FakeCallFeature />

        {/* Legacy Location Services */}
        <LocationServices />

        {/* App Info Footer */}
        <Card className="p-4 bg-surface border-border/50 animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Raksha Suraksha - Your Safety Companion
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