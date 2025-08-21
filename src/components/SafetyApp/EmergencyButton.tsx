import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyButtonProps {
  onEmergencyActivate: () => void;
}

const EmergencyButton = ({ onEmergencyActivate }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const { toast } = useToast();

  const handleEmergencyPress = () => {
    setIsPressed(true);
    onEmergencyActivate();
    
    toast({
      title: "🚨 Emergency Alert Activated",
      description: "Your emergency contacts have been notified",
    });

    // Reset after animation
    setTimeout(() => setIsPressed(false), 3000);
  };

  return (
    <div className="relative flex flex-col items-center space-y-4">
      <div className="relative">
        <Button
          onClick={handleEmergencyPress}
          className={`
            relative h-32 w-32 rounded-full bg-gradient-emergency text-emergency-foreground
            shadow-emergency transition-all duration-300 hover:scale-105
            ${isPressed ? 'sos-pulse animate-shake' : 'animate-sos-glow'}
            border-4 border-emergency-glow/30
          `}
          disabled={isPressed}
        >
          <div className="flex flex-col items-center space-y-1">
            <Shield className="h-10 w-10" />
            <span className="text-lg font-bold">SOS</span>
          </div>
        </Button>
        
        {/* Ripple effect rings */}
        <div className="absolute inset-0 rounded-full border-2 border-emergency/30 animate-sos-ripple pointer-events-none" />
        <div className="absolute inset-0 rounded-full border-2 border-emergency/20 animate-sos-ripple [animation-delay:1s] pointer-events-none" />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Press for emergency help
        </p>
        <p className="text-xs text-muted-foreground">
          Hold to activate in 3 seconds
        </p>
      </div>
      
      {isPressed && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce-in">
          <div className="bg-emergency text-emergency-foreground px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">Contacting help...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;