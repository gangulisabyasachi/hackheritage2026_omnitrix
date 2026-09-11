export type SupportedLanguage = 'en' | 'as' | 'hi' | 'bn';

export interface Translations {
  appName: string;
  tagline: string;
  disclaimer: string;
  roles: {
    patient: string;
    caregiver: string;
    clinician: string;
  };
  patientHome: {
    goodMorning: string;
    howAreYou: string;
    feelingGood: string;
    feelingOkay: string;
    feelingNotWell: string;
    todayActivities: string;
    todayRoutine: string;
    talkToAssistant: string;
    quickStats: string;
    streak: string;
    days: string;
  };
  games: {
    memoryMatch: string;
    memoryMatchDesc: string;
    objectRecognition: string;
    objectRecognitionDesc: string;
    patternCompletion: string;
    patternCompletionDesc: string;
    routineRecall: string;
    routineRecallDesc: string;
    familyMemory: string;
    familyMemoryDesc: string;
    playNow: string;
    score: string;
    accuracy: string;
    speed: string;
    difficulty: string;
    mistakes: string;
    completedMessage: string;
    nextRecommended: string;
    playAgain: string;
    returnHome: string;
  };
  caregiver: {
    dashboardTitle: string;
    patientOverview: string;
    cognitiveEngagement: string;
    todayActivitiesCompleted: string;
    performanceTrend: string;
    gameHistory: string;
    alertsTitle: string;
    addFamily: string;
    addMemory: string;
    addRoutine: string;
    addMedication: string;
    addAppointment: string;
    aiSummaryTitle: string;
    generateSummary: string;
  };
  clinician: {
    portalTitle: string;
    patientRoster: string;
    status: string;
    lastActive: string;
    engagementScore: string;
    downloadReport: string;
  };
  common: {
    home: string;
    games: string;
    routine: string;
    medicines: string;
    assistant: string;
    profile: string;
    logout: string;
    login: string;
    switchMode: string;
    language: string;
    soundOn: string;
    soundOff: string;
    offlineMode: string;
    onlineMode: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'NeuroMitra (Smriti NER)',
    tagline: 'Cognitive Gaming & Memory Assistance for the North East',
    disclaimer:
      'This platform is designed for cognitive engagement, memory assistance, and activity monitoring. It does not replace professional medical diagnosis or treatment.',
    roles: {
      patient: 'Patient Portal',
      caregiver: 'Caregiver Portal',
      clinician: 'Healthcare Worker / Clinician',
    },
    patientHome: {
      goodMorning: 'Good Day, Mrs. Ananya Das 👋',
      howAreYou: 'How are you feeling today?',
      feelingGood: "😊 I'm feeling good",
      feelingOkay: "😐 I'm okay",
      feelingNotWell: "😟 I'm not feeling well",
      todayActivities: "Today's Brain Activities",
      todayRoutine: "Today's Daily Schedule & Routine",
      talkToAssistant: 'Talk to Memory Assistant',
      quickStats: 'Your Joyful Progress',
      streak: 'Activity Streak',
      days: 'days',
    },
    games: {
      memoryMatch: 'Memory Match',
      memoryMatchDesc: 'Flip and pair familiar everyday and cultural objects',
      objectRecognition: 'Object Recognition',
      objectRecognitionDesc: 'Identify familiar household and cultural items',
      patternCompletion: 'Pattern Completion',
      patternCompletionDesc: 'Complete colorful and harmonious visual patterns',
      routineRecall: 'Daily Routine Recall',
      routineRecallDesc: 'Recall your personal daily activities with large hints',
      familyMemory: 'Family & Loved Ones Memory',
      familyMemoryDesc: 'Recognize your family members, photos, and stories',
      playNow: 'Start Playing',
      score: 'Score',
      accuracy: 'Accuracy',
      speed: 'Response Speed',
      difficulty: 'Difficulty Level',
      mistakes: 'Mistakes',
      completedMessage: 'Wonderful Job! Activity Completed 🌟',
      nextRecommended: 'Adaptive Engine Recommendation',
      playAgain: 'Play Again',
      returnHome: 'Back to Home',
    },
    caregiver: {
      dashboardTitle: 'Caregiver Care & Monitoring Portal',
      patientOverview: 'Patient Overview',
      cognitiveEngagement: 'Cognitive Engagement Score',
      todayActivitiesCompleted: "Today's Activities Completed",
      performanceTrend: 'Cognitive Performance Trends (Recharts)',
      gameHistory: 'Recent Activity Sessions',
      alertsTitle: 'Care Alerts & Observational Notices',
      addFamily: 'Add Family Member',
      addMemory: 'Add Personal Memory',
      addRoutine: 'Schedule Daily Routine',
      addMedication: 'Add Medication',
      addAppointment: 'Add Doctor Appointment',
      aiSummaryTitle: 'AI-Generated Weekly Cognitive Summary',
      generateSummary: 'Generate AI Summary',
    },
    clinician: {
      portalTitle: 'Healthcare Worker & Clinician Overview',
      patientRoster: 'Registered Patients Roster',
      status: 'Status',
      lastActive: 'Last Active',
      engagementScore: 'Engagement',
      downloadReport: 'Export Cognitive Report',
    },
    common: {
      home: 'Home',
      games: 'Games',
      routine: 'Routine',
      medicines: 'Medicines',
      assistant: 'Voice Assistant',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      switchMode: 'Switch Portal',
      language: 'Language',
      soundOn: 'Sound On',
      soundOff: 'Sound Muted',
      offlineMode: 'Offline Cache Active',
      onlineMode: 'Connected to Cloud',
    },
  },

