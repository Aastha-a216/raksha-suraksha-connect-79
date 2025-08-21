import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, MapPin, Users, Hospital, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  // Simple animation data (replace with actual Lottie files)
  const safetyAnimation = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "Safety",
    ddd: 0,
    assets: [],
    layers: []
  };

  const onboardingSteps = [
    {
      icon: Shield,
      title: t('onboarding_safety'),
      description: "Stay protected with our 24/7 monitoring system that watches over your safety",
      animation: safetyAnimation,
      color: "bg-gradient-trust"
    },
    {
      icon: MapPin,
      title: t('onboarding_location'),
      description: "Share your live location with trusted contacts during emergencies",
      animation: safetyAnimation,
      color: "bg-gradient-safe"
    },
    {
      icon: Users,
      title: t('onboarding_contacts'),
      description: "Connect with your emergency contacts for instant help when you need it most",
      animation: safetyAnimation,
      color: "bg-primary"
    },
    {
      icon: Hospital,
      title: t('onboarding_services'),
      description: "Find nearby police stations, hospitals, and NCC headquarters instantly",
      animation: safetyAnimation,
      color: "bg-secondary"
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-primary' : 
                index < currentStep ? 'bg-safe' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <Card className="p-8 bg-gradient-surface border-border/50 animate-slide-up text-center">
          <div className="space-y-6">
            {/* Animation/Icon */}
            <div className="flex justify-center mb-6">
              <div className={`p-6 rounded-full ${currentStepData.color} text-white animate-bounce-in`}>
                <StepIcon className="h-12 w-12" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground animate-fade-in">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed animate-fade-in">
                {currentStepData.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 0}
            className="border-border/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              onClick={onComplete}
              variant="ghost"
              className="text-muted-foreground"
            >
              {t('skip')}
            </Button>
            
            <Button
              onClick={nextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {currentStep === onboardingSteps.length - 1 ? t('done') : t('next')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* App Branding */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            {t('app_name')} • {t('app_subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;