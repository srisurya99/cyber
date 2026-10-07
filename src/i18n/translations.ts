export type Language = 'en' | 'te';

export const translations = {
  en: {
    // Brand
    brandName: 'THREATLENS',
    brandTagline: 'See the Threat. Know the Risk. Take Action.',
    taglineSubtitle: 'AI-Powered Citizen Cyber Safety & Digital Incident Response',

    // Nav
    navHome: 'Home',
    navCheck: 'Check',
    navIncidents: 'Incidents',
    navHelp: 'Help',
    navProfile: 'Profile',
    demoModeBadge: 'DEMO MODE',

    // Hero
    heroTitle: 'Worried about something online?',
    heroSubtitle: 'Check it, understand the risk, and find out what to do next.',
    saasHeroHeadline: 'See the Threat. Know the Risk. Take Action.',
    saasHeroSubtext: 'Check suspicious links, messages, images, and videos. Get clear explanations and practical steps to protect yourself online.',
    exploreHowItWorks: 'Explore How It Works',
    notSurePrompt: 'Not sure what to do?',
    startSafetyCheckBtn: 'Start Safety Check',

    // SaaS Feature CTAs
    ctaCheckLink: 'Check a Link or Message',
    ctaCheckMedia: 'Check an Image or Video',
    ctaGetScamHelp: 'Get Scam Help',
    ctaGetBlackmailGuidance: 'Get Immediate Guidance',

    // 3 Steps
    threeStepsHeading: 'How ThreatLens Works',
    threeStepsSubtitle: 'A clear three-step pathway designed for non-technical citizens.',
    step1Title: '1. Check the Threat',
    step1Desc: 'Submit a suspicious link, SMS, WhatsApp message, QR code, or media file without complicated forms.',
    step2Title: '2. Understand the Risk',
    step2Desc: 'ThreatLens examines domain anomalies, synthetic biometric markers, and coercive patterns in plain language.',
    step3Title: '3. Take Practical Action',
    step3Desc: 'Follow a prioritized response checklist: freeze transactions within the Golden Hour, preserve evidence, and report to 1930.',

    // Responsible AI
    responsibleAiTitle: 'Responsible AI & Citizen Privacy',
    responsibleAiSubtitle: 'Built on transparency, evidentiary integrity, and honest probabilistic analysis.',
    responsibleAiDisclaimer: 'AI detection evaluates probabilistic patterns and indicators—it is never 100% infallible. Always verify directly with official banking and law enforcement authorities.',

    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Straightforward answers to the most common citizen cyber fraud and safety concerns.',

    // Final CTA
    finalCtaTitle: 'Take Control of Your Digital Safety Today',
    finalCtaSubtitle: 'Free, confidential, and instant guidance for ordinary citizens facing online threats, impersonation, or financial cyber fraud.',

    // 4 Primary Actions
    action1Title: 'Check a Link or Message',
    action1Desc: 'Find phishing and scam signs before you click or reply',
    action1Btn: 'Check Now →',

    action2Title: 'Check an Image or Video',
    action2Desc: 'Detect possible manipulation, deepfakes, or AI-generated media',
    action2Btn: 'Check Media →',

    action3Title: 'I Was Scammed',
    action3Desc: 'Get step-by-step emergency response guidance & report help',
    action3Btn: 'Get Response Plan →',

    action4Title: "I'm Being Threatened",
    action4Desc: 'Emergency guidance for digital blackmail, sextortion & extortion',
    action4Btn: 'Get Immediate Help →',

    // Dashboard overview
    yourDigitalSafety: 'Your Digital Safety',
    statIncidents: 'Incidents',
    statEvidenceSaved: 'Evidence Saved',
    statOpenActions: 'Open Actions',
    recentActivity: 'Recent Activity',
    noRecentActivity: 'No incidents yet. Your reported or analyzed items will appear here.',

    // Risk Levels
    riskLow: 'LOW',
    riskSuspicious: 'SUSPICIOUS',
    riskHigh: 'HIGH',
    riskCritical: 'CRITICAL',

    // Phishing Module
    phishingHeader: 'Check a Link or Message',
    phishingSubtitle: 'Paste a suspicious message, link, email, or website address. ThreatLens will look for common phishing and scam indicators.',
    tabMessage: 'Message',
    tabLink: 'Link',
    tabEmail: 'Email',
    placeholderMessage: 'Paste suspicious message here (SMS, WhatsApp, Telegram, etc.)...',
    placeholderLink: 'https://example.com/verify-account',
    placeholderSender: 'Sender address (e.g. alert@secure-bank-update.com)',
    placeholderSubject: 'Email Subject (e.g. Urgent: Account suspended)',
    placeholderEmailBody: 'Email body or message content...',
    btnAnalyze: 'Analyze',
    btnAnalyzing: 'Checking the message for suspicious patterns...',
    analyzingStage1: 'Scanning for deceptive patterns...',
    analyzingStage2: 'Analyzing suspicious links & domain signals...',
    analyzingStage3: 'Preparing clear safety recommendations...',

    // Phishing Result
    whyWeFlaggedTitle: 'Why we flagged it',
    whatShouldYouDoTitle: 'What should you do?',
    btnSaveResult: 'Save Result',
    btnCheckAnother: 'Check Another',
    btnGetHelp: 'Get Official Help',
    viewTechnicalAnalysis: 'View Technical Analysis',
    hideTechnicalAnalysis: 'Hide Technical Analysis',

    // Media Module
    mediaHeader: 'Check an Image or Video',
    mediaSubtitle: 'Upload suspicious media to check for possible manipulation or AI-generated content.',
    uploadDragDrop: 'Drag and drop or choose a file',
    supportedFormats: 'Supported: JPG, PNG, WEBP, MP4, MOV (up to 25MB)',
    chooseFileBtn: 'Choose File',
    btnAnalyzeMedia: 'Analyze Media',
    mediaAnalyzing: 'Examining the uploaded media...',
    mediaDisclaimer: 'AI-generated media detection is not perfect. Treat this result as an indicator, not absolute proof.',
    estimatedLikelihood: 'Estimated manipulation likelihood',
    analysisAreasTitle: 'Forensic Signals Analyzed',
    faceConsistency: 'Face & Biometric Consistency',
    lightingConsistency: 'Lighting & Shadow Physics',
    frameArtifacts: 'Frame & Boundary Artifacts',
    metadataIntegrity: 'Metadata & Exif Integrity',
    compressionPatterns: 'Compression Pattern Analysis',
    aiIndicators: 'Synthetic Generation Markers',

    // Scam Module
    scamHeader: 'I Was Scammed',
    scamSubtitle: "Don't panic. We'll guide you through the next steps.",
    whatHappenedQuestion: 'What happened?',
    scamCategoryUpi: 'UPI Payment Scam (GPay, PhonePe, Paytm)',
    scamCategoryBank: 'Bank / Credit / Debit Card Fraud',
    scamCategoryShopping: 'Fake Shopping Website / Product',
    scamCategoryInvestment: 'Investment / Crypto / Trading Scam',
    scamCategoryJob: 'Fake Job / Task / Part-time Offer',
    scamCategorySocial: 'Social Media Impersonation / Lottery',
    scamCategoryRomance: 'Dating / Romance Scam',
    scamCategoryOther: 'Other suspicious scam',
    btnNext: 'Next Step →',
    btnBack: '← Back',
    financialLossPrompt: 'Did you transfer or lose money?',
    lossAmountLabel: 'Amount lost (Approximate ₹)',
    platformPrompt: 'Where did the scam occur?',
    detailsPlaceholder: 'Briefly tell us what occurred (e.g. Someone asked for a QR code scan to receive payment)...',
    btnCreateIncident: 'Generate Response Plan',

    // Blackmail Module
    blackmailHeader: "I'm Being Threatened",
    blackmailSubtitle: "Let's focus on what you can do next.",
    emergencyDangerTitle: 'Are you in immediate physical danger?',
    emergencyDangerWarning: 'If your physical safety or someone else’s life is in immediate danger, please contact local emergency police immediately (Dial 112 in India).',
    emergencyContactBtn: 'Emergency Police Services (112)',
    btnYes: 'Yes',
    btnNo: 'No, but I am being extorted/threatened online',
    whatAreTheyThreatening: 'What are they threatening to do?',
    threatPrivateImages: 'Share private images / video (Sextortion)',
    threatPersonalInfo: 'Publish personal or family information (Doxxing)',
    threatContactFamily: 'Contact family, friends, or employer',
    threatDemandMoney: 'Demand money or cryptocurrency',
    threatAccountTakeover: 'Threatening to lock or hijack my account',
    threatPhysicalHarm: 'Threatening physical harm or stalking',
    threatOther: 'Other threats or harassment',
    haveAccountAccessQuestion: 'Do you still have access to your account?',
    generateSafetyPlanBtn: 'Get Personalized Safety Plan',

    // Incident Details & Actions
    incidentTimeline: 'Incident Timeline',
    evidenceCollection: 'Evidence Saved',
    addEvidenceBtn: 'Add Evidence',
    recommendedActions: 'Priority Recommended Actions',
    btnDownloadPdf: 'Download Official PDF Report',
    btnResolved: 'Mark as Resolved',
    btnDeleteIncident: 'Delete Incident',
    privacyNotice: 'Your evidence may contain sensitive personal information. Upload only what is necessary.',

    // Help & Emergency
    helpHeader: 'Cybercrime Reporting & Safety Help',
    helpSubtitle: 'Official government helplines, bank reporting steps, and privacy protection protocols.',
    nationalCybercrimeHelpline: 'National Cyber Crime Helpline (India): 1930',
    nationalPortal: 'National Cyber Crime Reporting Portal: cybercrime.gov.in',
    bankEmergencyNote: 'For financial fraud, call your bank within the "Golden Hour" (first 2-3 hours) to stop transaction processing.',

    // Universal Assistant
    askAssistant: 'Ask ThreatLens',
    assistantGreeting: 'Hello! I am ThreatLens Cyber Guidance Assistant. Tell me what happened in your own words, and I will guide you to the right safety steps.',
    assistantPlaceholder: 'e.g., Someone sent me an SMS saying my bank account is blocked...',
    assistantDisclaimer: 'ThreatLens Assistant provides digital safety guidance. We are not police or bank officials.',

    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    open: 'Open →',
    statusOpen: 'Open',
    statusInProgress: 'Response in Progress',
    statusResolved: 'Resolved',
    demoBadge: 'DEMO / FICTIONAL DATA',
    switchLanguage: 'తెలుగు',
  },
  te: {
    // Brand
    brandName: 'థ్రెట్‌లెన్స్ (ThreatLens)',
    brandTagline: 'ముప్పును గుర్తించండి. ప్రమాదాన్ని తెలుసుకోండి. రక్షణ చర్య తీసుకోండి.',
    taglineSubtitle: 'పౌరుల కోసం AI ఆధారిత సైబర్ భద్రత & డిజిటల్ సంఘటనల పరిష్కార వేదిక',

    // Nav
    navHome: 'హోమ్',
    navCheck: 'తనిఖీ',
    navIncidents: 'నా సంఘటనలు',
    navHelp: 'సహాయం',
    navProfile: 'ప్రొఫైల్',
    demoModeBadge: 'డెమో మోడ్',

    // Hero
    heroTitle: 'ఆన్‌లైన్‌లో ఏదైనా అనుమానాస్పదంగా అనిపించిందా?',
    heroSubtitle: 'తనిఖీ చేయండి, ముప్పు తీవ్రతను అర్థం చేసుకోండి, తక్షణమే ఏమి చేయాలో తెలుసుకోండి.',
    saasHeroHeadline: 'ముప్పును గుర్తించండి. ప్రమాదాన్ని తెలుసుకోండి. రక్షణ చర్య తీసుకోండి.',
    saasHeroSubtext: 'అనుమానాస్పద లింకులు, సందేశాలు, చిత్రాలు మరియు వీడియోలను తనిఖీ చేయండి. సరైన వివరణ మరియు ఆచరణాత్మక రక్షణ చర్యలను పొందండి.',
    exploreHowItWorks: 'ఇది ఎలా పనిచేస్తుందో తెలుసుకోండి',
    notSurePrompt: 'ఏమి చేయాలో తెలియడం లేదా?',
    startSafetyCheckBtn: 'భద్రతా తనిఖీ ప్రారంభించండి',

    // SaaS Feature CTAs
    ctaCheckLink: 'లింక్ లేదా సందేశాన్ని తనిఖీ చేయండి',
    ctaCheckMedia: 'చిత్రం లేదా వీడియోను తనిఖీ చేయండి',
    ctaGetScamHelp: 'స్కామ్ రక్షణ సహాయం పొందండి',
    ctaGetBlackmailGuidance: 'తక్షణ రక్షణ మార్గదర్శకం',

    // 3 Steps
    threeStepsHeading: 'థ్రెట్‌లెన్స్ ఎలా పనిచేస్తుంది',
    threeStepsSubtitle: 'సామాన్య పౌరుల కోసం రూపొందించబడిన స్పష్టమైన 3-దశల భద్రతా మార్గం.',
    step1Title: '1. ముప్పును తనిఖీ చేయండి',
    step1Desc: 'అనుమానాస్పద లింక్, SMS, WhatsApp మెసేజ్, QR కోడ్ లేదా మీడియా ఫైల్‌ను సులభంగా సమర్పించండి.',
    step2Title: '2. ప్రమాదాన్ని అర్థం చేసుకోండి',
    step2Desc: 'డొమైన్ లోపాలు, సింథటిక్ బయోమెట్రిక్ గుర్తులు మరియు మోసపూరిత పద్ధతులను సులభమైన భాషలో విశ్లేషిస్తుంది.',
    step3Title: '3. రక్షణ చర్య తీసుకోండి',
    step3Desc: 'ప్రాధాన్యతా రక్షణ చెక్‌లిస్ట్: మొదటి 2 గంటల్లో (గోల్డెన్ అవర్) నిధులను ఫ్రీజ్ చేయడం మరియు 1930 కు రిపోర్ట్ చేయడం.',

    // Responsible AI
    responsibleAiTitle: 'బాధ్యతాయుతమైన AI & పౌరుల గోప్యత',
    responsibleAiSubtitle: 'పారదర్శకత మరియు ఖచ్చితమైన విశ్లేషణపై ఆధారపడి నిర్మించబడింది.',
    responsibleAiDisclaimer: 'AI గుర్తింపు సంభావ్యతా సంకేతాల ఆధారంగా పనిచేస్తుంది—ఇది 100% పరిపూర్ణమైనది కాదు. ఎల్లప్పుడూ అధికారిక బ్యాంకింగ్ లేదా పోలీసు అధికారులతో ధృవీకరించండి.',

    // FAQ
    faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    faqSubtitle: 'సైబర్ మోసాలు మరియు ఆన్‌లైన్ భద్రతపై సామాన్యుల ప్రధాన సందేహాలకు నిపుణుల సమాధానాలు.',

    // Final CTA
    finalCtaTitle: 'ఈరోజే మీ డిజిటల్ భద్రతను పటిష్టం చేసుకోండి',
    finalCtaSubtitle: 'ఆన్‌లైన్ బెదిరింపులు లేదా ఆర్థిక సైబర్ మోసాలను ఎదుర్కొంటున్న సాధారణ పౌరులకు ఉచిత మరియు తక్షణ సహాయం.',

    // 4 Primary Actions
    action1Title: 'లింక్ లేదా సందేశాన్ని తనిఖీ చేయండి',
    action1Desc: 'క్లిక్ చేసే ముందు ఫిషింగ్ మరియు స్కామ్ సంకేతాలను గుర్తించండి',
    action1Btn: 'ఇప్పుడే తనిఖీ చేయండి →',

    action2Title: 'చిత్రం లేదా వీడియోను తనిఖీ చేయండి',
    action2Desc: 'డీప్‌ఫేక్ లేదా కృత్రిమ మేధ (AI) సృష్టించిన అనుకరణలను కనుగొనండి',
    action2Btn: 'మీడియాను తనిఖీ చేయండి →',

    action3Title: 'నేను సైబర్ మోసానికి గురయ్యాను',
    action3Desc: 'డబ్బు నష్టపోయినా లేదా మోసపోయినా దశలవారీ సహాయం మరియు నివేదిక',
    action3Btn: 'స్పందన ప్రణాళిక పొందండి →',

    action4Title: 'నాపై బెదిరింపులు వస్తున్నాయి',
    action4Desc: 'డిజిటల్ బ్లాక్‌మెయిల్, సెక్స్‌టార్షన్ మరియు వేధింపులకు అత్యవసర రక్షణ',
    action4Btn: 'తక్షణ సహాయం పొందండి →',

    // Dashboard overview
    yourDigitalSafety: 'మీ డిజిటల్ భద్రత',
    statIncidents: 'నమోదైన సంఘటనలు',
    statEvidenceSaved: 'భద్రపరచిన ఆధారాలు',
    statOpenActions: 'పెండింగ్ చర్యలు',
    recentActivity: 'ఇటీవలి చర్యలు',
    noRecentActivity: 'ఇంకా ఎటువంటి సంఘటనలు లేవు. మీ తనిఖీలు ఇక్కడ కనిపిస్తాయి.',

    // Risk Levels
    riskLow: 'తక్కువ ప్రమాదం',
    riskSuspicious: 'అనుమానాస్పదం',
    riskHigh: 'అధిక ప్రమాదం',
    riskCritical: 'అత్యవసరం',

    // Phishing Module
    phishingHeader: 'లింక్ లేదా సందేశాన్ని తనిఖీ చేయండి',
    phishingSubtitle: 'అనుమానాస్పద సందేశం, వెబ్‌సైట్ లింక్ లేదా ఇమెయిల్‌ను ఇక్కడ పేస్ట్ చేయండి. థ్రెట్‌లెన్స్ ప్రమాద సంకేతాలను విశ్లేషిస్తుంది.',
    tabMessage: 'సందేశం',
    tabLink: 'లింక్ (URL)',
    tabEmail: 'ఇమెయిల్',
    placeholderMessage: 'అనుమానాస్పద మెసేజ్ ఇక్కడ పేస్ట్ చేయండి (SMS, WhatsApp, మొదలైనవి)...',
    placeholderLink: 'https://example.com/verify-account',
    placeholderSender: 'పంపినవారి చిరునామా (ఉదా: support@bank-update-alert.in)',
    placeholderSubject: 'విషయం (ఉదా: ఖాతా నిలిపివేయబడింది)',
    placeholderEmailBody: 'ఇమెయిల్ పూర్తి విషయం...',
    btnAnalyze: 'విశ్లేషించండి',
    btnAnalyzing: 'సందేశంలో ప్రమాద సంకేతాలను తనిఖీ చేస్తోంది...',
    analyzingStage1: 'మోసపూరిత పదాలను విశ్లేషిస్తోంది...',
    analyzingStage2: 'అనుమానాస్పద లింకులు మరియు డొమైన్‌ను తనిఖీ చేస్తోంది...',
    analyzingStage3: 'సురక్షిత రక్షణ మార్గదర్శకాలను సిద్ధం చేస్తోంది...',

    // Phishing Result
    whyWeFlaggedTitle: 'మేము ఎందుకు హెచ్చరిస్తున్నాము',
    whatShouldYouDoTitle: 'మీరు ఇప్పుడు ఏమి చేయాలి?',
    btnSaveResult: 'ఫలితాన్ని దాచుకోండి',
    btnCheckAnother: 'మరొకటి తనిఖీ చేయండి',
    btnGetHelp: 'అధికారిక సహాయం',
    viewTechnicalAnalysis: 'సాంకేతిక వివరాలు చూడండి',
    hideTechnicalAnalysis: 'సాంకేతిక వివరాలు దాచండి',

    // Media Module
    mediaHeader: 'చిత్రం లేదా వీడియోను తనిఖీ చేయండి',
    mediaSubtitle: 'మార్ఫింగ్ లేదా కృత్రిమ మేధస్సు (AI) ద్వారా సృష్టించబడినదా అని తనిఖీ చేయడానికి ఫైల్‌ను అప్‌లోడ్ చేయండి.',
    uploadDragDrop: 'ఫైల్‌ను ఇక్కడ డ్రాగ్ చేయండి లేదా ఎంచుకోండి',
    supportedFormats: 'మద్దతు ఉన్న ఫైల్స్: JPG, PNG, WEBP, MP4, MOV (గరిష్టం 25MB)',
    chooseFileBtn: 'ఫైల్ ఎంచుకోండి',
    btnAnalyzeMedia: 'మీడియాను విశ్లేషించండి',
    mediaAnalyzing: 'మీడియాను లోతుగా పరిశీలిస్తోంది...',
    mediaDisclaimer: 'AI మీడియా గుర్తింపు ఖచ్చితమైనది కాదు. దీనిని ఒక సూచికగా మాత్రమే పరిగణించండి.',
    estimatedLikelihood: 'మార్ఫింగ్ లేదా AI అనుకరణ సంభావ్యత',
    analysisAreasTitle: 'పరిశీలించిన ఫోరెన్సిక్ సంకేతాలు',
    faceConsistency: 'ముఖం మరియు జీవవైవిధ్య స్థిరత్వం',
    lightingConsistency: 'కాంతి మరియు నీడల భౌతికశాస్త్రం',
    frameArtifacts: 'ఫ్రేమ్ సరిహద్దుల లోపాలు',
    metadataIntegrity: 'మెటాడేటా మరియు ఫైల్ సమాచారం',
    compressionPatterns: 'కంప్రెషన్ నమూనాల విశ్లేషణ',
    aiIndicators: 'సింథటిక్ AI తయారీ గుర్తులు',

    // Scam Module
    scamHeader: 'నేను సైబర్ మోసానికి గురయ్యాను',
    scamSubtitle: 'ఆందోళన చెందకండి. తదుపరి తీసుకోల్సిన చర్యలను మేము మీకు వివరిస్తాము.',
    whatHappenedQuestion: 'ఏమి జరిగింది?',
    scamCategoryUpi: 'UPI పేమెంట్ మోసం (Google Pay, PhonePe, Paytm)',
    scamCategoryBank: 'బ్యాంక్ లేదా కార్డ్ మోసం',
    scamCategoryShopping: 'నకిలీ షాపింగ్ సైట్ లేదా వస్తువు మోసం',
    scamCategoryInvestment: 'పెట్టుబడి / క్రిప్టో / పార్ట్ టైమ్ లాభాల మోసం',
    scamCategoryJob: 'నకిలీ ఉద్యోగ ఆఫర్',
    scamCategorySocial: 'సోషల్ మీడియా ఖాతా అనుకరణ / లాటరీ మోసం',
    scamCategoryRomance: 'పరిచయాలు / మ్యాట్రిమోనీ మోసం',
    scamCategoryOther: 'ఇతర సైబర్ మోసం',
    btnNext: 'తదుపరి దశ →',
    btnBack: '← వెనుకకు',
    financialLossPrompt: 'మీరు డబ్బు నష్టపోయారా లేదా బదిలీ చేశారా?',
    lossAmountLabel: 'నష్టపోయిన మొత్తం (సుమారు ₹)',
    platformPrompt: 'ఈ మోసం ఎక్కడ జరిగింది?',
    detailsPlaceholder: 'సంఘటనను క్లుప్తంగా వివరించండి (ఉదా: డబ్బులు పంపుతామని QR కోడ్ స్కాన్ చేయించారు)...',
    btnCreateIncident: 'స్పందన ప్రణాళికను రూపొందించండి',

    // Blackmail Module
    blackmailHeader: 'నాపై బెదిరింపులు వస్తున్నాయి',
    blackmailSubtitle: 'భయపడకండి, ముందుగా మీ రక్షణపై దృష్టి పెడదాం.',
    emergencyDangerTitle: 'మీ ప్రాణాలకు లేదా భద్రతకు తక్షణ ప్రమాదం ఉందా?',
    emergencyDangerWarning: 'మీ భద్రతకు తీవ్ర ముప్పు ఉంటే, వెంటనే స్థానిక అత్యవసర పోలీసులకు కాల్ చేయండి (డయల్ 112).',
    emergencyContactBtn: 'అత్యవసర పోలీసు సేవలు (112)',
    btnYes: 'అవును',
    btnNo: 'లేదు, కానీ ఆన్‌లైన్‌లో బెదిరించి డబ్బులు అడుగుతున్నారు',
    whatAreTheyThreatening: 'వారు దేనితో బెదిరిస్తున్నారు?',
    threatPrivateImages: 'వ్యక్తిగత చిత్రాలు లేదా వీడియోల లీక్ (సెక్స్‌టార్షన్)',
    threatPersonalInfo: 'వ్యక్తిగత లేదా కుటుంబ వివరాలను బయటపెట్టడం',
    threatContactFamily: 'కుటుంబ సభ్యులకు లేదా బంధువులకు పంపుతామని బెదిరించడం',
    threatDemandMoney: 'డబ్బులు లేదా క్రిప్టోకరెన్సీ డిమాండ్ చేయడం',
    threatAccountTakeover: 'నా ఖాతాను లాక్ లేదా స్వాధీనం చేసుకోవడం',
    threatPhysicalHarm: 'శారీరక హాని కలిగిస్తామని బెదిరించడం',
    threatOther: 'ఇతర వేధింపులు',
    haveAccountAccessQuestion: 'మీ ఖాతా లాగిన్ ఇంకా మీ వద్దే ఉందా?',
    generateSafetyPlanBtn: 'వ్యక్తిగత రక్షణ ప్రణాళిక పొందండి',

    // Incident Details & Actions
    incidentTimeline: 'సంఘటన కాలక్రమం',
    evidenceCollection: 'భద్రపరచిన ఆధారాలు',
    addEvidenceBtn: 'ఆధారాన్ని జోడించండి',
    recommendedActions: 'ప్రాధాన్య రక్షణ చర్యలు',
    btnDownloadPdf: 'అధికారిక PDF నివేదికను డౌన్‌లోడ్ చేయండి',
    btnResolved: 'పరిష్కరించబడినట్లు గుర్తించండి',
    btnDeleteIncident: 'సంఘటనను తొలగించండి',
    privacyNotice: 'మీ ఆధారాలలో సున్నితమైన వ్యక్తిగత సమాచారం ఉండవచ్చు. అవసరమైనది మాత్రమే అప్‌లోడ్ చేయండి.',

    // Help & Emergency
    helpHeader: 'సైబర్ క్రైమ్ ఫిర్యాదు & భద్రతా మార్గదర్శకం',
    helpSubtitle: 'భారత ప్రభుత్వ హెల్ప్‌లైన్లు, బ్యాంక్ సంప్రదింపు దశలు మరియు గోప్యతా రక్షణ నిబంధనలు.',
    nationalCybercrimeHelpline: 'జాతీయ సైబర్ క్రైమ్ హెల్ప్‌లైన్: 1930',
    nationalPortal: 'జాతీయ సైబర్ క్రైమ్ పోర్టల్: cybercrime.gov.in',
    bankEmergencyNote: 'ఆర్థిక మోసం జరిగితే, వెంటనే మొదటి 2 గంటల్లో మీ బ్యాంకుకు కాల్ చేసి లావాదేవీలను నిలిపివేయండి.',

    // Universal Assistant
    askAssistant: 'థ్రెట్‌లెన్స్‌ను అడగండి',
    assistantGreeting: 'నమస్కారం! నేను థ్రెట్‌లెన్స్ సైబర్ రక్షణ సహాయకుడిని. ఏమి జరిగిందో మీ మాటల్లో చెప్పండి, సరైన భద్రతా మార్గాన్ని నేను మీకు చూపిస్తాను.',
    assistantPlaceholder: 'ఉదా: బ్యాంక్ ఖాతా బ్లాక్ అయ్యిందని లింక్ పంపించారు...',
    assistantDisclaimer: 'థ్రెట్‌లెన్స్ డిజిటల్ భద్రతా మార్గదర్శి మాత్రమే. మేము పోలీసు లేదా బ్యాంకు అధికారులు కాదు.',

    // Common
    loading: 'వేచి ఉండండి...',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    close: 'మూసివేయండి',
    open: 'ఓపెన్ →',
    statusOpen: 'నమోదైనది',
    statusInProgress: 'చర్య కొనసాగుతోంది',
    statusResolved: 'పరిష్కరించబడింది',
    demoBadge: 'డెమో / కల్పిత సమాచారం',
    switchLanguage: 'English',
  },
};
