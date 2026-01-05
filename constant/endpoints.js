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
  // { id: 3, name: translation.categoryDropdown.buildAndCreate },
  // { id: 4, name: translation.categoryDropdown.puzzleAndGames },
  // { id: 5, name: translation.categoryDropdown.learningAndScience },
  // { id: 6, name: translation.categoryDropdown.artAndCreativity },
  // { id: 7, name: translation.categoryDropdown.guns },
  // { id: 8, name: translation.categoryDropdown.goAndPlay },
  // { id: 9, name: translation.categoryDropdown.makeupAndNails },
  // { id: 10, name: translation.categoryDropdown.outdoor },
  // { id: 11, name: translation.categoryDropdown.plush },
  // { id: 12, name: translation.categoryDropdown.collectibleAndFigures },
  // { id: 13, name: translation.categoryDropdown.dollWorld },
  // { id: 14, name: translation.categoryDropdown.robots },
];