  as: {
    appName: 'NeuroMitra — স্মৃতি (Smriti NER)',
    tagline: 'উত্তৰ-পূৰ্বাঞ্চলৰ বয়োজ্যেষ্ঠসকলৰ জ্ঞানমূলক খেল আৰু স্মৃতি সহায়ক মঞ্চ',
    disclaimer:
      'এই প্লেটফৰ্মটো মানসিক সক্ৰিয়তা, স্মৃতিশক্তিৰ অনুশীলন আৰু দৈনন্দিন কাৰ্যসূচীৰ সহায়ৰ বাবে তৈয়াৰ কৰা হৈছে। ই কোনো চিকিৎসা নিদান বা চিকিৎসকৰ বিকল্প নহয়।',
    roles: {
      patient: 'জেষ্ঠ ব্যক্তিৰ খণ্ড',
      caregiver: 'যত্নশীল পৰিচর্যাকাৰী',
      clinician: 'স্বাস্থ্যকর্মী / চিকিৎসক',
    },
    patientHome: {
      goodMorning: 'সুপ্রভাত, অনন্যা দাস বাইদেউ 👋',
      howAreYou: 'আজি আপোনাৰ গা-মন কেনে লাগিছে?',
      feelingGood: '😊 মোৰ ভাল লাগিছে',
      feelingOkay: '😐 ঠিকেই আছোঁ',
      feelingNotWell: '😟 বৰ ভাল লগা নাই',
      todayActivities: 'আজিৰ মগজুৰ অনুশীলন খেল',
      todayRoutine: 'আজিৰ দৈনন্দিন কাৰ্যসূচী',
      talkToAssistant: 'সহায়কৰ লগত কথা পাতক',
      quickStats: 'আপোনাৰ আনন্দময় অগ্ৰগতি',
      streak: 'নিয়মিত অনুশীলন',
      days: 'দিন',
    },
    games: {
      memoryMatch: 'স্মৃতি মিলোৱা খেল',
      memoryMatchDesc: 'আমাৰ চিনাকি বস্তু আৰু সংস্কৃতিৰ ছবি মিলাওক',
      objectRecognition: 'বস্তু চিনাকি খেল',
      objectRecognitionDesc: 'দৈনন্দিন ব্যৱহৃত আৰু আপোন বস্তু চিনি পাওক',
      patternCompletion: 'বিন্যাস সম্পূৰ্ণ কৰা',
      patternCompletionDesc: 'ৰঙীন আৰু ধুনীয়া ক্ৰম পূৰ্ণ কৰক',
      routineRecall: 'দৈনিক ক্ৰম মনত পেলোৱা',
      routineRecallDesc: 'আপোনাৰ নিজৰ দিনটোৰ কাম মনত পেলাওক',
      familyMemory: 'পৰিয়াল আৰু আপোনজনৰ স্মৃতি',
      familyMemoryDesc: 'আপোন পৰিয়ালৰ ছবি আৰু নাম চিনি পাওক',
      playNow: 'খেল আৰম্ভ কৰক',
      score: 'নম্বৰ',
      accuracy: 'সঠিকতা',
      speed: 'গতিবেগ',
      difficulty: 'কঠিনতাৰ স্তৰ',
      mistakes: 'ভুল',
      completedMessage: 'বৰ ধুনীয়া! আপুনি খেলখন সুন্দৰকৈ সম্পূৰ্ণ কৰিলে 🌟',
      nextRecommended: 'স্বয়ংক্ৰিয় এআই পৰামৰ্শ',
      playAgain: 'পুনৰ খেলক',
      returnHome: 'মূল পৃষ্ঠালৈ যাওক',
    },
    caregiver: {
      dashboardTitle: 'যত্নশীল পৰিচর্যাকাৰী ডেশ্ববৰ্ড',
      patientOverview: 'ৰোগীৰ চমু বিৱৰণ',
      cognitiveEngagement: 'মানসিক সক্ৰিয়তাৰ স্কোৰ',
      todayActivitiesCompleted: 'আজিৰ সম্পূৰ্ণ হোৱা কাৰ্যসূচী',
      performanceTrend: 'সক্ৰিয়তা আৰু অগ্ৰগতিৰ ৰেখাচিত্ৰ',
      gameHistory: 'শেহতীয়া খেলৰ বিৱৰণ',
      alertsTitle: 'যত্নৰ সতর্কবাণী আৰু জাননী',
      addFamily: 'পৰিয়ালৰ সদস্য যোগ কৰক',
      addMemory: 'নতুন স্মৃতি যোগ কৰক',
      addRoutine: 'দৈনিক কাৰ্যসূচী যোগ কৰক',
      addMedication: 'ঔষধৰ তথ্য যোগ কৰক',
      addAppointment: 'চিকিৎসকৰ সাক্ষাৎ নিৰ্ধাৰণ',
      aiSummaryTitle: 'এআই প্রস্তুত সাপ্তাহিক জ্ঞানমূলক সমীক্ষা',
      generateSummary: 'এআই সাৰাংশ প্রস্তুত কৰক',
    },
    clinician: {
      portalTitle: 'স্বাস্থ্যকৰ্মী আৰু চিকিৎসকৰ নিৰীক্ষণ কক্ষ',
      patientRoster: 'পঞ্জীকৃত ৰোগী তালিকা',
      status: 'স্থিতি',
      lastActive: 'শেহতীয়া কাৰ্য্য',
      engagementScore: 'সক্ৰিয়তা স্কোৰ',
      downloadReport: 'প্রতিবেদন ডাউনল’ড কৰক',
    },
    common: {
      home: 'মূল পৃষ্ঠা',
      games: 'খেলসমূহ',
      routine: 'কাৰ্যসূচী',
      medicines: 'ঔষধপাতি',
      assistant: 'ভইচ সহায়ক',
      profile: 'প্ৰফাইল',
      logout: 'লগআউট',
      login: 'লগইন',
      switchMode: 'পৰ্টেল সলনি',
      language: 'ভাষা',
      soundOn: 'শব্দ অন',
      soundOff: 'শব্দ বন্ধ',
      offlineMode: 'অফলাইন সক্ৰিয়',
      onlineMode: 'ইন্টাৰনেট সংযুক্ত',
    },
  },

