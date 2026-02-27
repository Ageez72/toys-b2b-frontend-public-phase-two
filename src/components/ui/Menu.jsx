"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppContext } from "../../../context/AppContext";
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import SearchInput from "./SearchInput";
import logo from "../../assets/imgs/logo.png";
import { getProfile } from "@/actions/utils";
import { BASE_API, endpoints } from "../../../constant/endpoints";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";

export default function Menu({ scroll, resetSignal }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [siteLocation, setSiteLocation] = useState(null);
  const pathname = usePathname();
  const profileData = getProfile()

  useEffect(() => {
    setSiteLocation(Cookies.get("siteLocation"));
  }, []);

  const [cookiesState, setCookiesState] = useState({
    newArrivals: false,
    clearance: false,
    commingSoon: false,
    giveaway: false,
  });

  const [translation, setTranslation] = useState(ar);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isOpenCategoriesDropdown, setIsOpenCategoriesDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("categories-dropdown-details-item-0");
  const [catalogsList, setCatalogsList] = useState([]);
  const searchParams = useSearchParams();
  const activeCatalog = searchParams.get("catalog");

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


  const closeAllPopups = () => {
    setIsOpenSearch(false);
    setIsOpenCategoriesDropdown(false);
  };
  useEffect(() => {
    closeAllPopups();
  }, [pathname]);

  useEffect(() => {
    setIsOpenSearch(false);
    setIsOpenCategoriesDropdown(false);
  }, [resetSignal]);

  useEffect(() => {
    if (!pathname) return;

    catalogsList.forEach((category, index) => {
      const match = category.catalog_links?.some(linkItem =>
        pathname.startsWith(linkItem.id)
      );

      if (match) {
        setActiveCategory(`categories-dropdown-details-item-${index}`);
      }
    });
  }, [pathname]);
  return (
    <>
      <ul className="menu-list font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-white dark:border-gray-700">
        <>
          <li className={isActive("/home")}>
            <Link href="/home" className="block py-2 px-3" onClick={closeAllPopups}>{translation.home}</Link>
          </li>

          <li className="allProductsTab">
            <Link href="/products?itemStatus=AVAILABLE" className="block py-2 px-3" onClick={() => {
              Cookies.remove('filterstatus')
              sessionStorage.removeItem('scrollToProduct');
              closeAllPopups();
            }}>
              {translation.allProducts}
            </Link>
          </li>
          <li className={isActive("/brands")}>
            <Link href="/brands" className="block py-2 px-3" onClick={closeAllPopups}>{translation.brands}</Link>
          </li>
          {
            siteLocation !== "primereach" &&
            <li className="clearanceTab">
              <Link href="/products?age=ALL&itemType=CLEARANCE&itemStatus=AVAILABLE&pageSize=12" className="block py-2 px-3" onClick={() => {
                Cookies.remove('filterstatus')
                closeAllPopups()
                sessionStorage.removeItem('scrollToProduct');
              }}>
                {translation.clearance}
              </Link>
            </li>
          }
          {
            // state.isCorporate || profileData.hideTargetSOA ? (
            <li className="flex items-center gap-4">
              <div className="divider"></div>
              <a href="javascript:void(0)" className="cursor-pointer flex items-center gap-1" onClick={() => {
                setIsOpenCategoriesDropdown(!isOpenCategoriesDropdown)
                setIsOpenSearch(false)
              }}>
                {translation.sections}
                <i className="icon-arrow-down-01-round"></i>
              </a>
            </li>
            // ) : null
          }
          <li className="flex items-center gap-4">
            <div className="divider"></div>
            <div className="circle-icon-container">
              <i className="icon-search-normal py-2 px-3 cursor-pointer" onClick={() => {
                setIsOpenSearch(!isOpenSearch)
                setIsOpenCategoriesDropdown(false)
              }}></i>
            </div>
          </li>
        </>
      </ul>
      <div className="isDesktop">
        <div className={`general-search-overlay ${isOpenSearch ? 'open' : ''}`} onClick={() => setIsOpenSearch(false)}></div>
        {isOpenSearch && (
          <div className={`general-search sm-search-popup open`}>
            <div className="">
              <div className="flex justify-evenly mx-3">
                <div className="relative w-full search-me">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <i className="icon-search-normal"></i>
                  </div>

                  <SearchInput bulk={false} closeSearchPopup={() => setIsOpenSearch(false)} />
                </div>
                {/* <div className="flex items-center justify-center">
                  <i
                    className="icon-multiplication-sign cursor-pointer"
                    onClick={() => setIsOpenSearch(false)}
                  />
                </div> */}
              </div>
            </div>
          </div>
        )}
        <div className={`general-search-overlay ${isOpenCategoriesDropdown ? 'open' : ''}`} onClick={() => setIsOpenCategoriesDropdown(false)}></div>
        {/* {isOpenCategoriesDropdown && ( */}
        <div className={`general-search categories-dropdown-popup ${isOpenCategoriesDropdown ? 'open' : ''}`}>
          {/* <h2 className="sub-title mt-3 mb-6">{translation.categoryDropdown.exploreOurCategories}</h2> */}
          <div className="flex">
            <div className="relative categories-dropdown-links">
              <ul>
                {
                  catalogsList.map((category, index) => (
                    <li
                      key={index}
                      className={`dropdown-item ${activeCategory === `categories-dropdown-details-item-${index}` ? "active" : ""
                        }`}
                      onMouseEnter={() =>
                        setActiveCategory(`categories-dropdown-details-item-${index}`)
                      }
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
                              <Link href={`/products?age=ALL&itemStatus=AVAILABLE&pageSize=12&catalog=${linkItem.id}`} onClick={() => setIsOpenCategoriesDropdown(false)}>
                                {linkItem.name}
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
                onClick={() => setIsOpenCategoriesDropdown(false)}
              />
            </div>
          </div>
        </div>
        {/* // )} */}

      </div >
    </>
  );
}
