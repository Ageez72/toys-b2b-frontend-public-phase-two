"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_API, endpoints } from "../constant/endpoints";

let initialLang = Cookies?.get("lang") || "AR";

const initialState = {
  BASEURL: "https://pick.alekha.com:8443/pick/faces/redirect/b2b?",
  LANG: initialLang,
  STOREDITEMS: [],
  isCorporate: false,
  isActive: false,
  corporateName: "",
  corporateImage: "/imgs/corporate-default.png",
  DIRECTION: initialLang === "EN" ? "ltr" : "rtl",
  NumberOfParams: 0,
  corporatePayment: "",
  has_items_CLEARANCE: false,
  has_items_COMMING_SOON: false,
  has_items_GIVEAWAY: false,
  has_items_NEW_ARRIVAL: false,
  has_items_y: false,
  has_items_FEATURED: false,
  catalogsList: [],
};

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case "LANG":
      return { ...state, LANG: action.payload };

    case "STORED-ITEMS":
      return { ...state, STOREDITEMS: action.payload };

    case "ADD-ITEM":
      const updatedItemsAdd = [...state.STOREDITEMS, action.payload];
      Cookies.set("cart", JSON.stringify(updatedItemsAdd));
      return { ...state, STOREDITEMS: updatedItemsAdd };

    case "REMOVE-ITEM":
      const updatedItemsRemove = state.STOREDITEMS.filter(
        (item) => item.id !== action.payload
      );
      Cookies.set("cart", JSON.stringify(updatedItemsRemove));
      return { ...state, STOREDITEMS: updatedItemsRemove };

    case "CLEAR-CART":
      Cookies.remove("cart");
      return { ...state, STOREDITEMS: [] };

    case "IS-CORPORATE":
      return { ...state, isCorporate: action.payload };

    case "IS-ACTIVE":
      return { ...state, isActive: action.payload };

    case "CORPORATE-NAME":
      return { ...state, corporateName: action.payload };

    case "CORPORATE-IMAGE":
      return { ...state, corporateImage: action.payload };

    case "CORPORATE-PAYMENT":
      return { ...state, corporatePayment: action.payload };

    case "NUMBERS-OF-PARAMS":
      return { ...state, NumberOfParams: action.payload };

    case "has_items_CLEARANCE":
      return { ...state, has_items_CLEARANCE: action.payload };

    case "has_items_COMMING_SOON":
      return { ...state, has_items_COMMING_SOON: action.payload };

    case "has_items_GIVEAWAY":
      return { ...state, has_items_GIVEAWAY: action.payload };

    case "has_items_NEW_ARRIVAL":
      return { ...state, has_items_NEW_ARRIVAL: action.payload };

    case "has_items_y":
      return { ...state, has_items_y: action.payload };

    case "has_items_FEATURED":
      return { ...state, has_items_FEATURED: action.payload };

    case "SET_CATALOGS_LIST":
      return { ...state, catalogsList: action.payload };

    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // keep lang cookie in sync
  useEffect(() => {
    Cookies.set("lang", state.LANG);
  }, [state.LANG]);

  // load cart from cookies on mount
  useEffect(() => {
    const storedCart = Cookies.get("cart");
    if (storedCart) {
      dispatch({ type: "STORED-ITEMS", payload: JSON.parse(storedCart) });
    }
  }, []);

  // fetch catalogs once and share via context
  useEffect(() => {
    const CATALOGS_CACHE_KEY = "catalogsList";
    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

    const fetchCatalogs = async () => {
      try {
        const raw = localStorage.getItem(CATALOGS_CACHE_KEY);

        if (raw) {
          try {
            const parsed = JSON.parse(raw);

            // Support old format (pure array without metadata)
            if (Array.isArray(parsed)) {
              dispatch({
                type: "SET_CATALOGS_LIST",
                payload: parsed,
              });
            } else if (parsed?.data && parsed?.timestamp && parsed?.lang) {
              const isFresh = Date.now() - parsed.timestamp < TWO_DAYS_MS;
              const sameLang = parsed.lang === state.LANG;

              if (isFresh && sameLang) {
                dispatch({
                  type: "SET_CATALOGS_LIST",
                  payload: parsed.data,
                });
                return; // cache is valid, no need to hit API
              }
            }
          } catch {
            // if parsing fails, ignore and refetch from API
          }
        }

        // Either no cache, expired cache, different lang, or invalid format → fetch from API
        const response = await axios.get(
          `${BASE_API}${endpoints.products.getCatalogs}&lang=${state.LANG}&token=${Cookies.get("token")}`
        );
        if (response.data) {
          const toStore = {
            data: response.data,
            lang: state.LANG,
            timestamp: Date.now(),
          };
          localStorage.setItem(CATALOGS_CACHE_KEY, JSON.stringify(toStore));
          dispatch({
            type: "SET_CATALOGS_LIST",
            payload: response.data,
          });
        }
      } catch (error) {
        console.error("Error fetching catalogs:", error);
      }
    };

    fetchCatalogs();
  }, [state.LANG]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
