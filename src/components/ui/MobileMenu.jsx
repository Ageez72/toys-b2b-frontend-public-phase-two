"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import MenuControl from "./MenuControl";
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import logo from "../../assets/imgs/logo.png";
import { getProfile } from "@/actions/utils";
import { BASE_API, endpoints } from "../../../constant/endpoints";
import axios from "axios";

export default function MobileMenu({ scroll, onGoTo }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [lang, setLang] = useState("AR"); // fallback
  const siteLocation = Cookies.get("siteLocation")
  const profileData = getProfile()
  const [cookiesState, setCookiesState] = useState({
    newArrivals: false,
    clearance: false,
    commingSoon: false,
    giveaway: false,
  });
  const [translation, setTranslation] = useState(ar);
  const [isOpenCategoriesDropdown, setIsOpenCategoriesDropdown] = useState(false);
  const [isOpenActiveCategory, setIsOpenActiveCategory] = useState(false);
  const [activeCategory, setActiveCategory] = useState("categories-dropdown-details-item-0");
  const [catalogsList, setCatalogsList] = useState([]);
  const searchParams = useSearchParams();
  const activeCatalog = searchParams.get("catalog");

  const pathname = usePathname();
  const isActive = (path) => pathname === path ? "active" : "";

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
  }, [state.LANG]);;

  // fetch catalogs to get the names of categories and the links
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get(`${BASE_API}${endpoints.products.getCatalogs}&lang=${state.LANG}&token=${Cookies.get('token')}`);
        if (response.data) {
          setCatalogsList(response.data);
        }
      } catch (error) {
        console.error("Error fetching catalogs:", error);
      }
    };

    fetchCatalogs();
  }, [state.LANG]);
  return (
    <>
      <div className="mobile-menu fix mb-3 mean-container">
        <div className="mean-bar">
          <Link
            href="/#nav"
            className="meanmenu-reveal"
            style={{ right: 0, left: "auto", display: "inline" }}
          >
            <span><span><span /></span></span>
          </Link>
          <ul className="mobile-menu-links">
            <li className={isActive("/home")} onClick={() => onGoTo()}>
              <Link href="/home">{translation.home}</Link>
            </li>
            <li className="allProductsTab" onClick={() => {
              sessionStorage.removeItem('scrollToProduct')
              Cookies.remove('filterstatus')
              onGoTo()
            }}>
              <Link href="/products?itemStatus=AVAILABLE">{translation.allProducts}</Link>
            </li>
            <li className={isActive("/brands")} onClick={() => onGoTo()}>
              <Link href="/brands">{translation.brands}</Link>
            </li>
            {
              siteLocation !== "primereach" &&
              <li className="clearanceTab" onClick={() => {
                sessionStorage.removeItem('scrollToProduct')
                Cookies.remove('filterstatus')
                onGoTo()
              }}>
                <Link href="/products?itemType=CLEARANCE&itemStatus=AVAILABLE">{translation.clearance}</Link>
              </li>
            }
            {
              // state.isCorporate || profileData.hideTargetSOA ? (
              <li className="sections-link" onClick={() => setIsOpenCategoriesDropdown(!isOpenCategoriesDropdown)}>
                <a href="javascript:void(0)" className="cursor-pointer flex items-center gap-1">
                  {translation.sections}
                  <i className="icon-arrow-down-01-round"></i>
                </a>
              </li>
              // ) : null
            }
          </ul>
          {/* <hr /> */}
          {/* <MenuControl onGoTo={onGoTo} /> */}
        </div>
      </div>
      {/* {isOpenCategoriesDropdown && ( */}
      <div className={`general-search categories-dropdown-popup ${isOpenCategoriesDropdown ? "open" : ""}`}>
        <div className="flex">
          <div className="relative categories-dropdown-links">
            <ul>
              {
                catalogsList.map((category, index) => (
                  <li
                    key={index}
                    className={`dropdown-item ${activeCategory === `categories-dropdown-details-item-${index}` ? "active" : ""
                      }`}
                    onClick={() => {
                      setIsOpenActiveCategory(true)
                      setActiveCategory(`categories-dropdown-details-item-${index}`)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img src={category.catalog_image} alt="image" />
                      <span>{category.catalog_title}</span>
                    </div>
                    <i className="icon-arrow-left-01-round px-3"></i>
                  </li>
                ))
              }
            </ul>
          </div>

          <div className="close-categories-dropdown flex items-center justify-center">
            <i
              className="icon-multiplication-sign cursor-pointer"
              onClick={() => setIsOpenCategoriesDropdown(false)}
            />
          </div>
        </div>
      </div>
      {/* // )} */}
      {/* {isOpenActiveCategory && ( */}
      <div className={`general-search categories-dropdown-popup ${isOpenActiveCategory ? "open" : ""}`}>
        <div className="flex">
          <div className="categories-dropdown-details">
            {
              catalogsList.map((category, index) => (
                <div
                  key={index}
                  className={`relative categories-dropdown-details-item ${activeCategory === `categories-dropdown-details-item-${index}` ? "active" : ""
                    }`}
                  id={`categories-dropdown-details-item-${index}`}
                >
                  <ul>
                    {
                      category.catalog_links && category.catalog_links.length > 0 ? (
                        category.catalog_links.map((linkItem, linkIndex) => (
                          <li className={`dropdown-item ${activeCatalog === linkItem.id ? "active" : ""
                            }`} key={linkIndex}>
                            <Link href={`/products?age=ALL&itemStatus=AVAILABLE&pageSize=12&catalog=${linkItem.id}`} onClick={() => {
                              setIsOpenCategoriesDropdown(false)
                              setIsOpenActiveCategory(false)
                              onGoTo()
                            }}>
                              {linkItem.name}
                              <i className="icon-arrow-left-01-round"></i>
                            </Link>
                          </li>
                        ))
                      ) : null
                    }
                  </ul>
                </div>
              ))
            }
          </div>

          <div className="close-categories-dropdown flex items-center justify-center">
            <i
              className="icon-multiplication-sign cursor-pointer"
              onClick={() => setIsOpenActiveCategory(false)}
            />
          </div>
        </div>
      </div>
      {/* // )} */}
    </>
  );
}