import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  User, 
  Globe, 
  Moon, 
  Users,
  Shield,
  LogOut,
  Phone,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isEditing, setIsEditing] = useState(false);
  
  const { userProfile, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
  ];

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    toast({
      title: "Theme Updated",
      description: `Switched to ${newIsDark ? 'dark' : 'light'} mode`,
    });
  };

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    if (userProfile) {
      updateProfile({ language: langCode });
    }
    toast({
      title: t('language_changed'),
      description: t('language_changed_message'),
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const addEmergencyContact = () => {
    if (userProfile) {
      const updatedContacts = [
        ...userProfile.emergency_contacts,
        { name: '', phone: '' }
      ];
      updateProfile({ emergency_contacts: updatedContacts });
      setIsEditing(true);
    }
  };

  const removeEmergencyContact = (index: number) => {
    if (userProfile && userProfile.emergency_contacts.length > 1) {
      const updatedContacts = userProfile.emergency_contacts.filter((_, i) => i !== index);
      updateProfile({ emergency_contacts: updatedContacts });
    }
  };

  const updateEmergencyContact = (index: number, field: 'name' | 'phone', value: string) => {
    if (userProfile) {
      const updatedContacts = userProfile.emergency_contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      );
      updateProfile({ emergency_contacts: updatedContacts });
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
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">{t('settings')}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card className="p-4 bg-gradient-surface border-border/50 animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-trust text-trust-foreground">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{userProfile?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{userProfile?.phone}</p>
              {userProfile?.blood_group && (
                <p className="text-xs text-muted-foreground">Blood Group: {userProfile.blood_group}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="p-4 bg-gradient-surface border-border/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center">
              <Moon className="h-5 w-5 mr-2" />
              {t('theme')}
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">{isDarkMode ? t('dark_mode') : t('light_mode')}</p>
                <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-4 bg-gradient-surface border-border/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              {t('language')}
            </h3>
            
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {lang.nativeName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Emergency Contacts */}
        <Card className="p-4 bg-gradient-surface border-border/50 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {t('manage_contacts')}
              </h3>
              <Button
                onClick={addEmergencyContact}
                size="sm"
                variant="outline"
                className="border-border/50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {userProfile?.emergency_contacts.map((contact, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-background/50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{contact.name || 'Unnamed Contact'}</p>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                  {userProfile.emergency_contacts.length > 1 && (
                    <Button
                      onClick={() => removeEmergencyContact(index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-4 bg-gradient-surface border-border/50 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">{t('about')}</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>{t('app_name')}</strong> - {t('app_subtitle')}</p>
              <p>{t('version')}: 1.0.0</p>
              <p>Built with ❤️ for your safety</p>
            </div>
          </div>
        </Card>

        {/* Sign Out */}
        <Card className="p-4 bg-gradient-surface border-border/50 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('logout')}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;