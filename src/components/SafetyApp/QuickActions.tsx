import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Phone, 
  Flashlight, 
  MapPin, 
  Users, 
  Volume2,
  Smartphone 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QuickActions = () => {
  const { toast } = useToast();

  const quickActions = [
    {
      id: 'fake-call',
      icon: Phone,
      label: 'Fake Call',
      description: 'Receive a fake call to escape',
      color: 'bg-gradient-trust',
      onClick: () => {
        toast({
          title: "📞 Fake Call Activated",
          description: "Incoming call in 5 seconds...",
        });
      }
    },
    {
      id: 'torch-siren',
      icon: Flashlight,
      label: 'Torch + Siren',
      description: 'Activate flashlight and siren',
      color: 'bg-gradient-safe',
      onClick: () => {
        toast({
          title: "🔦 Torch & Siren Active",
          description: "Maximum brightness and sound alert",
        });
      }
    },
    {
      id: 'share-location',
      icon: MapPin,
      label: 'Share Location',
      description: 'Send live location to contacts',
      color: 'bg-primary',
      onClick: () => {
        toast({
          title: "📍 Location Shared",
          description: "Live location sent to emergency contacts",
        });
      }
    },
    {
      id: 'emergency-contacts',
      icon: Users,
      label: 'Emergency Contacts',
      description: 'Quick call to saved contacts',
      color: 'bg-secondary',
      onClick: () => {
        toast({
          title: "👥 Calling Contacts",
          description: "Connecting to emergency contacts...",
        });
      }
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Card 
            key={action.id}
            className="p-0 overflow-hidden hover:shadow-elevated transition-all duration-300 animate-slide-up float-card border-border/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Button
              onClick={action.onClick}
              variant="ghost"
              className="h-auto p-4 w-full flex flex-col items-center space-y-2 hover:bg-surface/50"
            >
              <div className={`p-3 rounded-full ${action.color} text-white`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm text-foreground">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {action.description}
                </p>
              </div>
            </Button>
          </Card>
        ))}
      </div>
      
      {/* Shake to Alert Feature */}
      <Card className="p-4 bg-gradient-surface border-border/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-warning text-warning-foreground">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-foreground">Shake to Alert</p>
            <p className="text-xs text-muted-foreground">Shake your device to activate SOS</p>
          </div>
          <div className="w-2 h-2 bg-safe rounded-full animate-pulse"></div>
        </div>
      </Card>
    </div>
  );
};

export default QuickActions;