import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Phone, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  
  const { sendOTP, verifyOTP } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Simple shield animation data (you can replace with actual Lottie file)
  const shieldAnimation = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 100,
    h: 100,
    nm: "Shield",
    ddd: 0,
    assets: [],
    layers: []
  };

  const handleSendOTP = async () => {
    const raw = phoneNumber.trim();
    const cleaned = raw.replace(/[^\d+]/g, ''); // keep digits and + only

    // Require E.164 format like +919876543210
    const isE164 = /^\+[1-9]\d{7,14}$/.test(cleaned);
    if (!isE164) {
      toast({
        title: "Invalid phone format",
        description: "Use international format, e.g., +91XXXXXXXXXX",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      setPhoneNumber(cleaned); // persist normalized phone
      await sendOTP(cleaned);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${cleaned}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Check phone number and region permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(phoneNumber, otp);
      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center animate-bounce-in">
          <div className="inline-flex p-4 rounded-full bg-gradient-trust text-trust-foreground mb-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('app_name')}
          </h1>
          <p className="text-lg text-primary font-medium mb-1">
            {t('app_subtitle')}
          </p>
          <p className="text-muted-foreground">
            {t('welcome_subtitle')}
          </p>
        </div>

        {/* Phone Number Input */}
        {step === 'phone' && (
          <Card className="p-6 bg-gradient-surface border-border/50 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t('enter_phone')}
                </h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('phone_placeholder')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background border-border/50"
                />
                <p className="text-xs text-muted-foreground">Use international format, e.g., +91XXXXXXXXXX</p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? t('loading') : t('send_otp')}
              </Button>
            </div>
          </Card>
        )}

        {/* OTP Verification */}
        {step === 'otp' && (
          <Card className="p-6 bg-gradient-surface border-border/50 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-safe text-safe-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t('enter_otp')}
                </h2>
              </div>

              <p className="text-sm text-muted-foreground">
                Verification code sent to {phoneNumber}
              </p>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-background border-border/50 text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setStep('phone')}
                  variant="outline"
                  className="flex-1 border-border/50"
                >
                  {t('back')}
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="flex-1 bg-safe text-safe-foreground hover:bg-safe/90"
                >
                  {loading ? t('loading') : t('verify_otp')}
                </Button>
              </div>

              <Button
                onClick={handleSendOTP}
                variant="ghost"
                className="w-full text-primary"
                disabled={loading}
              >
                {t('resend_otp')}
              </Button>
            </div>
          </Card>
        )}

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneAuth;