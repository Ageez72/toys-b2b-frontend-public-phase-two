// export const BASE_API = 'https://pick.alekha.com:8443/pick/faces/redirect/b2b';
import Cookies from "js-cookie";
import { babyWorld, actionWorld, buildCreate, puzzleGames, learningScience, artCreativity, guns, goPlay, makeupNails, outdoor, plush, collectibleFigures, dollWorld, robots } from "../constant/images";

// Get current hostname
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Define your mapping
const domainMap = {
  'toys-b2b-frontend-public.vercel.app': 'https://pick.alekha.com:8443/pick/faces/redirect/b2b',
  'toys-b2b-frontend-public-phase-two.vercel.app': 'https://acc.alekha.com:8443/pick/faces/redirect/b2b',
  'toyshop.theprimereach.com': 'https://q.theprimereach.com:8443/pick/faces/redirect/b2b',
  'toyshop.iq.theprimereach.com': 'https://q.theprimereach.com:8443/pick/faces/redirect/b2b',
  'toyshopiq.theprimereach.com': 'https://q.theprimereach.com:8443/pick/faces/redirect/b2b',
  'iq.toyshop.theprimereach.com': 'https://q.theprimereach.com:8443/pick/faces/redirect/b2b',
};

// Determine BASE_API based on hostname
const BASE_API = domainMap[hostname] || 'https://pick.alekha.com:8443/pick/faces/redirect/b2b';

// Determine siteLocation value
let siteLocation = 'default';
if (hostname === 'toyshop.theprimereach.com' || hostname === 'toyshop.iq.theprimereach.com' || hostname === 'toyshopiq.theprimereach.com' || hostname === 'iq.toyshop.theprimereach.com') {
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
    getAges: "?action=get.ages",
    getCatalogs: "?action=get.all.catalogs"
  },

};