  hi: {
    appName: 'NeuroMitra — स्मृति (Smriti NER)',
    tagline: 'पूर्वोत्तर भारत के वरिष्ठ नागरिकों के लिए संज्ञानात्मक खेल एवं स्मृति सहायता',
    disclaimer:
      'यह मंच संज्ञानात्मक सक्रियता, स्मृति अभ्यास और दैनिक सहायता के लिए बनाया गया है। यह किसी चिकित्सीय निदान या डॉक्टर का विकल्प नहीं है।',
    roles: {
      patient: 'वरिष्ठ नागरिक पोर्टल',
      caregiver: 'देखभालकर्ता पोर्टल',
      clinician: 'स्वास्थ्य कर्मी / चिकित्सक',
    },
    patientHome: {
      goodMorning: 'सुप्रभात, श्रीमती अनन्य दास जी 👋',
      howAreYou: 'आज आपकी तबीयत कैसी है?',
      feelingGood: '😊 मुझे अच्छा लग रहा है',
      feelingOkay: '😐 सब ठीक है',
      feelingNotWell: '😟 थोड़ी अस्वस्थता महसूस हो रही है',
      todayActivities: 'आज के दिमागी खेल व अभ्यास',
      todayRoutine: 'आज की दिनचर्या',
      talkToAssistant: 'स्मृति सहायक से बात करें',
      quickStats: 'आपकी सुखद प्रगति',
      streak: 'लगातार सक्रियता',
      days: 'दिन',
    },
    games: {
      memoryMatch: 'स्मृति मिलान खेल',
      memoryMatchDesc: 'परिचित वस्तुओं और प्रतीकों के जोड़े मिलाएं',
      objectRecognition: 'वस्तु पहचान खेल',
      objectRecognitionDesc: 'दैनिक और सांस्कृतिक वस्तुओं को पहचानें',
      patternCompletion: 'क्रम पूरा करें',
      patternCompletionDesc: 'रंग-बिरंगे क्रम और आकृतियां पहचानें',
      routineRecall: 'दिनचर्या स्मरण',
      routineRecallDesc: 'अपनी दैनिक गतिविधियों को आसानी से याद करें',
      familyMemory: 'परिवार और अपनों की स्मृति',
      familyMemoryDesc: 'अपने परिवार के सदस्यों और तस्वीरों को पहचानें',
      playNow: 'खेल शुरू करें',
      score: 'अंक',
      accuracy: 'सटीकता',
      speed: 'प्रतिक्रिया समय',
      difficulty: 'कठिनाई स्तर',
      mistakes: 'गलतियां',
      completedMessage: 'बहुत बढ़िया! अभ्यास पूरा हुआ 🌟',
      nextRecommended: 'अनुकूली एआई अनुशंसा',
      playAgain: 'पुनः खेलें',
      returnHome: 'मुख्य पृष्ठ',
    },
    caregiver: {
      dashboardTitle: 'देखभालकर्ता निगरानी डैशबोर्ड',
      patientOverview: 'रोगी विवरण',
      cognitiveEngagement: 'संज्ञानात्मक सहभागिता स्कोर',
      todayActivitiesCompleted: 'आज की पूर्ण गतिविधियां',
      performanceTrend: 'प्रदर्शन प्रगति रेखाचित्र',
      gameHistory: 'हाल की खेल गतिविधियां',
      alertsTitle: 'देखभाल चेतावनियां व सुझाव',
      addFamily: 'परिवार का सदस्य जोड़ें',
      addMemory: 'व्यक्तिगत स्मृति जोड़ें',
      addRoutine: 'दिनचर्या जोड़ें',
      addMedication: 'दवा जोड़ें',
      addAppointment: 'डॉक्टर का परामर्श जोड़ें',
      aiSummaryTitle: 'एआई निर्मित साप्ताहिक प्रगति सारांश',
      generateSummary: 'सारांश तैयार करें',
    },
    clinician: {
      portalTitle: 'स्वास्थ्य कर्मी एवं क्लिनिकल अवलोकन',
      patientRoster: 'पंजीकृत मरीजों की सूची',
      status: 'स्थिति',
      lastActive: 'अंतिम सक्रियता',
      engagementScore: 'सहभागिता',
      downloadReport: 'रिपोर्ट निर्यात करें',
    },
    common: {
      home: 'होम',
      games: 'खेल',
      routine: 'दिनचर्या',
      medicines: 'दवाइयां',
      assistant: 'आवाज सहायक',
      profile: 'प्रोफाइल',
      logout: 'लॉगआउट',
      login: 'लॉगिन',
      switchMode: 'पोर्टल बदलें',
      language: 'भाषा',
      soundOn: 'ध्वनि चालू',
      soundOff: 'ध्वनि म्यूट',
      offlineMode: 'ऑफ़लाइन सक्रिय',
      onlineMode: 'क्लाउड से जुड़ा',
    },
  },

