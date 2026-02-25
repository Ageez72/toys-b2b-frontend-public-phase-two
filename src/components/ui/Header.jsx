"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Menu from "./Menu";
import MenuControl from "./MenuControl";
import logo from "../../assets/imgs/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Cookies from "js-cookie";
import primereach from "../../assets/imgs/primereach.png";
import LangSwitcher from "./LangSwitcher";
import FixedMobileMenu from "./Mobile/FixedMobileMenu";
import SearchInput from "./SearchInput";

export default function Header({ scroll, handleOffCanvas }) {
  const [resetPopupsSignal, setResetPopupsSignal] = useState(0);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const pathname = usePathname();
  const isActive = (path) => {
    return pathname === path ? "active" : "";
  };

  const siteLocation = Cookies.get("siteLocation")

  const closeAllPopups = () => {
    setIsOpenSearch(false); // mobile search
    setResetPopupsSignal(prev => prev + 1); // notify Menu
  };

  return (
    <>
      <header>
        <div
          id="header-sticky"
          className={`header-1 ${scroll ? "fixed top-0 w-full" : "fixed top-0 w-full"}`}
        >
          <nav className="bg-white light:bg-gray-900 z-20 top-0 start-0 shadow-sm">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <div className="head-div flex flex-wrap items-center gap-4" style={{ gap: "2.5rem" }}>
                <Link
                  href="/home"
                  className={`flex items-center space-x-3 rtl:space-x-reverse`}
                  onClick={closeAllPopups}
                >
                  {
                    <Image
                      className={`logo-img`}
                      src={logo}
                      alt="My Image"
                      width={166}
                      height={54}
                    />
                  }
                </Link>

                <div className="hidden w-full lg:block lg:w-auto" id="navbar-default">
                  <Suspense fallback={<div>Loading menu...</div>}>
                    <Menu scroll={scroll} resetSignal={resetPopupsSignal} />
                  </Suspense>
                </div>
                {
                  state.isCorporate && state.corporateImage && (
                    <img
                      className={`corporate-img lg:hidden`}
                      src={state.corporateImage}
                      alt={state.corporateName}
                    />
                  )
                }
                {
                  !state.isCorporate && siteLocation === "primereach" && (
                    <img
                      className={`corporate-img lg:hidden`}
                      src={primereach.src}
                      alt={primereach.src}
                    />
                  )
                }
              </div>
              <div className="isMobile menu-mobile-controller">
                <div className="circle-icon-container">
                  <i className="icon-search-normal py-2 px-3 cursor-pointer" onClick={() => {
                    setIsOpenSearch(!isOpenSearch)
                  }}></i>
                </div>
                <LangSwitcher />
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false" onClick={handleOffCanvas}>
                  <span className="sr-only">Open main menu</span>
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                  </svg>
                </button>
              </div>
              <div className="hidden w-full lg:block lg:w-auto" id="navbar-default">
                <Suspense fallback={<div>Loading menu...</div>}>
                  <MenuControl />
                </Suspense>
              </div>
            </div>
          </nav>

        </div>
      </header>
      <FixedMobileMenu />

      <div className="isMobile">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
