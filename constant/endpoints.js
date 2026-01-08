// export const BASE_API = 'https://pick.alekha.com:8443/pick/faces/redirect/b2b';
import Cookies from "js-cookie";

// Get current hostname
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Define your mapping
const domainMap = {
  'toys-b2b-frontend-public.vercel.app': 'https://pick.alekha.com:8443/pick/faces/redirect/b2b',
  'toys-b2b-frontend-public-phase-two.vercel.app': 'https://acc.alekha.com:8443/pick/faces/redirect/b2b',
  'toyshop.theprimereach.com': 'https://q.theprimereach.com:8443/pick/faces/redirect/b2b',
  'toyshop.iq.theprimereach.com': 'https://q.theprimereach.com:8443/pick/faces/redirect/b2b',
  'toyshopiq.theprimereach.com': 'https://q.theprimereach.com:8443/pick/faces/redirect/b2b',
};

// Determine BASE_API based on hostname
const BASE_API = domainMap[hostname] || 'https://pick.alekha.com:8443/pick/faces/redirect/b2b';

// Determine siteLocation value
let siteLocation = 'default';
if (hostname === 'toyshop.theprimereach.com' || hostname === 'toyshop.iq.theprimereach.com' || hostname === 'toyshopiq.theprimereach.com') {
  siteLocation = 'primereach';
}

// Set cookie (expires in 7 days)
Cookies.set('siteLocation', siteLocation, { expires: 7, path: '/' });

export { BASE_API };

export const endpoints = {
  auth: {
    login: "?action=GETTOKEN",
    register: "?action=REGISTER",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    updateProfile: "?action=UPDATE.PROFILE",
    forgotPassword: "?action=forgot.pwd",
    resetPassword: "?action=reset.pwd",
  },
  user: {
    profile: "?action=USERINFO",
  },
  home: {
    brandsSwiper: "?action=GET.BRANDS"
  },
  products: {
    list: "?action=GET.ITEMS",
    categoriesList: "?action=GET.CATEGORIES",
    catalogList: "?action=CATALOGS",
    brandsFilters: "?action=GET.BRANDS&grouped=1",
    review: "?action=ADD.REVIEW",
    checkout: "?action=CHECKOUT",
    order: "?action=ADDORDER",
    myorders: "?action=MYORDERS",
    removeReview: "?action=DELETE.REVIEW",
    homeImages: "?action=home.images",
    getCart: "?action=get.cart",
    setCart: "?action=set.cart&cart=json",
    requestOutOfStock: "?action=request.outofstock",
    getStatement: "?action=get.statement",
    getTarget: "?action=get.target&type=html&month=1",
  },

};

