import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock,
  Shield,
  Hospital,
  Car
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface EmergencyService {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire';
  distance: string;
  phone: string;
  address: string;
  available: boolean;
}

const LocationServices = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const { toast } = useToast();

  // Mock emergency services data
  const emergencyServices: EmergencyService[] = [
    {
      id: 'police-1',
      name: 'Central Police Station',
      type: 'police',
      distance: '0.8 km',
      phone: '100',
      address: 'MG Road, City Center',
      available: true
    },
    {
      id: 'hospital-1',
      name: 'City General Hospital',
      type: 'hospital',
      distance: '1.2 km',
      phone: '108',
      address: 'Hospital Road, Medical District',
      available: true
    },
    {
      id: 'police-2',
      name: 'Traffic Police Station',
      type: 'police',
      distance: '2.1 km',
      phone: '100',
      address: 'Highway Junction',
      available: true
    }
  ];

  useEffect(() => {
    // Auto-request location on component mount
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "⚠️ Location Not Supported",
        description: "Your device doesn't support location services",
        variant: "destructive"
      });
      return;
    }

    setLocationStatus('requesting');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        
        setLocation(locationData);
        setLocationStatus('granted');
        
        toast({
          title: "📍 Location Acquired",
          description: "Your location has been detected successfully",
        });
      },
      (error) => {
        setLocationStatus('denied');
        toast({
          title: "❌ Location Access Denied",
          description: "Please enable location services for safety features",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const shareLocation = () => {
    if (!location) {
      requestLocation();
      return;
    }

    toast({
      title: "📤 Location Shared",
      description: "Live location sent to all emergency contacts",
    });
  };

  const callEmergencyService = (service: EmergencyService) => {
    toast({
      title: `📞 Calling ${service.name}`,
      description: `Connecting to ${service.phone}...`,
    });
  };

  const getServiceIcon = (type: EmergencyService['type']) => {
    switch (type) {
      case 'police':
        return Shield;
      case 'hospital':
        return Hospital;
      case 'fire':
        return Car;
      default:
        return Shield;
    }
  };

  const getServiceColor = (type: EmergencyService['type']) => {
    switch (type) {
      case 'police':
        return 'bg-trust';
      case 'hospital':
        return 'bg-safe';
      case 'fire':
        return 'bg-emergency';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Location & Services</h3>
      
      {/* Location Status Card */}
      <Card className="p-4 bg-gradient-surface border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              locationStatus === 'granted' ? 'bg-safe' : 
              locationStatus === 'requesting' ? 'bg-warning' : 'bg-muted'
            } text-white transition-colors duration-300`}>
              <MapPin className={`h-5 w-5 ${locationStatus === 'requesting' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">
                {locationStatus === 'granted' ? 'Location Active' :
                 locationStatus === 'requesting' ? 'Getting Location...' :
                 locationStatus === 'denied' ? 'Location Denied' : 'Location Inactive'}
              </p>
              {location && (
                <p className="text-xs text-muted-foreground">
                  Accuracy: {Math.round(location.accuracy)}m • <Clock className="inline h-3 w-3" /> {new Date(location.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          <Button
            onClick={shareLocation}
            size="sm"
            variant={location ? "default" : "outline"}
            className="animate-bounce-in"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </Card>

      {/* Emergency Services */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">Nearby Emergency Services</h4>
          <Badge variant="secondary" className="text-xs">
            {emergencyServices.length} found
          </Badge>
        </div>
        
        {emergencyServices.map((service, index) => {
          const ServiceIcon = getServiceIcon(service.type);
          
          return (
            <Card 
              key={service.id}
              className="p-4 hover:shadow-elevated transition-all duration-300 animate-slide-up border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getServiceColor(service.type)} text-white`}>
                  <ServiceIcon className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm text-foreground">{service.name}</p>
                    <Badge 
                      variant={service.available ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {service.distance}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{service.address}</p>
                </div>
                
                <Button
                  onClick={() => callEmergencyService(service)}
                  size="sm"
                  variant="outline"
                  className="hover:bg-trust hover:text-trust-foreground border-border/50"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  {service.phone}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LocationServices;