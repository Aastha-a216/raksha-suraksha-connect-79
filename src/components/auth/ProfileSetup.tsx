import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface Contact {
  name: string;
  phone: string;
}

const ProfileSetup = () => {
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [language, setLanguage] = useState('en');
  const [contacts, setContacts] = useState<Contact[]>([{ name: '', phone: '' }]);
  const [loading, setLoading] = useState(false);
  
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
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

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, field: 'name' | 'phone', value: string) => {
    const updatedContacts = contacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(updatedContacts);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty contacts
    const validContacts = contacts.filter(contact => 
      contact.name.trim() && contact.phone.trim()
    );

    if (validContacts.length < 1) {
      toast({
        title: "Error",
        description: "Please add at least one emergency contact",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        blood_group: bloodGroup || undefined,
        emergency_contacts: validContacts,
        language
      });

      // Update app language
      i18n.changeLanguage(language);

      toast({
        title: "Success",
        description: "Profile setup completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center animate-bounce-in">
          <div className="inline-flex p-4 rounded-full bg-gradient-trust text-trust-foreground mb-4">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('setup_profile')}
          </h1>
          <p className="text-muted-foreground">
            Help us personalize your safety experience
          </p>
        </div>

        <Card className="p-6 bg-gradient-surface border-border/50 animate-slide-up">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                {t('full_name')} *
              </Label>
              <Input
                id="name"
                placeholder={t('name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-border/50"
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label className="text-foreground">{t('blood_group')}</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder={t('select_blood_group')} />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label className="text-foreground">{t('select_language')} *</Label>
              <Select value={language} onValueChange={setLanguage}>
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

            {/* Emergency Contacts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">{t('emergency_contacts')} *</Label>
                <Button
                  onClick={addContact}
                  size="sm"
                  variant="outline"
                  className="border-border/50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t('add_contact')}
                </Button>
              </div>

              {contacts.map((contact, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={t('contact_name')}
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      className="bg-background border-border/50"
                    />
                    <Input
                      placeholder={t('contact_phone')}
                      value={contact.phone}
                      onChange={(e) => updateContact(index, 'phone', e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  {contacts.length > 1 && (
                    <Button
                      onClick={() => removeContact(index)}
                      size="sm"
                      variant="outline"
                      className="self-start mt-0 border-border/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? t('loading') : t('continue')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;