export const staticCategoriesDropdown = [
  {
    links: [
      { name_en: "Baby Gear", name_ar: "مستلزمات بيبي", link: '/products?itemStatus=AVAILABLE&catalog=BABY_GEAR' },
      { name_en: "Baby Playset", name_ar: "مجموعة ألعاب بيبي", link: '/products?itemStatus=AVAILABLE&catalog=BABY_PLAYSET' },
      { name_en: "Baby Toys", name_ar: "ألعاب بيبي", link: '/products?itemStatus=AVAILABLE&catalog=BABY_TOYS' },
      { name_en: "Baby Learning Toys", name_ar: "ألعاب بيبي تعليمية", link: '/products?itemStatus=AVAILABLE&catalog=BABY_LEARNING_TOYS' },
      { name_en: "Remote Control for Baby", name_ar: "تحكم عن بعد للصغار", link: '/products?itemStatus=AVAILABLE&catalog=BABY_RC' },
      { name_en: "Music", name_ar: "ألعاب موسيقية", link: '/products?itemStatus=AVAILABLE&catalog=MUSIC' },
    ]
  },
  {
    links: [
      { name_en: "Boys Surprise", name_ar: "مفاجآت للأولاد", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys Playsets", name_ar: "مجموعات ألعاب للأولاد", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_PLAYSETS' },
      { name_en: "RC", name_ar: "تحكم عن بعد", link: '/products?itemStatus=AVAILABLE&catalog=RC' },
      { name_en: "TV & Movies Action Figures", name_ar: "شخصيات أكشن أفلام وتلفاز", link: '/products?itemStatus=AVAILABLE&catalog=TV_&_MOVIES_ACTION_FIGURES' },
    ]
  },
  {
    links: [
      { name_en: "Mechanic", name_ar: "العاب ميكانيكية", link: '/products?itemStatus=AVAILABLE&catalog=MECHANICS' },
      { name_en: "Blocks", name_ar: "ليغو وتركيب", link: '/products?itemStatus=AVAILABLE&catalog=BLOCKS' },
      { name_en: "Construction Playsets", name_ar: "مجموعات بناء وتركيب", link: '/products?itemStatus=AVAILABLE&catalog=CONSTRUCTION_PLAYSETS' },
    ]
  },
  {
    links: [
      { name_en: "Kids Puzzle", name_ar: "بازل للأطفال", link: '/products?itemStatus=AVAILABLE&catalog=KIDS_PUZZLE' },
      { name_en: "Board Games", name_ar: "بورد جيمز", link: '/products?itemStatus=AVAILABLE&catalog=BOARD_GAMES_ZING' },
      { name_en: "Junior Games", name_ar: "ألعاب للمبتدئين", link: '/products?itemStatus=AVAILABLE&catalog=JUNIOR_GAMES' },
      { name_en: "Family Games", name_ar: "ألعاب عائلية", link: '/products?itemStatus=AVAILABLE&catalog=FAMILY_GAMES' },
      { name_en: "Adult Games", name_ar: "ألعاب للكبار", link: '/products?itemStatus=AVAILABLE&catalog=ADULT_GAMES' },
      { name_en: "Digital", name_ar: "ألعاب الكترونية", link: '/products?itemStatus=AVAILABLE&catalog=DIGITAL' },

    ]
  },
  {
    links: [
      { name_en: "Educational Toys", name_ar: "ألعاب تعليمية", link: '/products?itemStatus=AVAILABLE&catalog=EDUCATIONAL_TOYS' },
      { name_en: "Thinking", name_ar: "ألعاب تفكير", link: '/products?itemStatus=AVAILABLE&catalog=THINKING' },
      { name_en: "Sciences Kit", name_ar: "مجموعة علمية", link: '/products?itemStatus=AVAILABLE&catalog=SCIENCES_KIT' },
      { name_en: "Learning Toys", name_ar: "ألعاب علمية", link: '/products?itemStatus=AVAILABLE&catalog=LEARNING' },
      { name_en: "Pretend Play", name_ar: "لعب الأدوار", link: '/products?itemStatus=AVAILABLE&catalog=PRETEND_PLAY' },
      { name_en: "Robots", name_ar: "روبوتات", link: '/products?itemStatus=AVAILABLE&catalog=ROBOTS' },
      { name_en: "Magnet Activities", name_ar: "أنشطة مغناطيسية", link: '/products?itemStatus=AVAILABLE&catalog=MAGNET_ACTIVITIES' },

    ]
  },
  {
    links: [
      { name_en: "Water Coloring & Painting", name_ar: "رسم وألوان مائية", link: '/products?itemStatus=AVAILABLE&catalog=WATER_COLORING_&_PAINTING' },
      { name_en: "Stickers", name_ar: "ملصقات", link: '/products?itemStatus=AVAILABLE&catalog=STICKERS' },
      { name_en: "Art & Crafts", name_ar: "فنون وحرف يدوية", link: '/products?itemStatus=AVAILABLE&catalog=ART_&_CRAFTS' },
      { name_en: "Dough & Sand Art", name_ar: "معجون ورمال فنية", link: '/products?itemStatus=AVAILABLE&catalog=DOUGH_&_SAND_ART' },
      { name_en: "Putty", name_ar: "معجون", link: '/products?itemStatus=AVAILABLE&catalog=PUTTY' },
      { name_en: "Slime", name_ar: "سلايم", link: '/products?itemStatus=AVAILABLE&catalog=SLIME' },
    ]
  },
  {
    links: [
      { name_en: "Guns", name_ar: "مسدسات", link: '/products?itemStatus=AVAILABLE&catalog=GUNS' },
      { name_en: "Water Guns", name_ar: "رشاشات مائية", link: '/products?itemStatus=AVAILABLE&catalog=WATER_GUNS' },
    ]
  },
  {
    links: [
      { name_en: "Ride On", name_ar: "مركبات", link: '/products?itemStatus=AVAILABLE&catalog=RIDE_ON' },
      { name_en: "Scooters", name_ar: "سكوترات", link: '/products?itemStatus=AVAILABLE&catalog=SCOOTERS' },
      { name_en: "Bikes", name_ar: "دراجات", link: '/products?itemStatus=AVAILABLE&catalog=BIKES' },
      { name_en: "Skate Shoes", name_ar: "أحذية تزلج", link: '/products?itemStatus=AVAILABLE&catalog=SKATE_SHOES' },
      { name_en: "Battery Operated Cars and Ride-On", name_ar: "سيارات وألعاب ركوب تعمل بالبطارية", link: '/products?itemStatus=AVAILABLE&catalog=BATTERY_OPERATED_CARS' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
    ]
  },
  {
    links: [
      { name_en: "Girls Surprise", name_ar: "مفاجآت للبنات", link: '/products?itemStatus=AVAILABLE&catalog=GIRLS_SURPRISE' },
      { name_en: "Beauty & Accessories", name_ar: "الجمال ومستلزماته", link: '/products?itemStatus=AVAILABLE&catalog=BEAUTY_&_ACCESSORIES' },
      { name_en: "Slippers", name_ar: "شباشب", link: '/products?itemStatus=AVAILABLE&catalog=SLIPPERS' },
      { name_en: "Makeup & Nail", name_ar: "مكياج وأظافر", link: '/products?itemStatus=AVAILABLE&catalog=MAKEUP_&_NAIL' },
      { name_en: "Fashion", name_ar: "أزياء", link: '/products?itemStatus=AVAILABLE&catalog=FASHION' },
    ]
  },
  {
    links: [
      { name_en: "Sport & Leisure", name_ar: "رياضة وترفيه", link: '/products?itemStatus=AVAILABLE&catalog=SPORT_&_LEISURE' },
      { name_en: "Water Toys", name_ar: "ألعاب مائية", link: '/products?itemStatus=AVAILABLE&catalog=WATER_TOYS' },
      { name_en: "Play House", name_ar: "ألعاب منزلية", link: '/products?itemStatus=AVAILABLE&catalog=PLAY_HOUSE' },
      { name_en: "Outdoor", name_ar: "ألعاب خارجية", link: '/products?itemStatus=AVAILABLE&catalog=OUTDOOR' },
    ]
  },
  {
    links: [
      { name_en: "Animals Plush", name_ar: "حيوانات محشوة", link: '/products?itemStatus=AVAILABLE&catalog=ANIMALS_PLUSH' },
      { name_en: "Purses & Bags", name_ar: "حقائب ومحافظ", link: '/products?itemStatus=AVAILABLE&catalog=PURSE_&_BAGS' },
      { name_en: "Soft Plush", name_ar: "دمى ناعمة", link: '/products?itemStatus=AVAILABLE&catalog=SOFT_PLUSH' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
    ]
  },
  {
    links: [
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
    ]
  },
  {
    links: [
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
      { name_en: "Boys", name_ar: "مفاجآت", link: '/products?itemStatus=AVAILABLE&catalog=BOYS_SURPRISE' },
    ]
  },
  {
    links: [
      { name_en: "Robots", name_ar: "روبوتات", link: '/products?itemStatus=AVAILABLE&catalog=ROBOTS' },]
  },
];

