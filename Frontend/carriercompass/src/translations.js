const translations = {
  en: {
    // ---------Header---------------------------------------------------
    home: "Home",
    plans: "Plans",
    contact: "Contacts",
    tool: "Tool",
    account: "My Account",
    // ---------Footer--------------------------------------------------
    help: "Help",
    privacyPolicy: "Privacy Policy",
    cookiesPolicy: "Cookies Policy",
    address: "Address",
    phoneNumber: "Phone Number",
    email: "Email",
    // ---------HeroSection---------------------------------------------
    heroTitle: "Turn your skills into an advantage – improve your CV and discover your potential.",
    heroDescription: "Get personalised recommendations, courses and job offers",
    heroButton: "Try now",
    // ---------HowToUse------------------------------------------------
    HowToUseTitle: "How to use our tool?",
    Step: "Step",
    steps: [
      {
        id: "First",
        title: "Upload Your CV",
        description: "Drag-and-drop or select a file to analyze.",
      },
      {
        id: "Second",
        title: "Get Personalized Recommendations",
        description: "The system analyzes your CV and suggests 5 areas for improvement.",
      },
      {
        id: "Third",
        title: "Choose a Field or Job Position",
        description: "Select a field for growth or pick a job you're interested in.",
      },
      {
        id: "Fourth",
        title: "Discover Recommendations and Job Offers",
        description: "The system provides learning recommendations (videos, tasks) and job postings that match your goals.",
      },
    ],
    // ---------Features------------------------------------------------
    featuresTitle: "How can we help?",
    features: [
      {
        title: "Smart CV Analysis",
        description:
          "Automatically scans and analyzes CV content (skills, experience, education). Identifies missing skills needed for your field. Provides personalized recommendations for improving your CV.",
      },
      {
        title: "Career Path Identification",
        description:
          "The AI compares your skills with the needs of the labour market. It makes personalised job offers based on your areas of strength. Offers tips on how to tailor your CV.",
      },
      {
        title: "Personalized Learning Recommendations",
        description:
          "The AI chooses the courses that are right for you, helping you to develop the skills you need. The aim is to help you acquire the competences you need for your job faster.",
      },
      {
        title: "Job Offers Based on Your Profile",
        description:
          "AI compares your skills with job market demands. Provides personalized job offers based on your strengths. Offers tips on how to tailor your CV.",
      },
    ],
    // ---------BottomHeader------------------------------------------------
    bottomHeaderText: "Go one step further - become the best version of yourself with our help",
    // ---------PlanCards---------------------------------------------------
    plan: [
      {
        name: "Free",
        price: "0.00€/per mėnesį",
        features: [
          "Get 2 general CV analyses — watch ads to get more",
          "Upload CVs in PDF format",
          "Explore general course suggestions"
        ],
      },
      {
        name: "Premium",
        price: "14.99€/per mėnesį",
        features: [
          "Unlimited general CV analysis — no ads, ever",
          "Unlimited job-specific CV analysis — also ad-free",
          "Upload your CV in PDF or Word format",
          "Explore general course suggestions",
          "Get personalized course recommendations based on your skills",
          "See job offers that match your skillset"
        ],
      },
      {
        name: "Student",
        price: "9.99€/per mėnesį",
        features: [
          "Unlimited general CV analysis — no ads, ever",
          "Unlimited job-specific CV analysis — also ad-free",
          "Upload your CV in PDF or Word format",
          "Explore general course suggestions",
          "Get personalized course recommendations based on your skills",
          "See job offers that match your skillset"
        ],
      },
      {
        name: "Premium+",
        price: "59.99€",
        features: [
          "Unlimited general CV analysis — no ads, ever",
          "Unlimited job-specific CV analysis — also ad-free",
          "Upload your CV in PDF or Word format",
          "Explore general course suggestions",
          "Get personalized course recommendations based on your skills",
          "See job offers that match your skillset"
        ],
      },
    ],
    plansHeroTitle: "Career Compass Plans",
    plansHeroSubTitle: "Choose the right plan for you",
    planCurrentlyActive: "Active",
    planStudent: "Discount for eligible students",
    planSemiAnnualDiscount: "Get 6 months for the price of 4!",
    planTypeAnnually: "Annually",
    planTypeMonth: "Monthly",
    planButton: "Get Started",
    // ---------PlanTable-----------------------------------------------------
    featureColumnName: "Feature",
    usagePerMonth: "Usages per month",
    unlimited: "Unlimited",
    featuresTable: {
      "Reklamos": "Ads",
      "Bendrinė CV analizė": "General CV analysis",
      "Mokymosi kursai": "General course recommendations",
      "Išplėstinė CV analizė": "Job-specific CV analysis",
      "Personalizuoti mokymosi kursai": "Personalized course recommendations",
      "Personalizuoti darbo pasiūlymai": "Personalized job offers",
      "Galimas skirtingas CV įkėlimas": "Support for multiple CV file formats"
    },
    // ---------DragAnDrop---------------------------------------------------
    dragDrop: "Drag and Drop Your CV here",
    or: "OR",
    selectFile: "Select file",
    changeFile: "Change file",
    selectedFile: "Selected file",
    invalidFile: "Only PDF and Word documents are allowed.",
    selectITJob: "Select IT Job",
    general: "General Analysis",
    Submit: "Submit",

    // ---------Loading---------------------------------------------------
    loadingMessage: "It will take a moment, CV is being processed...",
    // ---------ResultNavSidebar---------------------------------------------------
    Recommendations: "Recommendations",
    allJobs: "Jobs",
    allCourses: "Courses",
    browse: "Browse",
    courses: "Courses",
    skilsGained: "Skills you'll gain",
    jobs: "Jobs",
    // ---------CV-recommendations----------------------------------------
    CVRecommendationsTitle: "Recommendations for CV development",
    // ---------top5Jobs-----------------------------------------------
    top5JobsTitle: "Most suitable job areas",
    Matching: "Matching",

    // ---------courses-----------------------------------------------
    courseRecommendationsTitle: "Courses Recommendations",
    // ---------Resultpage-----------------------------------------------
    jobNavTitle: "Job Recommendations",
    // ---------Login-----------------------------------------------
    password: "Password",
    signIn: "Sign In",
    regRedir: "New Here? Register",
    forgotPass: "Forgot Password",
    // ---------Register-----------------------------------------------
    surname: "Surname",
    userName: "Name",
    register: "Register",
    registering: "Registering...",
    // ---------ProfileDataCard-----------------------------------------------
    personalInfoTitle: "Personal Information",
    editButton: "Edit",
    creditsTitle: "Credits Left",

    // ---------CreditsAmountCard-----------------------------------------------
    getPlanButton: "Get Plan",
    creditText1: "You have",
    creditText2: "credits available this month",
    // ---------ProfileEditForm-----------------------------------------------
    editTitle: "Edit Personal Information",
    editChangePasswordTitle: "Change Password",
    editCurrentPassword: "Current Password",
    editNewPassword: "New Password",
    editRepeatNewPassword: "Repeat New Password",
    saving: "Saving...",
    saveChanges: "Save Changes",
    // ---------ProfilePageLayout-----------------------------------------------
    navTitle: "Profile",
    myData: "My details",
    editProfile: "Edit Profile",
    payments: "Payments",
    logout: "Sign Out",
    // ---------JobListingPage-----------------------------------------------
    sendResume: "Send Resume",
    // ---------CoursesPage-----------------------------------------------
    EnrollForFree: "Enroll for Free",
    Modules: "Modules",
    Rating: "Rating",
    Reviews: "Reviews",
    Level: "Level of experience",
    Schedule: "Schedule",
    Duration: "Duration",
    NoSkillsListed: "No skills listed",
    CourseDescription: "Course description",


    subscriptionInfo: "Plan Details",
    planName: "Plan Name",
    creditAmount: "Credit amount per month",
    dateFrom: "Start Date",
    dateTo: "End Date",
    unlimitedCredits: "Unlimited",
    adsTitle: "Ads",
    adsLeftText1: "You can watch",
    adsLeftText2: "ads today",
    watchAdButton: "Watch Ad",
    watchAdAlert: "You received 1 credit!",

    noCreditsError: "You don’t have enough credits.",
    UnknownTimeUntilReset: "Unknown",
    restAvailableNow: "Ad have reseted",
    leftUntilAdReset: "left until ad reset",

    // ---------JobsRecommendation IT Restriction-------------------
    notITUserMessage: "Based on your CV analysis, your experience doesn't match IT field requirements. We recommend exploring IT courses that will help you acquire the necessary skills.",
    goToCoursesButton: "View recommended courses",

    // ---------Payment page------------------
    Price: "Price",
    Currency: "Currency",
    PaymentHistory: "Payment History",
    date: "Date",

    // ---------SkillsDisplay-------------------------------------------
    yourSkills: "Your Skills",
    noSkillsAvailable: "No skills available.",

    MatchedSkills: "Your Skills",
    MissingSkills: "Missing Skills",
    yourCareerPaths: "Career Paths",
    noCareerPathsAvailable: "No career paths available.",
    careerPathsteps: "Steps",

    errorRecommendation: "Recommendation generation failed",
    improveResume: "Tailor your CV to the job",
    uploadNewCv: "Upload new CV",
    uploadNewCvDesc: "Use a different file for a fresh analysis",
    chooseOption: "Choose one",
    useExistingCv: "Use My Existing CV",
    useExistingCvDesc: "We'll analyze your previously uploaded CV.",
    useExistingCv2: "Use Existing CV",
    Cancel: "Cancel",

    UploadYourCV: "Upload Your CV",
    dragDropOrClick: "Drag & drop or click to select a file",
    accptedFormats: "Accepted formats:",

    matchLevel: "Chance of getting this job",
    summaryAnalysis: "Summary",
    GeneralAnalysis: "General Analysis",

  },




  lt: {
    // ---------Header------------------------------------------------
    home: "Pagrindinis",
    plans: "Planai",
    contact: "Kontaktai",
    tool: "Įrankis",
    account: "Mano paskyra",
    // ---------Footer------------------------------------------------
    help: "Pagalba",
    privacyPolicy: "Privatumo politika",
    cookiesPolicy: "Slapukų politika",
    address: "Adresas",
    phoneNumber: "Telefonas",
    email: "El. paštas",
    // ---------HeroSection------------------------------------------
    heroTitle: "Paversk savo įgūdžius pranašumu – tobulink savo CV ir atrask savo potencialą.",
    heroDescription: "Gauk personalizuotas rekomendacijas, kursus ir darbo pasiūlymus",
    heroButton: "Pabandyk dabar",
    // ---------HowToUse--------------------------------------------
    HowToUseTitle: "Kaip naudotis įrankiu?",
    Step: " žingsnis",
    steps: [
      {
        id: "Pirmas",
        title: "Įkelkite savo CV",
        description: "Drag-and-drop arba pasirinkite failą, kurį norite analizuoti.",
      },
      {
        id: "Antras",
        title: "Gaukite personalizuotas rekomendacijas",
        description: "Sistema analizuoja jūsų CV ir pateikia 5 sritis, kuriose galite tobulėti.",
      },
      {
        id: "Trečias",
        title: "Pasirinkite norimą tobulėjimo sritį ar darbą",
        description: "Išsirinkite, kur norite tobulėti – sritį arba pasirinkite dominančią darbo poziciją.",
      },
      {
        id: "Ketvirtas",
        title: "Atraskite rekomendacijas ir darbo pasiūlymus",
        description: "Sistema pateikia personalizuotas mokymų rekomendacijas (video, užduotys), taip pat darbo skelbimus, atitinkančius jūsų tikslus.",
      },
    ],
    // ---------Features---------------------------------------------
    featuresTitle: "Kaip galime padėti?",
    features: [
      {
        title: "Išmanioji CV analizė",
        description:
          "Automatiškai nuskaito ir analizuoja CV turinį (įgūdžius, patirtį, išsilavinimą). Atpažįsta trūkstamus įgūdžius. Pateikia personalizuotas rekomendacijas CV patobulinimui.",
      },
      {
        title: "Karjeros kelio nustatymas",
        description:
          "AI analizuoja tavo CV, kad nustatytų 5 ryškiausias karjeros kryptis. Grafinškai parodo, kurios sritys tau tinkamiausios ir kodėl. Palyginama su rinkos tendencijomis, kad gautum geriausias įsidarbinimo galimybes.",
      },
      {
        title: "Individualios mokymosi rekomendacijos",
        description:
          "AI parenka tau tinkamiausius kursus, padedančios lavinti trūkstamus įgūdžius. Tikslas - padėti greičiau įgyti darbui reikalingų kompetencijų.",
      },
      {
        title: "Darbo pasiūlymai pagal tavo profilį",
        description:
          "AI palygina tavo įgūdžius su darbų rinkos poreikiais. Pateikia asmeninius darbo pasiūlymus pagal tavo stipriausias sritis. Siūlomi patarimai, kaip pritaikyti savo CV.",
      },
    ],
    // ---------BottomHeader------------------------------------------------
    bottomHeaderText: "Ženk žingsnį į priekį – tapk geriausia savo versija su mūsų pagalba",
    // ---------PlanCards--------------------------------------------------
    plan: [
      {
        name: "Free",
        price: "0.00€/per mėnesį",
        features: [
          "2 nemokamos bendrinės CV analizės — gauk daugiau žiūrėdamas reklamas",
          "Įkelk savo CV tik PDF formatu",
          "Naršyk mokymosi kursus"
        ],
      },
      {
        name: "Premium",
        price: "14.99€/per mėnesį",
        features: [
          "Neribotas kiekis bendrinių CV analizių skaičius — be reklamų",
          "Neribotas kiekis CV analizių pagal darbo poziciją — taip pat be reklamų",
          "Įkelk savo CV PDF ar Word formatu",
          "Naršyk mokymosi kursus",
          "Gauk personalizuotas mokymosi kursų rekomendacijas pagal savo įgūdžius",
          "Rask darbo pasiūlymus, kurie atitinka tavo įgūdžius"
        ],
      },
      {
        name: "Student",
        price: "9.99€/per mėnesį",
        features: [
          "Neribotas kiekis bendrinių CV analizių skaičius — be reklamų",
          "Neribotas kiekis CV analizių pagal darbo poziciją — taip pat be reklamų",
          "Įkelk savo CV PDF ar Word formatu",
          "Naršyk mokymosi kursus",
          "Gauk personalizuotas mokymosi kursų rekomendacijas pagal savo įgūdžius",
          "Rask darbo pasiūlymus, kurie atitinka tavo įgūdžius"
        ],
      },
      {
        name: "Premium+",
        price: "59.99€/per mėnesį",
        features: [
          "Neribotas kiekis bendrinių CV analizių skaičius — be reklamų",
          "Neribotas kiekis CV analizių pagal darbo poziciją — taip pat be reklamų",
          "Įkelk savo CV PDF ar Word formatu",
          "Naršyk mokymosi kursus",
          "Gauk personalizuotas mokymosi kursų rekomendacijas pagal savo įgūdžius",
          "Rask darbo pasiūlymus, kurie atitinka tavo įgūdžius"
        ],
      },
    ],
    plansHeroTitle: "Career Compass Planai",
    plansHeroSubTitle: "Pasirink sau tinkamą planą",
    planCurrentlyActive: "Aktyvus",
    planStudent: "Esi studentas? Sutaupyk!",
    planSemiAnnualDiscount: "Gauk 6 mėnesius už 4 kainą!",
    planTypeAnnually: "Metinis",
    planTypeMonth: "Mėnesinis",
    planButton: "Pasirinkti",
    // ---------PlanTable---------------------------------------------------
    featureColumnName: "Funkcionalumas",
    usagePerMonth: "Panaudojimai per mėnesį",
    unlimited: "Neribotas",
    featuresTable: {
      "Reklamos": "Reklamos",
      "Bendrinė CV analizė": "Bendrinė CV analizė",
      "Mokymosi kursai": "Mokymosi kursai",
      "Išplėstinė CV analizė": "Išplėstinė CV analizė",
      "Personalizuoti mokymosi kursai": "Personalizuoti mokymosi kursai",
      "Personalizuoti darbo pasiūlymai": "Personalizuoti darbo pasiūlymai",
      "Galimas skirtingas CV įkėlimas": "Galimas skirtingas CV įkėlimas"
    },

    // ---------DragAnDrop---------------------------------------------------
    dragDrop: "Drag-and-drop savo CV čia",
    or: "arba",
    selectFile: "Pasirinkti failą",
    changeFile: "Pakeisti failą",
    selectedFile: "Pasirinktas failas",
    invalidFile: "Leidžiami tik PDF ir Word dokumentai.",
    selectITJob: "Pasirinkti IT darbą",
    general: "Bendrinė analizė",
    Submit: "Pateikti",
    noCreditsError: "Neturite pakankamai kreditų.",
    // ---------Loading---------------------------------------------------
    loadingMessage: "Tai užtruks keletą sekundžių, CV yra apdorojamas...",
    // ---------ResultNavSidebar---------------------------------------------------
    Recommendations: "Rekomendacijos",
    allJobs: "Darbo skelbimai",
    allCourses: "Kursai",
    browse: "Ieškoti",
    courses: "Kursai",
    jobs: "Darbo pasiūlymai",
    skilsGained: "Įgūdžiai kuriuose įgysite",
    // ---------CV-recommendations----------------------------------------
    CVRecommendationsTitle: "CV tobulinimo rekomendacijos",
    // ---------top5Jobs-----------------------------------------------
    top5JobsTitle: "Tinkamiausios darbo sritys",
    Matching: "Atitikimas",
    // ---------JobListings-----------------------------------------------
    results: "Rezultatai",
    // ---------courses-----------------------------------------------
    courseRecommendationsTitle: "Kursų rekomendacijos",
    // ---------Resultpage-----------------------------------------------
    jobNavTitle: "Darbų rekomendacijos",
    // ---------Login-----------------------------------------------
    password: "Slaptažodis",
    signIn: "Prisijungti",
    regRedir: "Dar neturi paskyros? Registruokis čia",
    forgotPass: "Pamiršote slaptažodį?",
    // ---------Register-----------------------------------------------
    surname: "Pavardė",
    userName: "Vardas",
    register: "Registruotis",
    registering: "Registruojama..",
    // ---------ProfilePage-----------------------------------------------
    personalInfoTitle: "Asmeninė informacija",
    editButton: "Redaguoti",
    creditsTitle: "Kreditų likutis",
    // ---------CreditsAmountCard-----------------------------------------------
    getPlanButton: "Įsigykite planą",
    creditText1: "Jūs turite",
    creditText2: "kreditų šį mėnesį",
    // ---------ProfileEditForm-----------------------------------------------
    editTitle: "Redaguoti asmeninę informaciją",
    editChangePasswordTitle: "Keisti slaptažodį",
    editCurrentPassword: "Dabartinis slaptažodis",
    editNewPassword: "Naujas slaptažodis",
    editRepeatNewPassword: "Pakartokite naują slaptažodį",
    saving: "Išsaugoma...",
    saveChanges: "Išsaugoti pakeitimus",
    // ---------ProfilePageLayout-----------------------------------------------
    navTitle: "Profilis",
    myData: "Mano duomenys",
    editProfile: "Redaguoti profilį",
    payments: "Mokėjimai",
    logout: "Atsijungti",
    // ---------JobListingPage-----------------------------------------------
    sendResume: "Siųsti CV dabar",
    // ---------CoursesPage-----------------------------------------------
    EnrollForFree: "Registruokitės nemokamai",
    Modules: "Moduliai",
    Rating: "Įvertinimas",
    Reviews: "Atsiliepimai",
    Level: "Patirties lygis",
    Schedule: "Tvarkaraštis",
    Duration: "Trukmė",
    NoSkillsListed: "Nėra išvardytų įgūdžių",
    CourseDescription: "Kurso aprašymas",

    subscriptionInfo: "Plano informacija",
    planName: "Plano pavadinimas",
    creditAmount: "Kreditų kiekis per mėnesį",
    dateFrom: "Pradžios data",
    dateTo: "Pabaigos data",
    unlimitedCredits: "Neribotas",
    adsTitle: "Reklamos",
    adsLeftText1: "Šiandien dar turite",
    adsLeftText2: "neperžiūrėtų reklamų",
    watchAdButton: "Žiūrėti reklamą",
    watchAdAlert: "Gavote 1 kreditą!",

    UnknownTimeUntilReset: "Nežinomas",
    restAvailableNow: "Reklamos atnaujintos",
    leftUntilAdReset: "like iki reklamų atnaujinimo",

    // ---------JobsRecommendation IT Restriction-------------------
    notITUserMessage: "Pagal jūsų CV analizę, jūsų patirtis neatitinka IT srities reikalavimų. Rekomenduojame susipažinti su IT kursais, kurie padės įgyti reikiamus įgūdžius.",
    goToCoursesButton: "Peržiūrėti rekomenduojamus kursus",
    // ---------Payment page------------------
    Price: "Kaina",
    Currency: "Valiuta",
    PaymentHistory: "Mokėjimų istorija",
    date: "Data",

    // ---------SkillsDisplay-------------------------------------------
    yourSkills: "Jūsų įgūdžiai",
    noSkillsAvailable: "Nėra įgūdžių.",

    MatchedSkills: "Tavo įgūdžiai",
    MissingSkills: "Trūkstami įgūdžiai",
    yourCareerPaths: "Karjeros kryptys",
    noCareerPathsAvailable: "Karjeros krypčių nerasta.",
    careerPathsteps: "Žingsniai",

    errorRecommendation: "Rekomendacijos generavimas nepavyko",
    improveResume: "Pritaikyk savo CV darbui",
    uploadNewCv: "Įkelti naują CV",
    uploadNewCvDesc: "Naudok kitą failą naujai analizei",
    chooseOption: "Pasirinkite vieną",
    useExistingCv: "Naudoti mano esamą CV",
    useExistingCvDesc: "Analizuosime tavo anksčiau įkeltą CV.",
    useExistingCv2: "Naudoti esamą CV",
    Cancel: "Atšaukti",

    UploadYourCV: "Įkelkite savo CV",
    dragDropOrClick: "Drag & drop arba spustelėkite, kad pasirinktumėte failą",
    accptedFormats: "Priimtini formatai:",

     matchLevel: "Tikimybė gauti šį darbą",
    summaryAnalysis: "Santrauka",
    GeneralAnalysis: "Bendrinė analizė",

  },
};

export default translations;
