import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  PhoneOff, 
  Settings,
  Clock,
  User,
  Vibrate
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FakeCallProps {
  onCallEnd?: () => void;
}

const FakeCallFeature = ({ onCallEnd }: FakeCallProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [delay, setDelay] = useState("0");
  const [callerName, setCallerName] = useState("Trusted Contact");
  const [isRinging, setIsRinging] = useState(false);
  const { toast } = useToast();

  const triggerFakeCall = () => {
    const delayMs = parseInt(delay) * 1000;
    
    toast({
      title: "📞 Fake Call Scheduled",
      description: delayMs > 0 ? `Call will start in ${delay} seconds` : "Starting call now..."
    });

    setTimeout(() => {
      setIsCallActive(true);
      setIsRinging(true);
      
      // Play ringtone sound
      playRingtone();
      
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000, 500, 1000]);
      }
    }, delayMs);
  };

  const playRingtone = () => {
    try {
      // Create audio context for ringtone
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Generate a simple ringtone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Repeat the ringtone
      if (isRinging) {
        setTimeout(() => {
          if (isRinging) playRingtone();
        }, 1000);
      }
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const acceptCall = () => {
    setIsRinging(false);
    toast({
      title: "📞 Call Connected",
      description: "Fake call is now active. Tap 'End Call' when ready."
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsRinging(false);
    onCallEnd?.();
    toast({
      title: "📱 Call Ended",
      description: "Fake call session completed"
    });
  };

  // Fake Call Screen
  if (isCallActive) {
    return (
      <div className="fixed inset-0 bg-gradient-emergency z-50 flex flex-col items-center justify-center text-emergency-foreground">
        {/* Caller Info */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <User className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-light mb-2">{callerName}</h2>
          <p className="text-lg opacity-80">
            {isRinging ? "Incoming call..." : "Connected"}
          </p>
        </div>

        {/* Call Status */}
        <div className="flex items-center space-x-2 mb-8">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {isRinging ? "Ringing" : "00:01"}
          </span>
        </div>

        {/* Call Actions */}
        <div className="flex space-x-8">
          {isRinging ? (
            <>
              <Button
                onClick={endCall}
                size="lg"
                className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              <Button
                onClick={acceptCall}
                size="lg"
                className="w-16 h-16 rounded-full bg-safe hover:bg-safe/90 text-safe-foreground"
              >
                <Phone className="h-6 w-6" />
              </Button>
            </>
          ) : (
            <Button
              onClick={endCall}
              size="lg"
              className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Additional UI */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" className="text-white/70">
              <Settings className="h-4 w-4 mr-2" />
              Mute
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70">
              <Vibrate className="h-4 w-4 mr-2" />
              Speaker
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-gradient-surface border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Fake Call Setup</h3>
          <Badge variant="secondary">Emergency Tool</Badge>
        </div>

        {/* Caller Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Caller Name</label>
          <input
            type="text"
            value={callerName}
            onChange={(e) => setCallerName(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            placeholder="Enter caller name"
          />
        </div>

        {/* Delay Setting */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Delay</label>
          <Select value={delay} onValueChange={setDelay}>
            <SelectTrigger className="bg-background border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Start Immediately</SelectItem>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trigger Button */}
        <Button 
          onClick={triggerFakeCall}
          className="w-full bg-gradient-trust hover:opacity-90 transition-opacity"
          size="lg"
        >
          <Phone className="h-4 w-4 mr-2" />
          Start Fake Call
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This will simulate an incoming call to help you in emergency situations
        </p>
      </div>
    </Card>
  );
};

export default FakeCallFeature;