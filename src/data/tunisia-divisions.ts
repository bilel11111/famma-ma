/**
 * Tunisian Administrative Divisions
 * Governorates and their delegations with bilingual names
 */

export interface Delegation {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
}

export interface Governorate {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  delegations: Delegation[];
  latitude: number;
  longitude: number;
}

export const TUNISIAN_GOVERNORATES: Governorate[] = [
  {
    id: "tunis",
    name: { fr: "Tunis", ar: "تونس" },
    latitude: 36.8065,
    longitude: 10.1815,
    delegations: [
      { id: "tunis-medina", name: { fr: "Tunis Médina", ar: "تونس المدينة" } },
      { id: "tunis-bab-souika", name: { fr: "Tunis Bab Souika", ar: "باب سويقة" } },
      { id: "tunis-bab-jedida", name: { fr: "Tunis Bab Jédida", ar: "باب جديدة" } },
      { id: "tunis-el-ksar", name: { fr: "Tunis El Ksar", ar: "القصر" } },
      { id: "tunis-la-marsa", name: { fr: "La Marsa", ar: "المرسى" } },
      { id: "tunis-carthage", name: { fr: "Carthage", ar: "قرطاج" } },
      { id: "tunis-sidi-bousaid", name: { fr: "Sidi Bousaid", ar: "سيدي بوسعيد" } },
      { id: "tunis-el-menzah", name: { fr: "El Menzah", ar: "المنزه" } },
    ],
  },
  {
    id: "ariana",
    name: { fr: "Ariana", ar: "أريانة" },
    latitude: 36.8598,
    longitude: 10.1648,
    delegations: [
      { id: "ariana-ariana", name: { fr: "Ariana", ar: "أريانة" } },
      { id: "ariana-kalaat-andalous", name: { fr: "Kalaat Andalous", ar: "قلعة الأندلس" } },
      { id: "ariana-raoued", name: { fr: "Raoued", ar: "رواد" } },
      { id: "ariana-skhira", name: { fr: "Skhira", ar: "الصخيرة" } },
    ],
  },
  {
    id: "ben-arous",
    name: { fr: "Ben Arous", ar: "بن عروس" },
    latitude: 36.7425,
    longitude: 10.2347,
    delegations: [
      { id: "ben-arous-ben-arous", name: { fr: "Ben Arous", ar: "بن عروس" } },
      { id: "ben-arous-rades", name: { fr: "Radès", ar: "الرادس" } },
      { id: "ben-arous-mghira", name: { fr: "M'Ghira", ar: "مغيرة" } },
      { id: "ben-arous-hammam-lif", name: { fr: "Hammam Lif", ar: "حمام الحياة" } },
      { id: "ben-arous-bou-arada", name: { fr: "Bou Arada", ar: "بوعراده" } },
      { id: "ben-arous-mohamedia", name: { fr: "Mohamedia", ar: "المحمدية" } },
    ],
  },
  {
    id: "manouba",
    name: { fr: "Manouba", ar: "منوبة" },
    latitude: 36.8104,
    longitude: 10.0959,
    delegations: [
      { id: "manouba-manouba", name: { fr: "Manouba", ar: "منوبة" } },
      { id: "manouba-oued-ellil", name: { fr: "Oued Ellil", ar: "واد الليل" } },
      { id: "manouba-djedaida", name: { fr: "Djedaida", ar: "جديدة" } },
      { id: "manouba-tebourba", name: { fr: "Tebourba", ar: "تبوربة" } },
      { id: "manouba-douar-hicher", name: { fr: "Douar Hicher", ar: "دوار هيشر" } },
    ],
  },
  {
    id: "nabeul",
    name: { fr: "Nabeul", ar: "نابل" },
    latitude: 36.4519,
    longitude: 10.7369,
    delegations: [
      { id: "nabeul-nabeul", name: { fr: "Nabeul", ar: "نابل" } },
      { id: "nabeul-hammamet", name: { fr: "Hammamet", ar: "الحمامات" } },
      { id: "nabeul-kelibia", name: { fr: "Kelibia", ar: "قليبية" } },
      { id: "nabeul-korba", name: { fr: "Korba", ar: "قربة" } },
      { id: "nabeul-menzel-temime", name: { fr: "Menzel Temime", ar: "منزل تميم" } },
      { id: "nabeul-dar-chaabane", name: { fr: "Dar Chaabane", ar: "دار الشعبانة" } },
      { id: "nabeul-grombalia", name: { fr: "Grombalia", ar: "قرومبالية" } },
      { id: "nabeul-beni-khiar", name: { fr: "Béni Khiar", ar: "بني خيار" } },
    ],
  },
  {
    id: "zaghouan",
    name: { fr: "Zaghouan", ar: "زغوان" },
    latitude: 36.4049,
    longitude: 10.1432,
    delegations: [
      { id: "zaghouan-zaghouan", name: { fr: "Zaghouan", ar: "زغوان" } },
      { id: "zaghouan-nadhour", name: { fr: "Nadhour", ar: "نادور" } },
      { id: "zaghouan-zriba", name: { fr: "Zriba", ar: "زريبة" } },
    ],
  },
  {
    id: "sousse",
    name: { fr: "Sousse", ar: "سوسة" },
    latitude: 35.8256,
    longitude: 10.6369,
    delegations: [
      { id: "sousse-sousse-medina", name: { fr: "Sousse Médina", ar: "سوسة المدينة" } },
      { id: "sousse-sousse-riadh", name: { fr: "Sousse Riadh", ar: "سوسة الرياض" } },
      { id: "sousse-kondar", name: { fr: "Kondar", ar: "قندار" } },
      { id: "sousse-skhira", name: { fr: "Skhira", ar: "الصخيرة" } },
      { id: "sousse-akouda", name: { fr: "Akouda", ar: "أقودة" } },
    ],
  },
  {
    id: "monastir",
    name: { fr: "Monastir", ar: "المنستير" },
    latitude: 35.7731,
    longitude: 10.8347,
    delegations: [
      { id: "monastir-monastir", name: { fr: "Monastir", ar: "المنستير" } },
      { id: "monastir-ksar-hellal", name: { fr: "Ksar Hellal", ar: "قصر الحلال" } },
      { id: "monastir-teboulba", name: { fr: "Teboulba", ar: "تبولبة" } },
      { id: "monastir-benane", name: { fr: "Benane", ar: "بنان" } },
      { id: "monastir-sahline", name: { fr: "Sahline", ar: "سهلين" } },
    ],
  },
  {
    id: "mahdia",
    name: { fr: "Mahdia", ar: "المهدية" },
    latitude: 35.5047,
    longitude: 11.0625,
    delegations: [
      { id: "mahdia-mahdia", name: { fr: "Mahdia", ar: "المهدية" } },
      { id: "mahdia-el-jem", name: { fr: "El Jem", ar: "الجم" } },
      { id: "mahdia-skhira", name: { fr: "Skhira", ar: "الصخيرة" } },
      { id: "mahdia-chebba", name: { fr: "Chebba", ar: "الشبة" } },
    ],
  },
  {
    id: "sfax",
    name: { fr: "Sfax", ar: "صفاقس" },
    latitude: 34.7406,
    longitude: 10.7603,
    delegations: [
      { id: "sfax-sfax-medina", name: { fr: "Sfax Médina", ar: "صفاقس المدينة" } },
      { id: "sfax-sfax-ville", name: { fr: "Sfax Ville", ar: "صفاقس الجديدة" } },
      { id: "sfax-thyna", name: { fr: "Thyna", ar: "ثينة" } },
      { id: "sfax-sakiet-ezzit", name: { fr: "Sakiet Ezzit", ar: "ساقية الزيت" } },
      { id: "sfax-kerkennah", name: { fr: "Kerkennah", ar: "قرقنة" } },
      { id: "sfax-menzel-chaker", name: { fr: "Menzel Chaker", ar: "منزل الشاكر" } },
    ],
  },
  {
    id: "gabes",
    name: { fr: "Gabès", ar: "قابس" },
    latitude: 33.8869,
    longitude: 10.0994,
    delegations: [
      { id: "gabes-gabes", name: { fr: "Gabès", ar: "قابس" } },
      { id: "gabes-mareth", name: { fr: "Mareth", ar: "مارث" } },
      { id: "gabes-matmata", name: { fr: "Matmata", ar: "متمطة" } },
      { id: "gabes-nouvelle-matmata", name: { fr: "Nouvelle Matmata", ar: "متمطة الجديدة" } },
    ],
  },
  {
    id: "medenine",
    name: { fr: "Médenine", ar: "مدنين" },
    latitude: 33.3547,
    longitude: 10.5047,
    delegations: [
      { id: "medenine-medenine", name: { fr: "Médenine", ar: "مدنين" } },
      { id: "medenine-djerba", name: { fr: "Djerba", ar: "جربة" } },
      { id: "medenine-zarzis", name: { fr: "Zarzis", ar: "جرجيس" } },
      { id: "medenine-ben-guerdane", name: { fr: "Ben Guerdane", ar: "بن قردان" } },
    ],
  },
  {
    id: "tataouine",
    name: { fr: "Tataouine", ar: "تطاوين" },
    latitude: 32.9295,
    longitude: 10.4547,
    delegations: [
      { id: "tataouine-tataouine", name: { fr: "Tataouine", ar: "تطاوين" } },
      { id: "tataouine-remada", name: { fr: "Remada", ar: "رمادة" } },
      { id: "tataouine-dehiba", name: { fr: "Dehiba", ar: "الدهيبة" } },
    ],
  },
  {
    id: "gafsa",
    name: { fr: "Gafsa", ar: "قفصة" },
    latitude: 34.4269,
    longitude: 8.7848,
    delegations: [
      { id: "gafsa-gafsa", name: { fr: "Gafsa", ar: "قفصة" } },
      { id: "gafsa-metlaoui", name: { fr: "Métlaoui", ar: "متلاوي" } },
      { id: "gafsa-mdhilla", name: { fr: "Mdhilla", ar: "مضيلة" } },
      { id: "gafsa-redeyef", name: { fr: "Redeyef", ar: "الرديف" } },
      { id: "gafsa-sened", name: { fr: "Sened", ar: "سنة" } },
    ],
  },
  {
    id: "tozeur",
    name: { fr: "Tozeur", ar: "توزر" },
    latitude: 33.9197,
    longitude: 8.1349,
    delegations: [
      { id: "tozeur-tozeur", name: { fr: "Tozeur", ar: "توزر" } },
      { id: "tozeur-degache", name: { fr: "Dégache", ar: "الدقاش" } },
      { id: "tozeur-nefta", name: { fr: "Nefta", ar: "نفطة" } },
    ],
  },
  {
    id: "kebili",
    name: { fr: "Kébili", ar: "قبلي" },
    latitude: 33.7069,
    longitude: 8.9706,
    delegations: [
      { id: "kebili-kebili", name: { fr: "Kébili", ar: "قبلي" } },
      { id: "kebili-douz", name: { fr: "Douz", ar: "دوز" } },
      { id: "kebili-souk-jedid", name: { fr: "Souk Jedid", ar: "سوق الجديد" } },
    ],
  },
  {
    id: "kasserine",
    name: { fr: "Kasserine", ar: "القصرين" },
    latitude: 35.1686,
    longitude: 8.8347,
    delegations: [
      { id: "kasserine-kasserine", name: { fr: "Kasserine", ar: "القصرين" } },
      { id: "kasserine-sbeitla", name: { fr: "Sbeitla", ar: "سبيطلة" } },
      { id: "kasserine-foussana", name: { fr: "Foussana", ar: "فوسانة" } },
      { id: "kasserine-thala", name: { fr: "Thala", ar: "ثالة" } },
      { id: "kasserine-feriana", name: { fr: "Feriana", ar: "فريانة" } },
    ],
  },
  {
    id: "sidi-bouzid",
    name: { fr: "Sidi Bouzid", ar: "سيدي بوزيد" },
    latitude: 35.0369,
    longitude: 9.4847,
    delegations: [
      { id: "sidi-bouzid-sidi-bouzid", name: { fr: "Sidi Bouzid", ar: "سيدي بوزيد" } },
      { id: "sidi-bouzid-regueb", name: { fr: "Regueb", ar: "الرقيب" } },
      { id: "sidi-bouzid-meknassy", name: { fr: "Meknassy", ar: "مكناسي" } },
      { id: "sidi-bouzid-bir-el-hafey", name: { fr: "Bir El Hafey", ar: "بئر الحفي" } },
    ],
  },
  {
    id: "kairouan",
    name: { fr: "Kairouan", ar: "القيروان" },
    latitude: 35.6711,
    longitude: 9.5196,
    delegations: [
      { id: "kairouan-kairouan", name: { fr: "Kairouan", ar: "القيروان" } },
      { id: "kairouan-oueslatia", name: { fr: "Oueslatia", ar: "الوسلاتية" } },
      { id: "kairouan-haffouz", name: { fr: "Haffouz", ar: "الحفوز" } },
      { id: "kairouan-sbikha", name: { fr: "Sbikha", ar: "سبيخة" } },
      { id: "kairouan-chebika", name: { fr: "Chebika", ar: "الشبيكة" } },
    ],
  },
  {
    id: "kef",
    name: { fr: "Kef", ar: "الكاف" },
    latitude: 36.1761,
    longitude: 8.7089,
    delegations: [
      { id: "kef-kef", name: { fr: "Kef", ar: "الكاف" } },
      { id: "kef-tajerouine", name: { fr: "Tajerouine", ar: "تاجروين" } },
      { id: "kef-skhira", name: { fr: "Skhira", ar: "الصخيرة" } },
      { id: "kef-dahmani", name: { fr: "Dahmani", ar: "الدهماني" } },
    ],
  },
  {
    id: "jendouba",
    name: { fr: "Jendouba", ar: "جندوبة" },
    latitude: 36.5019,
    longitude: 8.7747,
    delegations: [
      { id: "jendouba-jendouba", name: { fr: "Jendouba", ar: "جندوبة" } },
      { id: "jendouba-tabarka", name: { fr: "Tabarka", ar: "طبرقة" } },
      { id: "jendouba-ain-draham", name: { fr: "Ain Draham", ar: "عين الدراهم" } },
      { id: "jendouba-bou-arada", name: { fr: "Bou Arada", ar: "بوعراده" } },
    ],
  },
  {
    id: "bizerte",
    name: { fr: "Bizerte", ar: "بنزرت" },
    latitude: 37.2744,
    longitude: 9.8739,
    delegations: [
      { id: "bizerte-bizerte-medina", name: { fr: "Bizerte Médina", ar: "بنزرت المدينة" } },
      { id: "bizerte-bizerte-ville", name: { fr: "Bizerte Ville", ar: "بنزرت الجديدة" } },
      { id: "bizerte-menzel-bourguiba", name: { fr: "Menzel Bourguiba", ar: "منزل بورقيبة" } },
      { id: "bizerte-raf-raf", name: { fr: "Raf Raf", ar: "رأس الرافع" } },
      { id: "bizerte-skhira", name: { fr: "Skhira", ar: "الصخيرة" } },
      { id: "bizerte-ghar-el-melh", name: { fr: "Ghar El Melh", ar: "غار الملح" } },
    ],
  },
  {
    id: "siliana",
    name: { fr: "Siliana", ar: "سليانة" },
    latitude: 36.0869,
    longitude: 9.3706,
    delegations: [
      { id: "siliana-siliana", name: { fr: "Siliana", ar: "سليانة" } },
      { id: "siliana-rouhia", name: { fr: "Rouhia", ar: "روحية" } },
      { id: "siliana-maktar", name: { fr: "Maktar", ar: "مقطر" } },
      { id: "siliana-bargou", name: { fr: "Bargou", ar: "برقو" } },
    ],
  },
];

export const PROBLEM_TYPES = {
  water_cut: { fr: "Coupure d'eau", ar: "انقطاع المياه" },
  low_pressure: { fr: "Pression faible", ar: "ضغط منخفض" },
  contamination: { fr: "Contamination", ar: "تلوث المياه" },
  leak: { fr: "Fuite", ar: "تسرب" },
} as const;

export type ProblemType = keyof typeof PROBLEM_TYPES;

export function getGovernorateById(id: string): Governorate | undefined {
  return TUNISIAN_GOVERNORATES.find((g) => g.id === id);
}

export function getDelegationById(
  governorateId: string,
  delegationId: string
): Delegation | undefined {
  const governorate = getGovernorateById(governorateId);
  return governorate?.delegations.find((d) => d.id === delegationId);
}
