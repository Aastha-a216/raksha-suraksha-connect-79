import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Common
      "app_name": "Raksha Bandhan",
      "app_subtitle": "सुरक्षा App",
      "loading": "Loading...",
      "save": "Save",
      "cancel": "Cancel",
      "continue": "Continue",
      "skip": "Skip",
      "next": "Next",
      "back": "Back",
      "done": "Done",
      
      // Onboarding
      "welcome_title": "Welcome to Raksha",
      "welcome_subtitle": "Your personal safety companion",
      "onboarding_safety": "24/7 Safety Monitoring",
      "onboarding_location": "Real-time Location Sharing",
      "onboarding_contacts": "Emergency Contact Network",
      "onboarding_services": "Nearby Emergency Services",
      
      // Authentication
      "enter_phone": "Enter your phone number",
      "phone_placeholder": "+91 98765 43210",
      "send_otp": "Send OTP",
      "enter_otp": "Enter verification code",
      "verify_otp": "Verify OTP",
      "resend_otp": "Resend OTP",
      
      // Profile Setup
      "setup_profile": "Set up your profile",
      "full_name": "Full Name",
      "name_placeholder": "Enter your full name",
      "blood_group": "Blood Group",
      "select_blood_group": "Select blood group",
      "emergency_contacts": "Emergency Contacts",
      "add_contact": "Add Contact",
      "contact_name": "Contact Name",
      "contact_phone": "Contact Phone",
      "select_language": "Select Language",
      
      // Dashboard
      "welcome_back": "Welcome back",
      "you_are_safe": "You're protected and connected",
      "emergency_help": "Emergency Help",
      "press_for_help": "Press for emergency help",
      "hold_to_activate": "Hold to activate in 3 seconds",
      "quick_actions": "Quick Actions",
      "fake_call": "Fake Call",
      "fake_call_desc": "Receive a fake call to escape",
      "torch_siren": "Torch + Siren",
      "torch_siren_desc": "Activate flashlight and siren",
      "share_location": "Share Location",
      "share_location_desc": "Send live location to contacts",
      "emergency_contacts_action": "Emergency Contacts",
      "emergency_contacts_desc": "Quick call to saved contacts",
      "shake_to_alert": "Shake to Alert",
      "shake_device": "Shake your device to activate SOS",
      
      // Location Services
      "location_services": "Location & Services",
      "location_active": "Location Active",
      "getting_location": "Getting Location...",
      "location_denied": "Location Denied",
      "location_inactive": "Location Inactive",
      "accuracy": "Accuracy",
      "share": "Share",
      "nearby_services": "Nearby Emergency Services",
      "found": "found",
      "call_now": "Call Now",
      
      // Map
      "map_view": "Map View",
      "police_stations": "Police Stations",
      "hospitals": "Hospitals",
      "ncc_headquarters": "NCC Headquarters",
      "directions": "Directions",
      
      // Settings
      "settings": "Settings",
      "profile": "Profile",
      "language": "Language",
      "theme": "Theme",
      "dark_mode": "Dark Mode",
      "light_mode": "Light Mode",
      "manage_contacts": "Manage Emergency Contacts",
      "about": "About",
      "version": "Version",
      "logout": "Logout",
      
      // Notifications
      "sos_activated": "🚨 Emergency Alert Activated",
      "sos_message": "Your emergency contacts have been notified",
      "fake_call_activated": "📞 Fake Call Activated",
      "fake_call_message": "Incoming call in 5 seconds...",
      "torch_activated": "🔦 Torch & Siren Active",
      "torch_message": "Maximum brightness and sound alert",
      "location_shared": "📍 Location Shared",
      "location_shared_message": "Live location sent to emergency contacts",
      "calling_contacts": "👥 Calling Contacts",
      "calling_message": "Connecting to emergency contacts...",
      "location_acquired": "📍 Location Acquired",
      "location_acquired_message": "Your location has been detected successfully",
      "language_changed": "🌐 Language Changed",
      "language_changed_message": "App language updated successfully"
    }
  },
  hi: {
    translation: {
      "app_name": "राखी बंधन",
      "app_subtitle": "सुरक्षा ऐप",
      "loading": "लोड हो रहा है...",
      "save": "सेव करें",
      "cancel": "रद्द करें",
      "continue": "जारी रखें",
      "skip": "छोड़ें",
      "next": "अगला",
      "back": "वापस",
      "done": "पूर्ण",
      
      "welcome_title": "राखी में आपका स्वागत है",
      "welcome_subtitle": "आपका व्यक्तिगत सुरक्षा साथी",
      "onboarding_safety": "24/7 सुरक्षा निगरानी",
      "onboarding_location": "रियल-टाइम लोकेशन शेयरिंग",
      "onboarding_contacts": "आपातकालीन संपर्क नेटवर्क",
      "onboarding_services": "नजदीकी आपातकालीन सेवाएं",
      
      "enter_phone": "अपना फोन नंबर दर्ज करें",
      "phone_placeholder": "+91 98765 43210",
      "send_otp": "OTP भेजें",
      "enter_otp": "सत्यापन कोड दर्ज करें",
      "verify_otp": "OTP सत्यापित करें",
      "resend_otp": "OTP फिर से भेजें",
      
      "setup_profile": "अपनी प्रोफाइल सेट करें",
      "full_name": "पूरा नाम",
      "name_placeholder": "अपना पूरा नाम दर्ज करें",
      "blood_group": "रक्त समूह",
      "select_blood_group": "रक्त समूह चुनें",
      "emergency_contacts": "आपातकालीन संपर्क",
      "add_contact": "संपर्क जोड़ें",
      "contact_name": "संपर्क का नाम",
      "contact_phone": "संपर्क फोन",
      "select_language": "भाषा चुनें",
      
      "welcome_back": "वापस स्वागत है",
      "you_are_safe": "आप सुरक्षित और जुड़े हुए हैं",
      "emergency_help": "आपातकालीन सहायता",
      "press_for_help": "आपातकालीन सहायता के लिए दबाएं",
      "hold_to_activate": "3 सेकंड में सक्रिय करने के लिए दबाए रखें",
      "quick_actions": "त्वरित कार्य",
      "fake_call": "नकली कॉल",
      "fake_call_desc": "बचने के लिए नकली कॉल प्राप्त करें",
      "torch_siren": "टॉर्च + साइरन",
      "torch_siren_desc": "फ्लैशलाइट और साइरन सक्रिय करें",
      "share_location": "लोकेशन शेयर करें",
      "share_location_desc": "संपर्कों को लाइव लोकेशन भेजें",
      "emergency_contacts_action": "आपातकालीन संपर्क",
      "emergency_contacts_desc": "सेव किए गए संपर्कों को तुरंत कॉल करें",
      "shake_to_alert": "हिलाकर अलर्ट करें",
      "shake_device": "SOS सक्रिय करने के लिए अपना डिवाइस हिलाएं"
    }
  },
  bn: {
    translation: {
      "app_name": "রাখী বন্ধন",
      "app_subtitle": "নিরাপত্তা অ্যাপ",
      "welcome_title": "রাখীতে স্বাগতম",
      "welcome_subtitle": "আপনার ব্যক্তিগত নিরাপত্তা সঙ্গী",
      "emergency_help": "জরুরী সাহায্য",
      "press_for_help": "জরুরী সাহায্যের জন্য চাপুন",
      "quick_actions": "দ্রুত কাজ",
      "fake_call": "নকল কল",
      "torch_siren": "টর্চ + সাইরেন",
      "share_location": "লোকেশন শেয়ার করুন",
      "emergency_contacts_action": "জরুরী যোগাযোগ"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;