export type Locale = "en" | "sw" | "fr" | "rw";

export interface LanguageOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", speechLang: "en-US" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", speechLang: "sw-KE" },
  { code: "fr", label: "French", nativeLabel: "Français", speechLang: "fr-FR" },
  {
    code: "rw",
    label: "Kinyarwanda",
    nativeLabel: "Kinyarwanda",
    speechLang: "rw-RW",
  },
];

export interface TranslationDictionary {
  brandSubtitle: string;
  nav: Record<string, string>;
  common: {
    signIn: string;
    signInToPortal: string;
    openPortal: string;
    signOut: string;
    signingOut: string;
    backToHome: string;
    backToSite: string;
    refresh: string;
    refreshing: string;
    save: string;
    saving: string;
    reset: string;
    search: string;
    dictate: string;
    listening: string;
    dictateUnsupported: string;
    ready: string;
    inProgress: string;
    openModule: string;
    language: string;
    requestTask: string;
    copyBriefing: string;
    copied: string;
  };
  home: {
    badge: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    resetPasswordLink: string;
    modulesTitle: string;
    modulesSubtitle: string;
    architectureTitle: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    demoLabel: string;
    useDemo: string;
    demoFilled: string;
    workEmail: string;
    password: string;
    forgotPassword: string;
    keepSignedIn: string;
    signingIn: string;
    show: string;
    hide: string;
    forgotTitle: string;
    forgotSubtitle: string;
    sendResetLink: string;
    sendingLink: string;
    backToSignIn: string;
    resetTitle: string;
    resetSubtitle: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    updatingPassword: string;
  };
  dashboard: {
    welcomeBack: string;
    subtitle: string;
    today: string;
    week: string;
    month: string;
    deployedWorkers: string;
    activeTeams: string;
    actualVsTarget: string;
    targetAchievement: string;
    attendance: string;
    shifts: string;
    pending: string;
    targetLabel: string;
    chartTitle: string;
    recentUpdates: string;
    viewAll: string;
    teamsTitle: string;
    teamsSubtitle: string;
    searchTeamsPlaceholder: string;
    allStatuses: string;
    exceeding: string;
    onTrack: string;
    needsAttention: string;
    noTeamsMatch: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    unread: string;
    markAllRead: string;
    alertPreferences: string;
    allUpdates: string;
    production: string;
    shifts: string;
    performance: string;
    searchPlaceholder: string;
    markRead: string;
    markUnread: string;
    dismiss: string;
    emptyTitle: string;
    emptySubtitle: string;
    showAll: string;
    restoreDemo: string;
  };
  settings: {
    title: string;
    subtitle: string;
    tabProfile: string;
    tabCompany: string;
    tabSecurity: string;
    tabNotifications: string;
    saveProfile: string;
    saveCompany: string;
    savePrefs: string;
    updatePassword: string;
    resetDefaults: string;
    activeSession: string;
    signOutDevice: string;
  };
  assistant: {
    buttonLabel: string;
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    clear: string;
    readAloud: string;
    welcome: string;
    prompts: string[];
  };
}

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  en: {
    brandSubtitle: "Client Operations Portal",
    nav: {
      "/dashboard": "Dashboard",
      "/daily-performance": "Daily Performance",
      "/shift-performance": "Shift Performance",
      "/team-performance": "Team Performance",
      "/work-activities": "Work Activities",
      "/reports": "Reports & Analytics",
      "/notifications": "Notifications",
      "/settings": "Profile & Settings",
    },
    common: {
      signIn: "Sign In",
      signInToPortal: "Sign In to Portal",
      openPortal: "Go to Dashboard",
      signOut: "Sign out",
      signingOut: "Signing out...",
      backToHome: "Back to Site",
      backToSite: "Visit Site",
      refresh: "Refresh",
      refreshing: "Refreshing...",
      save: "Save",
      saving: "Saving...",
      reset: "Reset",
      search: "Search",
      dictate: "Dictate",
      listening: "Listening...",
      dictateUnsupported: "Voice dictation is not supported in this browser",
      ready: "Ready",
      inProgress: "In Progress",
      openModule: "Open module",
      language: "Language",
      requestTask: "Request Task",
      copyBriefing: "Copy Briefing",
      copied: "Copied ✓",
    },
    home: {
      badge: "Q-Sourcing Servtec · WorkPulse",
      headline:
        "Monitor team delivery, production targets, and shift performance in one clean portal.",
      subheadline:
        "Track deployed Q-Sourcing teams in real time, verify daily target achievement, submit new task requests for team assignment, and receive instant shift updates.",
      primaryCta: "Sign In to Portal",
      secondaryCta: "Explore Features",
      resetPasswordLink: "Reset password",
      modulesTitle: "Built for Operations Excellence",
      modulesSubtitle:
        "Everything your operations leadership needs to track Q-Sourcing workforce delivery.",
      architectureTitle: "How WorkPulse Works",
    },
    auth: {
      loginTitle: "Sign in to your account",
      loginSubtitle: "Access your Q-Sourcing teams, shift outputs, and reports.",
      demoLabel: "Demo Client Account",
      useDemo: "Use demo",
      demoFilled: "Filled ✓",
      workEmail: "Work Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      keepSignedIn: "Keep me signed in on this device",
      signingIn: "Signing in...",
      show: "Show",
      hide: "Hide",
      forgotTitle: "Reset your password",
      forgotSubtitle:
        "Enter the work email linked to your Q-Sourcing client account and we'll send a secure password reset link.",
      sendResetLink: "Send Reset Link",
      sendingLink: "Sending link...",
      backToSignIn: "Back to Sign In",
      resetTitle: "Set a new password",
      resetSubtitle:
        "Choose a strong password for your Q-Sourcing WorkPulse client account.",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePassword: "Update Password",
      updatingPassword: "Updating password...",
    },
    dashboard: {
      welcomeBack: "Welcome back",
      subtitle:
        "Live overview of deployed workers, active teams, production targets, and actual output",
      today: "Today",
      week: "This Week",
      month: "This Month",
      deployedWorkers: "Deployed Workers",
      activeTeams: "Active Teams",
      actualVsTarget: "Actual vs. Target Output",
      targetAchievement: "Target Achievement",
      attendance: "attendance",
      shifts: "shifts",
      pending: "pending",
      targetLabel: "Target",
      chartTitle: "Production Target vs. Actual Output",
      recentUpdates: "Recent Updates",
      viewAll: "View all",
      teamsTitle: "Active Teams Breakdown",
      teamsSubtitle:
        "Deployed headcount, agreed target, and actual output per team",
      searchTeamsPlaceholder: "Search team, supervisor, or shift...",
      allStatuses: "All",
      exceeding: "Exceeding",
      onTrack: "On Track",
      needsAttention: "Needs Attention",
      noTeamsMatch: "No teams match your current search or filter.",
    },
    notifications: {
      title: "Notifications & Alerts",
      subtitle:
        "Stay updated on production milestones, completed shifts, and team performance variances.",
      unread: "unread",
      markAllRead: "Mark all as read",
      alertPreferences: "Alert Preferences",
      allUpdates: "All Updates",
      production: "Production",
      shifts: "Shifts",
      performance: "Performance",
      searchPlaceholder: "Search teams, shifts, alerts...",
      markRead: "Mark read",
      markUnread: "Mark unread",
      dismiss: "Dismiss",
      emptyTitle: "No notifications match this filter",
      emptySubtitle:
        "You're all caught up on production, shift, and team performance updates.",
      showAll: "Show all updates",
      restoreDemo: "Restore demo alerts",
    },
    settings: {
      title: "Profile & Settings",
      subtitle:
        "Manage your client account details, company site information, password security, and alert preferences.",
      tabProfile: "Account Profile",
      tabCompany: "Company Details",
      tabSecurity: "Security & Password",
      tabNotifications: "Alert Preferences",
      saveProfile: "Save Profile Changes",
      saveCompany: "Save Company Details",
      savePrefs: "Save Alert Preferences",
      updatePassword: "Update Password",
      resetDefaults: "Reset to defaults",
      activeSession: "Active Session",
      signOutDevice: "Sign out of this device",
    },
    assistant: {
      buttonLabel: "AI Assistant",
      title: "WorkPulse AI Assistant",
      subtitle: "Ask about teams, targets, shifts, or settings",
      placeholder: "Ask a question or tap mic to dictate...",
      send: "Send",
      clear: "Clear",
      readAloud: "Read replies aloud",
      welcome:
        "Hello! I'm your Q-Sourcing WorkPulse AI Assistant. Ask me about deployed workers, production targets, teams needing attention, or recent shift alerts.",
      prompts: [
        "Today's output summary",
        "Which teams need attention?",
        "How many workers are deployed?",
        "Show unread shift alerts",
      ],
    },
  },
  sw: {
    brandSubtitle: "Lango la Operesheni za Wateja",
    nav: {
      "/dashboard": "Dashibodi",
      "/daily-performance": "Utendaji wa Kila Siku",
      "/shift-performance": "Utendaji wa Zamu",
      "/team-performance": "Utendaji wa Timu",
      "/work-activities": "Shughuli za Kazi",
      "/reports": "Ripoti na Uchambuzi",
      "/notifications": "Arifa",
      "/settings": "Wasifu na Mipangilio",
    },
    common: {
      signIn: "Ingia",
      signInToPortal: "Ingia kwenye Lango",
      openPortal: "Nenda Dashibodi",
      signOut: "Toka",
      signingOut: "Inatoka...",
      backToHome: "Rudi Tovuti",
      backToSite: "Tembelea Tovuti",
      refresh: "Onyesha Upya",
      refreshing: "Inasasisha...",
      save: "Hifadhi",
      saving: "Inahifadhi...",
      reset: "Rejesha",
      search: "Tafuta",
      dictate: "Tamka",
      listening: "Inasikiliza...",
      dictateUnsupported: "Utambuzi wa sauti haupatikani kwenye kivinjari hiki",
      ready: "Tayari",
      inProgress: "Inaendelea",
      openModule: "Fungua sehemu",
      language: "Lugha",
      requestTask: "Omba Kazi",
      copyBriefing: "Nakili Muhtasari",
      copied: "Imenakiliwa ✓",
    },
    home: {
      badge: "Q-Sourcing Servtec · WorkPulse",
      headline:
        "Fuatilia utoaji wa timu, malengo ya uzalishaji, na utendaji wa zamu mahali pamoja.",
      subheadline:
        "Angalia timu za Q-Sourcing kwa wakati halisi, thibitisha malengo ya kila siku, omba kazi mpya kwa msimamizi, na pokea arifa za zamu.",
      primaryCta: "Ingia kwenye Lango",
      secondaryCta: "Tazama Vipengele",
      resetPasswordLink: "Badilisha nenosiri",
      modulesTitle: "Imeundwa kwa Ubora wa Operesheni",
      modulesSubtitle:
        "Kila kitu unachohitaji kufuatilia utoaji wa wafanyakazi wa Q-Sourcing.",
      architectureTitle: "Jinsi WorkPulse Inavyofanya Kazi",
    },
    auth: {
      loginTitle: "Ingia kwenye akaunti yako",
      loginSubtitle: "Fikia timu zako za Q-Sourcing, matokeo ya zamu, na ripoti.",
      demoLabel: "Akaunti ya Majaribio",
      useDemo: "Tumia jaribio",
      demoFilled: "Imejazwa ✓",
      workEmail: "Barua Pepe ya Kazi",
      password: "Nenosiri",
      forgotPassword: "Umesahau nenosiri?",
      keepSignedIn: "Niweke nimeingia kwenye kifaa hiki",
      signingIn: "Inaingia...",
      show: "Onyesha",
      hide: "Ficha",
      forgotTitle: "Rejesha nenosiri lako",
      forgotSubtitle:
        "Ingiza barua pepe ya kazi iliyounganishwa na akaunti yako ya Q-Sourcing ili kupokea kiungo salama.",
      sendResetLink: "Tuma Kiungo cha Kurejesha",
      sendingLink: "Inatuma kiungo...",
      backToSignIn: "Rudi Kuingia",
      resetTitle: "Weka nenosiri jipya",
      resetSubtitle:
        "Chagua nenosiri thabiti kwa akaunti yako ya Q-Sourcing WorkPulse.",
      newPassword: "Nenosiri Jipya",
      confirmPassword: "Thibitisha Nenosiri Jipya",
      updatePassword: "Sasisha Nenosiri",
      updatingPassword: "Inasasisha nenosiri...",
    },
    dashboard: {
      welcomeBack: "Karibu tena",
      subtitle:
        "Muhtasari wa wafanyakazi kazini, timu hai, malengo ya uzalishaji, na matokeo halisi",
      today: "Leo",
      week: "Wiki Hii",
      month: "Mwezi Huu",
      deployedWorkers: "Wafanyakazi Kazini",
      activeTeams: "Timu Hai",
      actualVsTarget: "Matokeo Halisi dhidi ya Lengo",
      targetAchievement: "Ufanisi wa Lengo",
      attendance: "mahudhurio",
      shifts: "zamu",
      pending: "bado",
      targetLabel: "Lengo",
      chartTitle: "Lengo la Uzalishaji dhidi ya Matokeo Halisi",
      recentUpdates: "Taarifa za Hivi Karibuni",
      viewAll: "Tazama zote",
      teamsTitle: "Mchanganuo wa Timu Hai",
      teamsSubtitle:
        "Idadi ya wafanyakazi, lengo lililokubaliwa, na matokeo halisi kwa kila timu",
      searchTeamsPlaceholder: "Tafuta timu, msimamizi, au zamu...",
      allStatuses: "Zote",
      exceeding: "Inazidi Lengo",
      onTrack: "Kwenye Mstari",
      needsAttention: "Inahitaji Umakini",
      noTeamsMatch: "Hakuna timu inayolingana na utafutaji wako.",
    },
    notifications: {
      title: "Arifa na Tahadhari",
      subtitle:
        "Pata taarifa za uzalishaji, zamu zilizokamilika, na mabadiliko ya utendaji wa timu.",
      unread: "hazijasomwa",
      markAllRead: "Weka zote kuwa zimesomwa",
      alertPreferences: "Mipangilio ya Arifa",
      allUpdates: "Taarifa Zote",
      production: "Uzalishaji",
      shifts: "Zamu",
      performance: "Utendaji",
      searchPlaceholder: "Tafuta timu, zamu, arifa...",
      markRead: "Imesomwa",
      markUnread: "Haijasomwa",
      dismiss: "Ondoa",
      emptyTitle: "Hakuna arifa zinazolingana na kichujio hiki",
      emptySubtitle: "Umesoma arifa zote za uzalishaji, zamu, na utendaji.",
      showAll: "Onyesha zote",
      restoreDemo: "Rejesha arifa za jaribio",
    },
    settings: {
      title: "Wasifu na Mipangilio",
      subtitle:
        "Dhibiti maelezo ya akaunti yako, taarifa za kampuni, usalama wa nenosiri, na mipangilio ya arifa.",
      tabProfile: "Wasifu wa Akaunti",
      tabCompany: "Maelezo ya Kampuni",
      tabSecurity: "Usalama na Nenosiri",
      tabNotifications: "Mipangilio ya Arifa",
      saveProfile: "Hifadhi Wasifu",
      saveCompany: "Hifadhi Maelezo ya Kampuni",
      savePrefs: "Hifadhi Mipangilio ya Arifa",
      updatePassword: "Sasisha Nenosiri",
      resetDefaults: "Rejesha chaguomsingi",
      activeSession: "Kipindi Hai",
      signOutDevice: "Toka kwenye kifaa hiki",
    },
    assistant: {
      buttonLabel: "Msaidizi wa AI",
      title: "Msaidizi wa WorkPulse AI",
      subtitle: "Uliza kuhusu timu, malengo, zamu, au mipangilio",
      placeholder: "Andika swali au bonyeza maikrofoni kutamka...",
      send: "Tuma",
      clear: "Futa",
      readAloud: "Soma majibu kwa sauti",
      welcome:
        "Habari! Mimi ni Msaidizi wa AI wa Q-Sourcing WorkPulse. Niulize kuhusu wafanyakazi kazini, malengo ya uzalishaji, timu zinazohitaji umakini, au arifa za zamu.",
      prompts: [
        "Muhtasari wa uzalishaji wa leo",
        "Timu zipi zinahitaji umakini?",
        "Wafanyakazi wangapi wako kazini?",
        "Onyesha arifa ambazo hazijasomwa",
      ],
    },
  },
  fr: {
    brandSubtitle: "Portail des Opérations Clients",
    nav: {
      "/dashboard": "Tableau de bord",
      "/daily-performance": "Performance quotidienne",
      "/shift-performance": "Performance par poste",
      "/team-performance": "Performance des équipes",
      "/work-activities": "Activités de travail",
      "/reports": "Rapports et analyses",
      "/notifications": "Notifications",
      "/settings": "Profil et paramètres",
    },
    common: {
      signIn: "Connexion",
      signInToPortal: "Connexion au portail",
      openPortal: "Tableau de bord",
      signOut: "Déconnexion",
      signingOut: "Déconnexion...",
      backToHome: "Retour au site",
      backToSite: "Voir le site",
      refresh: "Actualiser",
      refreshing: "Actualisation...",
      save: "Enregistrer",
      saving: "Enregistrement...",
      reset: "Réinitialiser",
      search: "Rechercher",
      dictate: "Dicter",
      listening: "Écoute...",
      dictateUnsupported: "La dictée vocale n'est pas prise en charge",
      ready: "Prêt",
      inProgress: "En cours",
      openModule: "Ouvrir le module",
      language: "Langue",
      requestTask: "Demander une tâche",
      copyBriefing: "Copier le résumé",
      copied: "Copié ✓",
    },
    home: {
      badge: "Q-Sourcing Servtec · WorkPulse",
      headline:
        "Suivez la livraison des équipes, les objectifs de production et les postes dans un seul portail.",
      subheadline:
        "Surveillez vos équipes Q-Sourcing en temps réel, soumettez de nouvelles tâches pour affectation par l'administrateur et recevez des alertes de poste.",
      primaryCta: "Connexion au portail",
      secondaryCta: "Découvrir les fonctionnalités",
      resetPasswordLink: "Réinitialiser le mot de passe",
      modulesTitle: "Conçu pour l'excellence opérationnelle",
      modulesSubtitle:
        "Tout ce dont votre direction a besoin pour suivre vos équipes Q-Sourcing.",
      architectureTitle: "Comment fonctionne WorkPulse",
    },
    auth: {
      loginTitle: "Connectez-vous à votre compte",
      loginSubtitle:
        "Accédez à vos équipes Q-Sourcing, résultats de poste et rapports.",
      demoLabel: "Compte Client Démo",
      useDemo: "Utiliser démo",
      demoFilled: "Rempli ✓",
      workEmail: "E-mail professionnel",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      keepSignedIn: "Rester connecté sur cet appareil",
      signingIn: "Connexion...",
      show: "Afficher",
      hide: "Masquer",
      forgotTitle: "Réinitialiser votre mot de passe",
      forgotSubtitle:
        "Saisissez l'e-mail professionnel associé à votre compte Q-Sourcing pour recevoir un lien sécurisé.",
      sendResetLink: "Envoyer le lien",
      sendingLink: "Envoi en cours...",
      backToSignIn: "Retour à la connexion",
      resetTitle: "Définir un nouveau mot de passe",
      resetSubtitle:
        "Choisissez un mot de passe fort pour votre compte client Q-Sourcing WorkPulse.",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le nouveau mot de passe",
      updatePassword: "Mettre à jour",
      updatingPassword: "Mise à jour...",
    },
    dashboard: {
      welcomeBack: "Bon retour",
      subtitle:
        "Vue en direct des agents déployés, équipes actives, objectifs et production réelle",
      today: "Aujourd'hui",
      week: "Cette semaine",
      month: "Ce mois",
      deployedWorkers: "Agents déployés",
      activeTeams: "Équipes actives",
      actualVsTarget: "Production réelle vs objectif",
      targetAchievement: "Atteinte des objectifs",
      attendance: "présence",
      shifts: "postes",
      pending: "en attente",
      targetLabel: "Objectif",
      chartTitle: "Objectif de production vs production réelle",
      recentUpdates: "Mises à jour récentes",
      viewAll: "Tout voir",
      teamsTitle: "Détail des équipes actives",
      teamsSubtitle:
        "Effectif déployé, objectif convenu et production réelle par équipe",
      searchTeamsPlaceholder: "Rechercher équipe, superviseur ou poste...",
      allStatuses: "Toutes",
      exceeding: "Au-dessus",
      onTrack: "Conforme",
      needsAttention: "Attention requise",
      noTeamsMatch: "Aucune équipe ne correspond à votre filtre.",
    },
    notifications: {
      title: "Notifications et alertes",
      subtitle:
        "Restez informé des jalons de production, postes terminés et écarts de performance.",
      unread: "non lues",
      markAllRead: "Tout marquer comme lu",
      alertPreferences: "Préférences d'alerte",
      allUpdates: "Toutes",
      production: "Production",
      shifts: "Postes",
      performance: "Performance",
      searchPlaceholder: "Rechercher équipes, postes, alertes...",
      markRead: "Marquer lu",
      markUnread: "Marquer non lu",
      dismiss: "Ignorer",
      emptyTitle: "Aucune notification pour ce filtre",
      emptySubtitle:
        "Vous êtes à jour sur toutes les alertes de production et de poste.",
      showAll: "Tout afficher",
      restoreDemo: "Restaurer les alertes démo",
    },
    settings: {
      title: "Profil et paramètres",
      subtitle:
        "Gérez votre compte client, les informations de l'entreprise, le mot de passe et vos alertes.",
      tabProfile: "Profil du compte",
      tabCompany: "Entreprise",
      tabSecurity: "Sécurité et mot de passe",
      tabNotifications: "Préférences d'alerte",
      saveProfile: "Enregistrer le profil",
      saveCompany: "Enregistrer l'entreprise",
      savePrefs: "Enregistrer les préférences",
      updatePassword: "Mettre à jour le mot de passe",
      resetDefaults: "Rétablir par défaut",
      activeSession: "Session active",
      signOutDevice: "Déconnecter cet appareil",
    },
    assistant: {
      buttonLabel: "Assistant IA",
      title: "Assistant IA WorkPulse",
      subtitle: "Posez une question sur vos équipes, objectifs ou postes",
      placeholder: "Écrivez ou cliquez sur le micro pour dicter...",
      send: "Envoyer",
      clear: "Effacer",
      readAloud: "Lire les réponses à voix haute",
      welcome:
        "Bonjour ! Je suis votre Assistant IA Q-Sourcing WorkPulse. Demandez-moi le statut des agents déployés, les objectifs du jour ou les équipes nécessitant une attention.",
      prompts: [
        "Résumé de production du jour",
        "Quelles équipes demandent attention ?",
        "Combien d'agents sont déployés ?",
        "Afficher les alertes non lues",
      ],
    },
  },
  rw: {
    brandSubtitle: "Urubuga rw'Abakiriya",
    nav: {
      "/dashboard": "Incamake",
      "/daily-performance": "Umusaruro wa Buri Munsi",
      "/shift-performance": "Umusaruro w'Amasaha",
      "/team-performance": "Umusaruro w'Amatsinda",
      "/work-activities": "Ibikorwa by'Akazi",
      "/reports": "Raporo n'Isesengura",
      "/notifications": "Ubutumwa",
      "/settings": "Umwirondoro n'Igenamiterere",
    },
    common: {
      signIn: "Injira",
      signInToPortal: "Injira ku Rubuga",
      openPortal: "Jya ku Incamake",
      signOut: "Sohoka",
      signingOut: "Gusohora...",
      backToHome: "Subira ku Rubuga",
      backToSite: "Sura Urubuga",
      refresh: "Vugurura",
      refreshing: "Kuvugurura...",
      save: "Bika",
      saving: "Kubika...",
      reset: "Subiza uko byari",
      search: "Shakisha",
      dictate: "Vuga",
      listening: "Gutege amatwi...",
      dictateUnsupported: "Ijwi ntirikora kuri iyi mushakisha",
      ready: "Biteguye",
      inProgress: "Birimo gukorwa",
      openModule: "Fungura igice",
      language: "Ururimi",
      requestTask: "Saba Igikorwa",
      copyBriefing: "Koporora Incamake",
      copied: "Byakoporowe ✓",
    },
    home: {
      badge: "Q-Sourcing Servtec · WorkPulse",
      headline:
        "Kurikirana imikorere y'amatsinda, intego z'umusaruro, n'amasaha y'akazi ahantu hamwe.",
      subheadline:
        "Reba abakozi ba Q-Sourcing bari mu kazi ako kanya, saba ibikorwa bishya bihabwa amatsinda n'umuyobozi, kandi ubone amakuru y'amasaha y'akazi.",
      primaryCta: "Injira ku Rubuga",
      secondaryCta: "Reba Ibirimo",
      resetPasswordLink: "Hindura ijambo ry'ibanga",
      modulesTitle: "Byubakiwe Imikorere Myiza",
      modulesSubtitle:
        "Ibikenewe byose mu gukurikirana amatsinda ya Q-Sourcing.",
      architectureTitle: "Uko WorkPulse Ikora",
    },
    auth: {
      loginTitle: "Injira muri konti yawe",
      loginSubtitle:
        "Genzura amatsinda ya Q-Sourcing, umusaruro, na raporo zawe.",
      demoLabel: "Konti y'Igerageza",
      useDemo: "Koresha igerageza",
      demoFilled: "Byuzuye ✓",
      workEmail: "Imeri y'Akazi",
      password: "Ijambo ry'ibanga",
      forgotPassword: "Wibagiwe ijambo ry'ibanga?",
      keepSignedIn: "Nkomeze kuba ninjiye kuri iki gikoresho",
      signingIn: "Kwinjira...",
      show: "Erekana",
      hide: "Hisha",
      forgotTitle: "Hindura ijambo ry'ibanga",
      forgotSubtitle:
        "Andika imeri y'akazi ihujwe na konti yawe ya Q-Sourcing twohereze ihuza ryo guhindura.",
      sendResetLink: "Ohereza Ihuza",
      sendingLink: "Kohereza...",
      backToSignIn: "Subira Kwinjira",
      resetTitle: "Shyiraho ijambo ry'ibanga rishya",
      resetSubtitle:
        "Hitamo ijambo ry'ibanga rikomeye rya konti yawe ya Q-Sourcing WorkPulse.",
      newPassword: "Ijambo ry'ibanga rishya",
      confirmPassword: "Emeza ijambo ry'ibanga rishya",
      updatePassword: "Vugurura Ijambo ry'ibanga",
      updatingPassword: "Kuvugurura...",
    },
    dashboard: {
      welcomeBack: "Murakaza neza",
      subtitle:
        "Incamake y'abakozi bari ku kazi, amatsinda akora, intego, n'umusaruro wabonetse",
      today: "Uyu munsi",
      week: "Iki cyumweru",
      month: "Uku kwezi",
      deployedWorkers: "Abakozi bari ku kazi",
      activeTeams: "Amatsinda akora",
      actualVsTarget: "Umusaruro n'Intego",
      targetAchievement: "Ikigero cy'Intego",
      attendance: "ubwitabire",
      shifts: "amasaha",
      pending: "bisigaye",
      targetLabel: "Intego",
      chartTitle: "Intego y'Umusaruro n'Umusaruro Wabonetse",
      recentUpdates: "Amakuru Mashya",
      viewAll: "Reba yose",
      teamsTitle: "Imikorere y'Amatsinda",
      teamsSubtitle:
        "Umubare w'abakozi, intego yemejwe, n'umusaruro kuri buri tsinda",
      searchTeamsPlaceholder: "Shakisha itsinda, umuyobozi, cyangwa igihe...",
      allStatuses: "Yose",
      exceeding: "Yarengeje",
      onTrack: "Biri ku murongo",
      needsAttention: "Bikeneye kwitabwaho",
      noTeamsMatch: "Nta tsinda rihuye n'ibyo ushakisha.",
    },
    notifications: {
      title: "Ubutumwa n'Imenyesha",
      subtitle:
        "Menya amakuru y'umusaruro, amasaha arangiye, n'imikorere y'amatsinda.",
      unread: "bitarasomwa",
      markAllRead: "Bishyire byose nk'ibyasomwe",
      alertPreferences: "Igenamiterere ry'Ubutumwa",
      allUpdates: "Yose",
      production: "Umusaruro",
      shifts: "Amasaha",
      performance: "Imikorere",
      searchPlaceholder: "Shakisha amatsinda, amasaha, ubutumwa...",
      markRead: "Byasomwe",
      markUnread: "Bitarasomwa",
      dismiss: "Kuraho",
      emptyTitle: "Nta butumwa buhuye n'uyu muyunguruzi",
      emptySubtitle: "Wasomye amakuru yose y'umusaruro n'amatsinda.",
      showAll: "Erekana yose",
      restoreDemo: "Garura ubutumwa bw'igerageza",
    },
    settings: {
      title: "Umwirondoro n'Igenamiterere",
      subtitle:
        "Genzura amakuru ya konti yawe, ikigo, umutekano w'ijambo ry'ibanga, n'ubutumwa.",
      tabProfile: "Umwirondoro",
      tabCompany: "Amakuru y'Ikigo",
      tabSecurity: "Umutekano",
      tabNotifications: "Igenamiterere ry'Ubutumwa",
      saveProfile: "Bika Umwirondoro",
      saveCompany: "Bika Amakuru y'Ikigo",
      savePrefs: "Bika Igenamiterere",
      updatePassword: "Vugurura Ijambo ry'ibanga",
      resetDefaults: "Subiza uko byari",
      activeSession: "Igihe uri muri konti",
      signOutDevice: "Sohoka kuri iki gikoresho",
    },
    assistant: {
      buttonLabel: "Umufasha wa AI",
      title: "Umufasha wa WorkPulse AI",
      subtitle: "Baza ku matsinda, intego, amasaha, cyangwa igenamiterere",
      placeholder: "Andika ikibazo cyangwa kanda mikoro uvuge...",
      send: "Ohereza",
      clear: "Siba",
      readAloud: "Soma ibisubizo mu ijwi",
      welcome:
        "Muraho! Ndi Umufasha wa AI wa Q-Sourcing WorkPulse. Mbaza ku bakozi bari ku kazi, intego z'uyu munsi, cyangwa amatsinda akeneye kwitabwaho.",
      prompts: [
        "Incamake y'umusaruro w'uyu munsi",
        "Ni ayahe matsinda akeneye kwitabwaho?",
        "Abakozi bangahe bari ku kazi?",
        "Erekana ubutumwa butarasomwa",
      ],
    },
  },
};
