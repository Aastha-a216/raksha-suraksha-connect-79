import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface LocationTrackerProps {
  onLocationUpdate?: (location: LocationData) => void;
  autoTrack?: boolean;
  trackingInterval?: number;
}

const LocationTracker = ({ 
  onLocationUpdate, 
  autoTrack = true, 
  trackingInterval = 15000 
}: LocationTrackerProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'tracking'>('idle');
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  const requestHighAccuracyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "❌ Location Not Supported",
        description: "Your device doesn't support location services",
        variant: "destructive"
      });
      return;
    }

    setLocationStatus('requesting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };

        // Try to get address using reverse geocoding
        try {
          const address = await reverseGeocode(locationData.latitude, locationData.longitude);
          locationData.address = address;
        } catch (error) {
          console.log("Geocoding failed:", error);
        }
        
        setLocation(locationData);
        setLocationStatus('granted');
        setLastUpdate(Date.now());
        onLocationUpdate?.(locationData);
        
        toast({
          title: "📍 Location Updated",
          description: `Accuracy: ${Math.round(locationData.accuracy)}m`,
        });
      },
      (error) => {
        setLocationStatus('denied');
        
        let errorMessage = "Please enable location services";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable in browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Try again.";
            break;
        }
        
        toast({
          title: "❌ Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 // Always get fresh location
      }
    );
  }, [onLocationUpdate, toast]);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // If Google Maps is available, use it for geocoding
    if (window.google && window.google.maps) {
      return new Promise((resolve, reject) => {
        const geocoder = new (window.google as any).maps.Geocoder();
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results[0].formatted_address);
            } else {
              reject('Geocoding failed');
            }
          }
        );
      });
    }
    
    // Fallback to a simple coordinate display
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const startTracking = useCallback(() => {
    if (!isTracking) {
      setIsTracking(true);
      setLocationStatus('tracking');
      requestHighAccuracyLocation();
      
      toast({
        title: "🎯 Location Tracking Started",
        description: `Updating every ${trackingInterval / 1000} seconds`
      });
    }
  }, [isTracking, requestHighAccuracyLocation, trackingInterval, toast]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setLocationStatus(location ? 'granted' : 'idle');
    
    toast({
      title: "⏹️ Location Tracking Stopped",
      description: "Location updates paused"
    });
  }, [location, toast]);

  // Auto-start tracking on mount if enabled
  useEffect(() => {
    if (autoTrack) {
      startTracking();
    }
  }, [autoTrack, startTracking]);

  // Tracking interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        requestHighAccuracyLocation();
      }, trackingInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, trackingInterval, requestHighAccuracyLocation]);

  const getStatusIcon = () => {
    switch (locationStatus) {
      case 'granted':
      case 'tracking':
        return CheckCircle;
      case 'requesting':
        return RefreshCw;
      case 'denied':
        return AlertTriangle;
      default:
        return MapPin;
    }
  };

  const getStatusColor = () => {
    switch (locationStatus) {
      case 'granted':
      case 'tracking':
        return 'bg-safe';
      case 'requesting':
        return 'bg-warning';
      case 'denied':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (locationStatus) {
      case 'granted':
        return 'Location Active';
      case 'tracking':
        return 'Tracking Location';
      case 'requesting':
        return 'Getting Location...';
      case 'denied':
        return 'Location Denied';
      default:
        return 'Location Inactive';
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className="p-4 bg-gradient-surface border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Location Tracking</h3>
          {isTracking && (
            <Badge variant="secondary" className="animate-pulse">
              Live
            </Badge>
          )}
        </div>

        {/* Status Display */}
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor()} text-white transition-colors duration-300`}>
            <StatusIcon className={`h-5 w-5 ${locationStatus === 'requesting' ? 'animate-spin' : ''}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-foreground">
              {getStatusText()}
            </p>
            {location && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Accuracy: {Math.round(location.accuracy)}m
                </p>
                {location.address && (
                  <p className="text-xs text-muted-foreground">
                    {location.address}
                  </p>
                )}
                {lastUpdate && (
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(lastUpdate).toLocaleTimeString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          {!isTracking ? (
            <Button
              onClick={startTracking}
              className="flex-1 bg-gradient-safe hover:opacity-90"
              size="sm"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Start Tracking
            </Button>
          ) : (
            <Button
              onClick={stopTracking}
              variant="outline"
              className="flex-1 border-border/50"
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Stop Tracking
            </Button>
          )}
          
          <Button
            onClick={requestHighAccuracyLocation}
            variant="outline"
            size="sm"
            className="border-border/50"
            disabled={locationStatus === 'requesting'}
          >
            <RefreshCw className={`h-4 w-4 ${locationStatus === 'requesting' ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {locationStatus === 'denied' && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">Location Access Required</p>
            <p className="text-xs text-muted-foreground mt-1">
              To use emergency features, please enable location in your browser settings and refresh the page.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LocationTracker;