"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import SearchInput from "./SearchInput";

export default function Menu({ scroll }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const pathname = usePathname();

  const [cookiesState, setCookiesState] = useState({
    newArrivals: false,
    clearance: false,
    commingSoon: false,
    giveaway: false,
  });

  const [translation, setTranslation] = useState(ar);
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);

    const checkCookies = () => {
      setCookiesState({
        newArrivals: Cookies.get("has_items_NEW_ARRIVAL") === "true",
        clearance: Cookies.get("has_items_CLEARANCE") === "true",
        commingSoon: Cookies.get("has_items_COMING_SOON") === "true",
        giveaway: Cookies.get("has_items_GIVEAWAY") === "true",
      });
    };

    checkCookies();

    const interval = setInterval(checkCookies, 1000); // Check every second
    const timeout = setTimeout(() => clearInterval(interval), 5000); // Stop after 5 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state.LANG]);

  const isActive = (path) => pathname === path ? "active" : "";

  return (
    <>
      <ul className="menu-list font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-white dark:border-gray-700">
        <>
          <li className={isActive("/home")}>
            <Link href="/home" className="block py-2 px-3">{translation.home}</Link>
          </li>

          <li className="allProductsTab">
            <Link href="/products?itemStatus=AVAILABLE" className="block py-2 px-3" onClick={() => sessionStorage.removeItem('scrollToProduct')}>
              {translation.allProducts}
            </Link>
          </li>

          <li className={isActive("/brands")}>
            <Link href="/brands" className="block py-2 px-3">{translation.brands}</Link>
          </li>

          <li className="clearanceTab">
            <Link href="/products?itemType=CLEARANCE&itemStatus=AVAILABLE" className="block py-2 px-3">
              {translation.clearance}
            </Link>
          </li>
          <li>
            <i className="icon-search-normal py-2 px-3 cursor-pointer" onClick={() => setIsOpenSearch(!isOpenSearch)}></i>
          </li>
        </>
      </ul>
      <div className="isDesktop">
        <div className={`general-search-overlay ${isOpenSearch ? 'open' : ''}`} onClick={() => setIsOpenSearch(false)}></div>
        {isOpenSearch && (
          <div className={`general-search open`}>
            <div className="container">
              <div className="flex justify-center">
                <div className="relative w-3/4">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <i className="icon-search-normal"></i>
                  </div>

                  <SearchInput bulk={false} />
                </div>

                <div className="w-1/4 text-center">
                  <i
                    className="icon-multiplication-sign cursor-pointer"
                    onClick={() => setIsOpenSearch(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
