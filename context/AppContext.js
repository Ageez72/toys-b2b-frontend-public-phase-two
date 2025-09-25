"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";

let initialLang = Cookies?.get("lang") || "AR";

const initialState = {
  BASEURL: "https://pick.alekha.com:8443/pick/faces/redirect/b2b?",
  LANG: initialLang,
  STOREDITEMS: [],
  isCorporate: false,
  isActive: false,
  corporateImage: "/imgs/corporate-default.png",
  DIRECTION: initialLang === "EN" ? "ltr" : "rtl",
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

    case "CORPORATE-IMAGE":
      return { ...state, corporateImage: action.payload };

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
