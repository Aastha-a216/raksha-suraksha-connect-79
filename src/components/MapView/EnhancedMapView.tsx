import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Phone, 
  Navigation, 
  Filter,
  MapPin,
  Shield,
  Hospital,
  Building,
  Search,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Global Google Maps types
declare global {
  interface Window {
    googleMapsLoaded: boolean;
  }
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

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
  placeId?: string;
}

interface EnhancedMapViewProps {
  onBack?: () => void;
  userLocation?: LocationData | null;
}

const EnhancedMapView = ({ onBack, userLocation }: EnhancedMapViewProps) => {
  const [map, setMap] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'police' | 'hospital' | 'ncc'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [markers, setMarkers] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Default location (Delhi, India) if user location not available
  const defaultLocation = { lat: 28.6139, lng: 77.2090 };

  const initializeMap = useCallback(async () => {
    if (!window.google || !mapRef.current) return;

    const center = userLocation 
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : defaultLocation;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    } as any);

    setMap(mapInstance);

    // Add user location marker if available
    if (userLocation) {
      new window.google.maps.Marker({
        position: center,
        map: mapInstance,
        title: "Your Location",
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });
    }

    // Search for nearby emergency services
    await searchNearbyServices(mapInstance, center);
    setLoading(false);
  }, [userLocation]);

  const searchNearbyServices = async (mapInstance: any, center: any) => {
    if (!window.google) return;

    const service = new (window.google as any).maps.places.PlacesService(mapInstance);
    const newServices: EmergencyService[] = [];

    // Search for police stations
    await searchPlaces(service, center, 'police', newServices);
    
    // Search for hospitals
    await searchPlaces(service, center, 'hospital', newServices);

    // Add mock NCC headquarters (you can replace with real data from Firestore)
    const nccServices: EmergencyService[] = [
      {
        id: 'ncc-1',
        name: 'Delhi NCC Headquarters',
        type: 'ncc',
        distance: '2.1 km',
        phone: '+91-11-23011234',
        address: 'Red Fort, Delhi',
        lat: 28.6562,
        lng: 77.2410,
        available: true
      }
    ];

    const allServices = [...newServices, ...nccServices];
    setServices(allServices);
    
    // Add markers to map
    addMarkersToMap(mapInstance, allServices);
  };

  const searchPlaces = (service: any, center: any, type: 'police' | 'hospital', results: EmergencyService[]) => {
    return new Promise<void>((resolve) => {
      const searchTypes = type === 'police' ? ['police'] : ['hospital'];
      
      service.nearbySearch({
        location: center,
        radius: 5000,
        type: searchTypes
      }, (places: any[], status: any) => {
        if (status === (window.google as any).maps.places.PlacesServiceStatus.OK && places) {
          places.slice(0, 5).forEach((place, index) => {
            if (place.geometry && place.geometry.location) {
              const location = place.geometry.location;
              const distance = calculateDistance(
                center.lat, center.lng,
                location.lat(), location.lng()
              );

              results.push({
                id: `${type}-${index}`,
                name: place.name || `${type === 'police' ? 'Police Station' : 'Hospital'}`,
                type,
                distance: `${distance.toFixed(1)} km`,
                phone: type === 'police' ? '100' : '108',
                address: place.vicinity || 'Address not available',
                lat: location.lat(),
                lng: location.lng(),
                available: true,
                placeId: place.place_id
              });
            }
          });
        }
        resolve();
      });
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const addMarkersToMap = (mapInstance: any, servicesToAdd: EmergencyService[]) => {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    servicesToAdd.forEach(service => {
      const marker = new window.google.maps.Marker({
        position: { lat: service.lat, lng: service.lng },
        map: mapInstance,
        title: service.name,
        icon: getMarkerIcon(service.type)
      });

      marker.addListener('click', () => {
        setSelectedService(service);
        mapInstance.panTo({ lat: service.lat, lng: service.lng });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  };

  const getMarkerIcon = (type: EmergencyService['type']) => {
    const colors = {
      police: '#3B82F6',
      hospital: '#10B981',
      ncc: '#F59E0B'
    };

    const icons = {
      police: '🛡️',
      hospital: '🏥',
      ncc: '🏛️'
    };

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 50 20 50S40 35 40 20C40 8.954 31.046 0 20 0Z" fill="${colors[type]}"/>
          <circle cx="20" cy="20" r="12" fill="white"/>
          <text x="20" y="27" text-anchor="middle" font-size="16">${icons[type]}</text>
        </svg>
      `)}`,
      scaledSize: new window.google.maps.Size(40, 50),
      anchor: new window.google.maps.Point(20, 50)
    };
  };

  // Initialize map when Google Maps loads
  useEffect(() => {
    const initMap = () => {
      if (window.googleMapsLoaded) {
        initializeMap();
      } else {
        window.addEventListener('google-maps-loaded', initializeMap);
        return () => window.removeEventListener('google-maps-loaded', initializeMap);
      }
    };

    initMap();
  }, [initializeMap]);

  const callService = (service: EmergencyService) => {
    toast({
      title: `📞 Calling ${service.name}`,
      description: `Connecting to ${service.phone}...`,
    });
  };

  const getDirections = (service: EmergencyService) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`;
    window.open(url, '_blank');
  };

  const getServiceIcon = (type: EmergencyService['type']) => {
    switch (type) {
      case 'police': return Shield;
      case 'hospital': return Hospital;
      case 'ncc': return Building;
      default: return MapPin;
    }
  };

  const filteredServices = services.filter(service => {
    const matchesFilter = filter === 'all' || service.type === filter;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 p-4">
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Emergency Services Map</h1>
            <p className="text-sm text-muted-foreground">Find nearby police, hospitals & NCC</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50"
            />
          </div>

          <div className="flex space-x-2">
            {(['all', 'police', 'hospital', 'ncc'] as const).map((filterType) => (
              <Button
                key={filterType}
                onClick={() => setFilter(filterType)}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                className="capitalize"
              >
                {filterType === 'all' ? 'All' : filterType}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div ref={mapRef} className="h-96 w-full">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading map...</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Service Details */}
        {selectedService && (
          <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-primary text-primary-foreground">
                {(() => {
                  const ServiceIcon = getServiceIcon(selectedService.type);
                  return <ServiceIcon className="h-4 w-4" />;
                })()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-foreground">{selectedService.name}</h3>
                  <Badge variant="secondary">{selectedService.distance}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedService.address}</p>
                
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={() => callService(selectedService)}
                    size="sm"
                    className="bg-gradient-trust hover:opacity-90"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    onClick={() => getDirections(selectedService)}
                    variant="outline"
                    size="sm"
                    className="border-border/50"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Services List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-foreground">Nearby Services</h2>
          <Badge variant="secondary">{filteredServices.length} found</Badge>
        </div>

        {filteredServices.map((service) => {
          const ServiceIcon = getServiceIcon(service.type);
          return (
            <Card
              key={service.id}
              className="p-4 cursor-pointer hover:shadow-elevated transition-all duration-300"
              onClick={() => setSelectedService(service)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  service.type === 'police' ? 'bg-trust' : 
                  service.type === 'hospital' ? 'bg-safe' : 'bg-warning'
                } text-white`}>
                  <ServiceIcon className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm text-foreground">{service.name}</p>
                    <Badge variant="secondary" className="text-xs">
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
                  className="border-border/50"
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

export default EnhancedMapView;