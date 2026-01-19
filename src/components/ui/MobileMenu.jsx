"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { useAppContext } from "../../../context/AppContext";
import MenuControl from "./MenuControl";
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import logo from "../../assets/imgs/logo.png";
import { getProfile } from "@/actions/utils";
import { staticCategoriesDropdown } from "../../../constant/endpoints";
import { babyWorld, actionWorld, buildCreate, puzzleGames, learningScience, artCreativity, guns, goPlay, makeupNails, outdoor, plush, collectibleFigures, dollWorld, robots } from "../../../constant/images";

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
  const pathname = usePathname();
  const isActive = (path) => pathname === path ? "active" : "";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  }, [state.LANG]);;

  const catalogImages = [babyWorld, actionWorld, buildCreate, puzzleGames, learningScience, artCreativity, guns, goPlay, makeupNails, outdoor, plush, collectibleFigures, dollWorld, robots]

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
              onGoTo()
            }}>
              <Link href="/products?itemStatus=AVAILABLE">{translation.allProducts}</Link>
            </li>
            {
              state.isCorporate ? (
                <li onClick={() => setIsOpenCategoriesDropdown(!isOpenCategoriesDropdown)}>
                  <a href="javascript:void(0)" className="cursor-pointer flex items-center gap-1">
                    {translation.categories}
                    <i className="icon-arrow-down-01-round"></i>
                  </a>
                </li>
              ) : null
            }
            <li className={isActive("/brands")} onClick={() => onGoTo()}>
              <Link href="/brands">{translation.brands}</Link>
            </li>
            {
              siteLocation !== "primereach" &&
              <li className="clearanceTab" onClick={() => onGoTo()}>
                <Link href="/products?itemType=CLEARANCE&itemStatus=AVAILABLE">{translation.clearance}</Link>
              </li>
            }
            {isClient && (profileData?.isCorporate || profileData?.hideTargetSOA) && (
              <li className={isActive("/terms-and-conditions")} onClick={() => onGoTo()}>
                <Link href="/terms-and-conditions">
                  {translation.termsAndConditions}
                </Link>
              </li>
            )}
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
                staticCategoriesCatalogs.map((category, index) => (
                  <li
                    key={category.id}
                    className="dropdown-item"
                    onClick={() => {
                      setIsOpenActiveCategory(true)
                      setActiveCategory(`categories-dropdown-details-item-${index}`)
                    }}
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
                            <Link href={linkItem.link} onClick={() => {
                              setIsOpenCategoriesDropdown(false)
                              setIsOpenActiveCategory(false)
                              onGoTo()
                            }}>
                              {state.LANG === "EN" ? linkItem.name_en : linkItem.name_ar}
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