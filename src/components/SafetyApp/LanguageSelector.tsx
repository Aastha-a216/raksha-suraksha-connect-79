import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  isCompact?: boolean;
}

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  isCompact = false 
}: LanguageSelectorProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    onLanguageChange(languageCode);
    
    toast({
      title: `🌐 Language Changed`,
      description: `App language set to ${language?.nativeName}`,
    });
    
    setIsOpen(false);
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  if (isCompact) {
    return (
      <Select value={selectedLanguage} onValueChange={handleLanguageSelect}>
        <SelectTrigger className="w-40 border-border/50">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{selectedLang.flag}</span>
              <span className="text-sm">{selectedLang.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
                <span className="text-muted-foreground text-sm">
                  {language.nativeName}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Card className="p-6 bg-gradient-surface border-border/50">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary text-primary-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Choose Your Language
          </h3>
        </div>
        
        <p className="text-muted-foreground text-sm">
          Select your preferred language for better communication during emergencies
        </p>

        <div className="grid grid-cols-2 gap-2">
          {languages.map((language, index) => (
            <Button
              key={language.code}
              variant={selectedLanguage === language.code ? "default" : "outline"}
              onClick={() => handleLanguageSelect(language.code)}
              className={`
                justify-start h-auto p-3 transition-all duration-200 animate-slide-up
                ${selectedLanguage === language.code 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'hover:bg-surface border-border/50'
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3 w-full">
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{language.name}</p>
                  <p className="text-xs opacity-70">{language.nativeName}</p>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LanguageSelector;