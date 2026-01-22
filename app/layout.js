"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Offcanvas from "@/components/ui/Offcanvas";
import AppProvider from "../context/AppContext";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import Cookies from "js-cookie";
import "./globals.scss";
import ContactTools from "@/components/ui/ContactTools";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export default function RootLayout({ children }) {
  const [lang, setLang] = useState(Cookies?.get("lang"));
  const [scroll, setScroll] = useState(0);
  const [isOffCanvas, setOffCanvas] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/" || pathname === "/register" || pathname === '/reset-password' || pathname === '/forget-password';

  const handleOffCanvas = () => setOffCanvas(!isOffCanvas);
  const handleSearch = () => setSearch(!isSearch);

  useEffect(() => {
    const WOW = require("wowjs");
    window.wow = new WOW.WOW({ live: false });
    window.wow.init();

    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) setScroll(scrollCheck);
    });

    if (Cookies?.get("lang")) {
      document.documentElement.setAttribute(
        "dir",
        Cookies?.get("lang") === "EN" ? "ltr" : "rtl"
      );
      document.documentElement.setAttribute(
        "lang",
        Cookies?.get("lang") || "AR"
      );
    }
  }, []);

  return (
    <ReactQueryProvider>
      <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
        <head>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-TE73NGSFDB"
            strategy="beforeInteractive"
          />
          <Script id="google-analytics" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TE73NGSFDB');
            `}
          </Script>

          {/* Hotjar Tracking */}
          <Script id="hotjar" strategy="beforeInteractive">
            {`
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:6513872,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </Script>

          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-HFR3DPYGR5"
            strategy="beforeInteractive"
          />
          <Script id="google-analytics" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HFR3DPYGR5');
            `}
          </Script>

        </head>
        <body
          className={`antialiased ${!isAuthPage ? "header-padding" : ""}`}
        >
          <div id="media-popup"></div>
          <Toaster position={"top-left"} toastOptions={{ duration: 1000 }} />
          <AppProvider>
            {!isAuthPage && (
              <>
                <Offcanvas
                  isOffCanvas={isOffCanvas}
                  handleOffCanvas={handleOffCanvas}
                  scroll={scroll}
                />
                <Header
                  scroll={scroll}
                  isOffCanvas={isOffCanvas}
                  handleOffCanvas={handleOffCanvas}
                  isSearch={isSearch}
                  handleSearch={handleSearch}
                />
              </>
            )}

            {children}
            {!isAuthPage && <Footer />}
            {!isAuthPage && <ContactTools />}
          </AppProvider>
        </body>
      </html >
    </ReactQueryProvider >
  );
}
