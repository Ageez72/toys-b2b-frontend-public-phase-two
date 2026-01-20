"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import SearchInput from "./SearchInput";
import logo from "../../assets/imgs/logo.png";
import { getProfile } from "@/actions/utils";
import { staticCategoriesDropdown } from "../../../constant/endpoints";
import { babyWorld, actionWorld, buildCreate, puzzleGames, learningScience, artCreativity, guns, goPlay, makeupNails, outdoor, plush, collectibleFigures, dollWorld, robots } from "../../../constant/images";

export default function Menu({ scroll }) {
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

  const staticCategoriesCatalogs = [
    { id: 1, name: translation.categoryDropdown.babyWorld },
    { id: 2, name: translation.categoryDropdown.actionWorld },
    { id: 3, name: translation.categoryDropdown.buildAndCreate },
    { id: 4, name: translation.categoryDropdown.puzzleAndGames },
    { id: 5, name: translation.categoryDropdown.learningAndScience },
    { id: 6, name: translation.categoryDropdown.artAndCreativity },
    { id: 7, name: translation.categoryDropdown.guns },
    { id: 8, name: translation.categoryDropdown.goAndPlay },
    { id: 9, name: translation.categoryDropdown.makeupAndNails },
    { id: 10, name: translation.categoryDropdown.outdoor },
    { id: 11, name: translation.categoryDropdown.plush },
    { id: 12, name: translation.categoryDropdown.collectibleAndFigures },
    { id: 13, name: translation.categoryDropdown.dollWorld },
    { id: 14, name: translation.categoryDropdown.robots },
  ];

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

  const catalogImages = [babyWorld, actionWorld, buildCreate, puzzleGames, learningScience, artCreativity, guns, goPlay, makeupNails, outdoor, plush, collectibleFigures, dollWorld, robots]

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
          {
            siteLocation !== "primereach" &&
            <li className="clearanceTab">
              <Link href="/products?itemType=CLEARANCE&itemStatus=AVAILABLE" className="block py-2 px-3">
                {translation.clearance}
              </Link>
            </li>
          }
          {
            state.isCorporate || profileData.hideTargetSOA ? (
              <li className="flex items-center gap-3">
                <div className="divider"></div>
                <a href="javascript:void(0)" className="cursor-pointer flex items-center gap-1" onClick={() => setIsOpenCategoriesDropdown(!isOpenCategoriesDropdown)}>
                  {translation.ourSections}
                  <i className="icon-arrow-down-01-round"></i>
                </a>
              </li>
            ) : null
          }
          {/* <li>
            <i className="icon-search-normal py-2 px-3 cursor-pointer" onClick={() => setIsOpenSearch(!isOpenSearch)}></i>
          </li> */}
        </>
      </ul>
      <div className="isDesktop">
        <div className={`general-search-overlay ${isOpenSearch ? 'open' : ''}`} onClick={() => setIsOpenSearch(false)}></div>
        {isOpenSearch && (
          <div className={`general-search open`}>
            <div className="">
              <div className="flex justify-center">
                <div className="relative w-3/4 search-me">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <i className="icon-search-normal"></i>
                  </div>

                  <SearchInput bulk={false} />
                </div>

                <div className="w-1/4 flex items-center justify-center">
                  <i
                    className="icon-multiplication-sign cursor-pointer"
                    onClick={() => setIsOpenSearch(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`general-search-overlay ${isOpenCategoriesDropdown ? 'open' : ''}`} onClick={() => setIsOpenCategoriesDropdown(false)}></div>
        {isOpenCategoriesDropdown && (
          <div className={`general-search categories-dropdown-popup open`}>
            {/* <h2 className="sub-title mt-3 mb-6">{translation.categoryDropdown.exploreOurCategories}</h2> */}
            <div className="flex">
              <div className="relative categories-dropdown-links">
                <ul>
                  {
                    staticCategoriesCatalogs.map((category, index) => (
                      <li
                        key={category.id}
                        className="dropdown-item"
                        onMouseEnter={() =>
                          setActiveCategory(`categories-dropdown-details-item-${index}`)
                        }
                      >
                        <div className="flex items-center gap-2">
                          <img src={catalogImages[index]?.src || babyWorld.src} alt="image" />
                          <span>{category.name}</span>
                        </div>
                        <i className="icon-arrow-left-01-round px-3"></i>
                      </li>
                    ))
                  }
                </ul>
              </div>

              <div className="categories-dropdown-details">
                {
                  staticCategoriesDropdown.map((category, index) => (
                    <div
                      key={index}
                      className={`relative categories-dropdown-details-item ${activeCategory === `categories-dropdown-details-item-${index}` ? "active" : ""
                        }`}
                      id={`categories-dropdown-details-item-${index}`}
                    >
                      <ul>
                        {
                          category.links && category.links.length > 0 ? (
                            category.links.map((linkItem, linkIndex) => (
                              <li className="dropdown-item" key={linkIndex}>
                                <Link href={linkItem.link} onClick={() => setIsOpenCategoriesDropdown(false)}>
                                  {state.LANG === "EN" ? linkItem.name_en : linkItem.name_ar}
                                  {/* <i className="icon-arrow-left-01-round"></i> */}
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
        )}

      </div >
    </>
  );
}