  bn: {
    appName: 'NeuroMitra — স্মৃতি (Smriti NER)',
    tagline: 'উত্তর-পূর্বাঞ্চলের প্রবীণদের জন্য জ্ঞানমূলক খেলা ও স্মৃতি সহায়ক প্ল্যাটফর্ম',
    disclaimer:
      'এই প্ল্যাটফর্মটি মানসিক সচেতনতা, স্মৃতি অনুশীলন এবং দৈনন্দিন সহায়তার জন্য নির্মিত। এটি পেশাদার চিকিৎসার বিকল্প নয়।',
    roles: {
      patient: 'প্রবীণ ব্যক্তির পোর্টাল',
      caregiver: 'সেবাকারী পোর্টাল',
      clinician: 'স্বাস্থ্যকর্মী / চিকিৎসক',
    },
    patientHome: {
      goodMorning: 'সুপ্রভাত, শ্রীমতি অনন্যা দাস 👋',
      howAreYou: 'আজ আপনার কেমন লাগছে?',
      feelingGood: '😊 আমার ভালো লাগছে',
      feelingOkay: '😐 মোটামুটি আছি',
      feelingNotWell: '😟 শরীরটা ভালো লাগছে না',
      todayActivities: 'আজকের স্মৃতি অনুশীলন খেলা',
      todayRoutine: 'আজকের দৈনন্দিন কাজের তালিকা',
      talkToAssistant: 'ভয়েস সহায়কের সাথে কথা বলুন',
      quickStats: 'আপনার আনন্দময় অগ্রগতি',
      streak: 'ধারাবাহিক দিন',
      days: 'দিন',
    },
    games: {
      memoryMatch: 'স্মৃতি মেলানো খেলা',
      memoryMatchDesc: 'চেনা জানা সাংস্কৃতিক জিনিস মিলিয়ে জোড়া বানান',
      objectRecognition: 'বস্তু চেনার খেলা',
      objectRecognitionDesc: 'দৈনন্দিন ও পরিচিত জিনিস চিনুন',
      patternCompletion: 'নকশা সম্পূর্ণ করার খেলা',
      patternCompletionDesc: 'রঙিন ছবির ক্রম পূর্ণ করুন',
      routineRecall: 'রুটিন মনে করার খেলা',
      routineRecallDesc: 'নিজের সারাদিনের কাজ মনে করুন',
      familyMemory: 'পরিবার ও প্রিয়জনদের স্মৃতি',
      familyMemoryDesc: 'পরিবারের সদস্য ও পুরোনো ছবি চিনুন',
      playNow: 'খেলা শুরু করুন',
      score: 'স্কোর',
      accuracy: 'নির্ভুলতা',
      speed: 'গতি',
      difficulty: 'কঠিনতার স্তর',
      mistakes: 'ভুল',
      completedMessage: 'চমৎকার! আপনি দারুণভাবে শেষ করলেন 🌟',
      nextRecommended: 'স্বয়ংক্রিয় সুপারিশ',
      playAgain: 'আবার খেলুন',
      returnHome: 'হোমে ফিরুন',
    },
    caregiver: {
      dashboardTitle: 'সেবাকারী পর্যবেক্ষণ ড্যাশবোর্ড',
      patientOverview: 'রোগীর সংক্ষিপ্ত বিবরণ',
      cognitiveEngagement: 'মানসিক সক্রিয়তার সূচক',
      todayActivitiesCompleted: 'আজকের সম্পন্ন কাজ',
      performanceTrend: 'অগ্রগতির চার্ট ও প্রবণতা',
      gameHistory: 'সাম্প্রতিক খেলার ইতিহাস',
      alertsTitle: 'গুরুত্বপূর্ণ সতর্কতা ও তথ্য',
      addFamily: 'পরিবারের সদস্য যোগ করুন',
      addMemory: 'ব্যক্তিগত স্মৃতি যোগ করুন',
      addRoutine: 'দৈনন্দিন কাজ নির্ধারণ',
      addMedication: 'ওষুধ যোগ করুন',
      addAppointment: 'ডাক্তারের পরামর্শ যোগ করুন',
      aiSummaryTitle: 'এআই প্রস্তুত সাপ্তাহিক সারাংশ',
      generateSummary: 'সারাংশ তৈরি করুন',
    },
    clinician: {
      portalTitle: 'চিকিৎসক ও স্বাস্থ্যকর্মী ড্যাশবোর্ড',
      patientRoster: 'নিবন্ধিত রোগীদের তালিকা',
      status: 'অবস্থা',
      lastActive: 'সর্বশেষ সক্রিয়',
      engagementScore: 'এনগেজমেন্ট',
      downloadReport: 'রিপোর্ট ডাউনলোড',
    },
    common: {
      home: 'হোম',
      games: 'খেলা',
      routine: 'রুটিন',
      medicines: 'ওষুধ',
      assistant: 'ভয়েস সহকারী',
      profile: 'প্রোফাইল',
      logout: 'লগআউট',
      login: 'লগইন',
      switchMode: 'পোর্টাল বদলান',
      language: 'ভাষা',
      soundOn: 'শব্দ চালু',
      soundOff: 'শব্দ বন্ধ',
      offlineMode: 'অফলাইন মোড',
      onlineMode: 'অনলাইন সংযুক্ত',
    },
  },
};
