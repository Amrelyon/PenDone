import { LanguageCode } from '../types/pendone';

export interface TranslationBundle {
  dir: 'ltr' | 'rtl';
  label: string;
  navStore: string;
  navOnboarding: string;
  navBuilder: string;
  navLedger: string;
  navBlueprints: string;
  connectDrive: string;
  driveConnected: string;
  slogan: string;
  heroTitle: string;
  heroSubtitle: string;
  exploreStore: string;
  howControlWorks: string;
  themeDark: string;
  themeLight: string;
  translateLabel: string;
  onboardingTitle: string;
  onboardingSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  storeTitle: string;
  storeSubtitle: string;
  searchPlaceholder: string;
  openAppVault: string;
  builderTitle: string;
  builderSubtitle: string;
  publishToStore: string;
  ledgerTitle: string;
  ledgerSubtitle: string;
  blueprintsTitle: string;
  blueprintsSubtitle: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  en: {
    dir: 'ltr',
    label: 'English',
    navStore: 'Store',
    navOnboarding: 'How It Works',
    navBuilder: 'Builder',
    navLedger: 'Revenue & API',
    navBlueprints: 'Blueprints',
    connectDrive: 'Connect Drive',
    driveConnected: 'Drive Connected',
    slogan: 'Your Data Shared Under Your Control',
    heroTitle: 'Bring your own cloud storage. Build freely. Pay only when paid.',
    heroSubtitle:
      'Every app writes into a dedicated folder inside your own Google Drive under drive.file permission. PenDone stores only the pointer, enforces field-level edit rules, and takes a transparent 10% share on paid revenue.',
    exploreStore: 'Browse Store Apps',
    howControlWorks: 'How Control Works',
    themeDark: 'Dark',
    themeLight: 'Light',
    translateLabel: 'Language',
    onboardingTitle: 'How PenDone Control Works',
    onboardingSubtitle:
      'You remain the sovereign owner of your files while PenDone coordinates permissions, metered API calls, and tamper-proof revenue splits.',
    step1Title: '01. Grant App-Scoped Access',
    step1Desc:
      'Sign in with Google OAuth using the narrow drive.file scope. Each app opens only its own folder (/PenDone/<AppSlug>/data.json or Sheet). Supabase records only the file pointer—never bulk files.',
    step2Title: '02. Field-Level Edit Rules (updatable_info)',
    step2Desc:
      'View all records clearly inside the app. Only fields listed in updatable_info can be edited through the Supabase Edge Function gateway; system fields and financial ledgers reject unauthorized writes with HTTP 403.',
    step3Title: '03. Revoke Access Anytime',
    step3Desc:
      'Disconnect any app storage pointer in one click. Because your data lives inside your own Google Drive, nothing is locked inside PenDone servers.',
    storeTitle: 'PenDone Store',
    storeSubtitle: 'Cross-platform BYOS web apps backed by your own Google Drive and unified metadata.',
    searchPlaceholder: 'Search apps, slugs, or storage formats...',
    openAppVault: 'Open App & Vault',
    builderTitle: 'Zero-Upfront Builder Studio',
    builderSubtitle:
      'Design an App Storage Manifest, starter HTML gateway client, and optional Code.gs Workspace script—then publish straight to PenDone Store.',
    publishToStore: 'Publish to PenDone Store',
    ledgerTitle: 'Metered API & 10% Revenue Ledger',
    ledgerSubtitle:
      'Every gateway request logs api_calls and bytes_transferred, while paid transactions split 90% to builders and 10% to PenDone server-side.',
    blueprintsTitle: '3-Platform Architecture & Starter Files',
    blueprintsSubtitle:
      'Built strictly on Google AI Studio, GitHub (Pages + Actions), and Supabase (PostgreSQL, Auth, Edge Functions) with user-owned Google Drive storage.',
  },
  ar: {
    dir: 'rtl',
    label: 'العربية',
    navStore: 'المتجر',
    navOnboarding: 'كيف يعمل التحكم',
    navBuilder: 'منشئ التطبيقات',
    navLedger: 'العوائد والـ API',
    navBlueprints: 'المخططات',
    connectDrive: 'ربط Google Drive',
    driveConnected: 'تم ربط Drive',
    slogan: 'بياناتك مشاركة تحت سيطرتك الكاملة',
    heroTitle: 'أحضر تخزينك السحابي الخاص. ابنِ بحرية. ادفع فقط عند تحقيق الدخل.',
    heroSubtitle:
      'ينشئ كل تطبيق مجلدًا مخصصًا داخل حسابك في Google Drive بصلاحية drive.file. يحتفظ PenDone بمؤشر الملف فقط ويطبق قواعد التعديل على مستوى الحقول مع نسبة 10% فقط من الأرباح.',
    exploreStore: 'تصفح متجر التطبيقات',
    howControlWorks: 'كيف يعمل التحكم',
    themeDark: 'داكن',
    themeLight: 'فاتح',
    translateLabel: 'اللغة',
    onboardingTitle: 'كيف يعمل التحكم في بياناتك',
    onboardingSubtitle:
      'تبقى المالك الكامل لملفاتك بينما يدير PenDone الصلاحيات، وحساب استهلاك الـ API، وتقسيم العوائد على الخادم.',
    step1Title: '01. منح صلاحية محدودة للتطبيق',
    step1Desc:
      'سجّل الدخول عبر Google OAuth بنطاق drive.file الضيق. يفتح كل تطبيق مجلده الخاص فقط داخل Drive، ولا يخزن Supabase سوى مؤشر الملف.',
    step2Title: '02. قواعد التعديل على مستوى الحقول',
    step2Desc:
      'يمكنك عرض جميع البيانات وتعديل الحقول المسموح بها فقط (updatable_info) عبر بوابة Edge Function، بينما تظل الحقول المحمية والسجل المالي مقفلة برمز 403.',
    step3Title: '03. إلغاء الوصول في أي وقت',
    step3Desc:
      'افصل أي تطبيق بنقرة واحدة. بياناتك تبقى في Google Drive الخاص بك ولن تُحتجز داخل خوادم PenDone.',
    storeTitle: 'متجر PenDone',
    storeSubtitle: 'تطبيقات ويب تعمل على تخزينك السحابي الخاص مع قاعدة بيانات موحدة.',
    searchPlaceholder: 'ابحث عن تطبيق أو تنسيق تخزين...',
    openAppVault: 'فتح التطبيق والخزنة',
    builderTitle: 'استوديو البناء بدون تكلفة مسبقة',
    builderSubtitle:
      'أنشئ ملف manifest.app.json وكود HTML وملف Code.gs الاختياري وانشر تطبيقك مباشرة في متجر PenDone.',
    publishToStore: 'نشر في متجر PenDone',
    ledgerTitle: 'عداد الـ API وسجل العوائد (10%)',
    ledgerSubtitle:
      'يتم تسجيل كل طلب API وحجم البيانات، وتُحسب حصة المطور 90% ورسوم PenDone 10% مباشرة في PostgreSQL.',
    blueprintsTitle: 'البنية الثلاثية وملفات البداية',
    blueprintsSubtitle:
      'مبنية حصريًا على Google AI Studio وGitHub وSupabase مع تخزين Google Drive المملوك للمستخدم.',
  },
  fr: {
    dir: 'ltr',
    label: 'Français',
    navStore: 'Boutique',
    navOnboarding: 'Fonctionnement',
    navBuilder: 'Studio',
    navLedger: 'Revenus & API',
    navBlueprints: 'Plans',
    connectDrive: 'Connecter Drive',
    driveConnected: 'Drive connecté',
    slogan: 'Vos Données Partagées Sous Votre Contrôle',
    heroTitle: 'Apportez votre stockage cloud. Créez librement. Payez uniquement si vous gagnez.',
    heroSubtitle:
      'Chaque application écrit dans un dossier dédié de votre Google Drive sous permission drive.file. PenDone ne stocke que le pointeur et prélève 10% sur les revenus payants.',
    exploreStore: 'Explorer la boutique',
    howControlWorks: 'Comment fonctionne le contrôle',
    themeDark: 'Sombre',
    themeLight: 'Clair',
    translateLabel: 'Langue',
    onboardingTitle: 'Comment fonctionne le contrôle PenDone',
    onboardingSubtitle:
      'Vous restez propriétaire de vos fichiers tandis que PenDone gère les permissions et le partage des revenus.',
    step1Title: '01. Accès limité par application',
    step1Desc:
      'Connectez Google Drive avec le scope drive.file. Chaque application crée son dossier (/PenDone/<AppSlug>/data.json) et Supabase ne garde que le pointeur.',
    step2Title: '02. Règles d’édition par champ (updatable_info)',
    step2Desc:
      'Consultez vos enregistrements et modifiez uniquement les champs autorisés via la passerelle Supabase Edge Function.',
    step3Title: '03. Révoquer l’accès à tout moment',
    step3Desc:
      'Révoquez un pointeur en un clic. Vos données restent dans votre propre Google Drive.',
    storeTitle: 'Boutique PenDone',
    storeSubtitle: 'Applications BYOS multi-appareils connectées à votre Google Drive.',
    searchPlaceholder: 'Rechercher une application...',
    openAppVault: 'Ouvrir l’app & coffre',
    builderTitle: 'Studio de création sans frais initiaux',
    builderSubtitle:
      'Générez le manifeste JSON, le client HTML et le script Code.gs optionnel puis publiez dans la boutique.',
    publishToStore: 'Publier sur PenDone Store',
    ledgerTitle: 'Compteur API & Partage 10%',
    ledgerSubtitle:
      'Chaque appel est mesuré côté serveur et les paiements reversent 90% au créateur et 10% à PenDone.',
    blueprintsTitle: 'Architecture à 3 plateformes',
    blueprintsSubtitle:
      'Google AI Studio, GitHub Pages/Actions et Supabase PostgreSQL + Edge Functions.',
  },
  es: {
    dir: 'ltr',
    label: 'Español',
    navStore: 'Tienda',
    navOnboarding: 'Cómo funciona',
    navBuilder: 'Constructor',
    navLedger: 'Ingresos y API',
    navBlueprints: 'Planos',
    connectDrive: 'Conectar Drive',
    driveConnected: 'Drive conectado',
    slogan: 'Tus Datos Compartidos Bajo Tu Control',
    heroTitle: 'Trae tu propio almacenamiento. Crea sin costo inicial. Paga solo si cobras.',
    heroSubtitle:
      'Cada app guarda datos en su propia carpeta dentro de tu Google Drive con permiso drive.file. PenDone solo almacena el puntero y aplica un 10% sobre ingresos.',
    exploreStore: 'Explorar tienda',
    howControlWorks: 'Cómo funciona el control',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    translateLabel: 'Idioma',
    onboardingTitle: 'Cómo funciona el control en PenDone',
    onboardingSubtitle:
      'Mantienes la propiedad total de tus archivos mientras PenDone controla permisos y métricas.',
    step1Title: '01. Conceder acceso por app',
    step1Desc:
      'Conecta Google OAuth con alcance drive.file. Cada app abre su carpeta (/PenDone/<AppSlug>/data.json) y Supabase guarda solo la referencia.',
    step2Title: '02. Reglas de edición por campo',
    step2Desc:
      'Visualiza registros y edita solo campos updatable_info mediante la Edge Function; los campos protegidos devuelven 403.',
    step3Title: '03. Revocar acceso cuando quieras',
    step3Desc:
      'Desconecta cualquier app en un clic. Tus datos permanecen siempre en tu Google Drive.',
    storeTitle: 'Tienda PenDone',
    storeSubtitle: 'Aplicaciones web BYOS listas para instalar como PWA en móvil y escritorio.',
    searchPlaceholder: 'Buscar aplicaciones...',
    openAppVault: 'Abrir app y bóveda',
    builderTitle: 'Estudio constructor sin costo inicial',
    builderSubtitle:
      'Configura manifest.app.json, cliente HTML y Code.gs opcional y publícalo en la tienda.',
    publishToStore: 'Publicar en PenDone Store',
    ledgerTitle: 'Medición de API y 10% de ingresos',
    ledgerSubtitle:
      'Registro exacto de api_calls, bytes transferidos y reparto 90% creador / 10% plataforma.',
    blueprintsTitle: 'Arquitectura de 3 plataformas',
    blueprintsSubtitle:
      'Google AI Studio, GitHub y Supabase con almacenamiento en Google Drive del usuario.',
  },
  id: {
    dir: 'ltr',
    label: 'Bahasa',
    navStore: 'Toko',
    navOnboarding: 'Cara Kerja',
    navBuilder: 'Studio',
    navLedger: 'Pendapatan & API',
    navBlueprints: 'Cetak Biru',
    connectDrive: 'Hubungkan Drive',
    driveConnected: 'Drive Terhubung',
    slogan: 'Data Anda Dibagikan Di Bawah Kendali Anda',
    heroTitle: 'Gunakan penyimpanan cloud Anda sendiri. Bangun gratis. Bayar hanya saat dibayar.',
    heroSubtitle:
      'Setiap aplikasi menyimpan data ke folder khusus di Google Drive Anda dengan izin drive.file. PenDone hanya menyimpan pointer dan mengambil 10% dari pendapatan berbayar.',
    exploreStore: 'Jelajahi Toko',
    howControlWorks: 'Cara Kendali Bekerja',
    themeDark: 'Gelap',
    themeLight: 'Terang',
    translateLabel: 'Bahasa',
    onboardingTitle: 'Cara Kerja Kendali PenDone',
    onboardingSubtitle:
      'Anda tetap menjadi pemilik sah atas file Anda sementara PenDone mengatur izin dan kuota API.',
    step1Title: '01. Berikan Akses Khusus Aplikasi',
    step1Desc:
      'Masuk dengan Google OAuth cakupan drive.file. Setiap aplikasi hanya membuka foldernya sendiri di Drive Anda.',
    step2Title: '02. Aturan Edit Per Bidang (updatable_info)',
    step2Desc:
      'Lihat catatan dan perbarui hanya bidang yang diizinkan melalui Edge Function; bidang sistem tetap terkunci.',
    step3Title: '03. Cabut Akses Kapan Saja',
    step3Desc:
      'Putuskan pointer aplikasi dengan satu klik. Data tetap aman di Google Drive pribadi Anda.',
    storeTitle: 'Toko PenDone',
    storeSubtitle: 'Aplikasi web BYOS lintas perangkat yang terhubung ke Google Drive Anda.',
    searchPlaceholder: 'Cari aplikasi atau format...',
    openAppVault: 'Buka Aplikasi & Brankas',
    builderTitle: 'Studio Pembuat Tanpa Biaya Awal',
    builderSubtitle:
      'Buat manifest.app.json, HTML pemula, dan skrip Code.gs opsional lalu terbitkan ke Toko.',
    publishToStore: 'Terbitkan ke Toko PenDone',
    ledgerTitle: 'Metering API & Bagi Hasil 10%',
    ledgerSubtitle:
      'Semua panggilan API tercatat otomatis dan transaksi membagi 90% untuk pembuat dan 10% untuk PenDone.',
    blueprintsTitle: 'Arsitektur 3 Platform',
    blueprintsSubtitle:
      'Google AI Studio, GitHub Pages/Actions, dan Supabase PostgreSQL + Edge Functions.',
  },
};
