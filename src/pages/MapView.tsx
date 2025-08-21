import React, { useState, useEffect, useCallback } from 'react';

// Google Maps type definitions
declare global {
  interface Window {
    google: typeof google;
  }
  
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element, opts?: MapOptions);
      }
      class Marker {
        constructor(opts?: MarkerOptions);
        addListener(eventName: string, handler: Function): void;
      }
      class LatLng {}
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }
      interface MapOptions {
        center: LatLngLiteral;
        zoom: number;
        styles?: MapTypeStyle[];
      }
      interface MarkerOptions {
        position: LatLngLiteral;
        map?: Map;
        title?: string;
        icon?: string | Icon;
      }
      interface MapTypeStyle {
        featureType?: string;
        elementType?: string;
        stylers?: Array<{ [key: string]: any }>;
      }
      interface Icon {
        url: string;
        scaledSize: Size;
        anchor: Point;
      }
      class Size {
        constructor(width: number, height: number);
      }
      class Point {
        constructor(x: number, y: number);
      }
    }
  }
}
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Hospital, 
  Car,
  Phone,
  Navigation,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface EmergencyService {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'ncc';
  distance: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  available: boolean;
}

const MapView = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const { t } = useTranslation();

  // Mock emergency services data
  const emergencyServices: EmergencyService[] = [
    {
      id: 'police-1',
      name: 'Central Police Station',
      type: 'police',
      distance: '0.8 km',
      phone: '100',
      address: 'MG Road, City Center',
      lat: 12.9716,
      lng: 77.5946,
      available: true
    },
    {
      id: 'hospital-1',
      name: 'City General Hospital',
      type: 'hospital',
      distance: '1.2 km',
      phone: '108',
      address: 'Hospital Road, Medical District',
      lat: 12.9726,
      lng: 77.5956,
      available: true
    },
    {
      id: 'ncc-1',
      name: 'NCC Headquarters',
      type: 'ncc',
      distance: '2.1 km',
      phone: '1800-11-8004',
      address: 'NCC Campus, Defense Area',
      lat: 12.9706,
      lng: 77.5936,
      available: true
    }
  ];

  // Initialize map
  const initMap = useCallback(() => {
    if (!userLocation) return;

    const mapOptions = {
      center: userLocation,
      zoom: 15,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    };

    const newMap = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      mapOptions
    );

    // Add user location marker
    new google.maps.Marker({
      position: userLocation,
      map: newMap,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 12)
      }
    });

    // Add emergency service markers
    emergencyServices.forEach((service) => {
      const marker = new google.maps.Marker({
        position: { lat: service.lat, lng: service.lng },
        map: newMap,
        title: service.name,
        icon: {
          url: getMarkerIcon(service.type),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      marker.addListener('click', () => {
        setSelectedService(service);
      });
    });

    setMap(newMap);
    setLoading(false);
  }, [userLocation]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location (Bangalore)
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
          toast({
            title: "Location Access",
            description: "Using default location. Please enable GPS for accurate results.",
            variant: "destructive"
          });
        }
      );
    } else {
      // Use default location
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
    }
  }, [toast]);

  // Initialize map when location is available
  useEffect(() => {
    if (userLocation && window.google) {
      initMap();
    }
  }, [userLocation, initMap]);

  const getMarkerIcon = (type: EmergencyService['type']) => {
    const colors = {
      police: '#1E40AF',
      hospital: '#059669',
      ncc: '#DC2626'
    };
    
    const icons = {
      police: '🚔',
      hospital: '🏥',
      ncc: '🛡️'
    };

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="${colors[type]}"/>
        <text x="16" y="20" font-size="16" text-anchor="middle" fill="white">${icons[type]}</text>
      </svg>
    `)}`;
  };

  const getServiceIcon = (type: EmergencyService['type']) => {
    switch (type) {
      case 'police':
        return Shield;
      case 'hospital':
        return Hospital;
      case 'ncc':
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
      case 'ncc':
        return 'bg-emergency';
      default:
        return 'bg-primary';
    }
  };

  const callService = (service: EmergencyService) => {
    toast({
      title: `📞 Calling ${service.name}`,
      description: `Connecting to ${service.phone}...`,
    });
  };

  const getDirections = (service: EmergencyService) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${service.lat},${service.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">{t('map_view')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div 
          id="map" 
          className="w-full h-96 bg-muted"
          style={{ minHeight: '400px' }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">{t('loading')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Service Info Card */}
        {selectedService && (
          <Card className="absolute bottom-4 left-4 right-4 p-4 bg-background border-border/50 shadow-lg animate-slide-up">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getServiceColor(selectedService.type)} text-white`}>
                    {React.createElement(getServiceIcon(selectedService.type), { className: "h-4 w-4" })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedService.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedService.address}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {selectedService.distance}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedService(null)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => callService(selectedService)}
                  className="flex-1 bg-emergency text-emergency-foreground hover:bg-emergency/90"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t('call_now')}
                </Button>
                <Button
                  onClick={() => getDirections(selectedService)}
                  variant="outline"
                  className="flex-1 border-border/50"
                  size="sm"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {t('directions')}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Services List */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{t('nearby_services')}</h2>
        
        {emergencyServices.map((service, index) => {
          const ServiceIcon = getServiceIcon(service.type);
          
          return (
            <Card 
              key={service.id}
              className="p-4 hover:shadow-elevated transition-all duration-300 animate-slide-up border-border/50 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedService(service)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    callService(service);
                  }}
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

      {/* Google Maps Script */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`}
        async
        defer
      ></script>
    </div>
  );
};

export default MapView;