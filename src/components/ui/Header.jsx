"use client";
import Link from "next/link";
import Menu from "./Menu";
import MenuControl from "./MenuControl";
import logo from "../../assets/imgs/logo.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense } from 'react';
import { useAppContext } from '../../../context/AppContext';

export default function Header({ scroll, handleOffCanvas }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const pathname = usePathname();
  const isActive = (path) => {
    return pathname === path ? "active" : "";
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
                    <Menu scroll={scroll} />
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
              </div>
              <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false" onClick={handleOffCanvas}>
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
              <div className="hidden w-full lg:block lg:w-auto" id="navbar-default">
                <Suspense fallback={<div>Loading menu...</div>}>
                  <MenuControl />
                </Suspense>
              </div>
            </div>
          </nav>

        </div>
      </header>
    </>
  );
}
