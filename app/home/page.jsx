"use client";
import React, { useEffect, useState } from "react";
import "../../src/assets/js/main";
import BrandsSwiper from "@/components/ui/BrandsSwiper";
import GridSwiper from "@/components/ui/GridSwiper";
import ColumnsGridSwiper from "@/components/ui/ColumnsGridSwiper";
import Hero from "@/components/ui/Hero";
import { useAppContext } from "../../context/AppContext";
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_API, endpoints } from "../../constant/endpoints";
import { useQuery } from "@tanstack/react-query";

// fallback images
import fallbackDesktopImage from "@/assets/imgs/hero-bg.png";
import fallbackMobileImage from "@/assets/imgs/hero-bg.png";

export default function Home() {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar);
  const [imagePairs, setImagePairs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
  }, [state.LANG]);

  const searchTypes = [
    {
      title: translation.newArrivals,
      badgeType: "blue",
      type: "NEW ARRIVAL",
      route: "/products?itemType=NEW ARRIVAL&itemStatus=AVAILABLE",
      id: "new-arrival",
    },
    {
      title: translation.offers,
      badgeType: "green",
      type: "GIVEAWAY",
      route: "/products?itemType=GIVEAWAY&itemStatus=AVAILABLE",
      id: "giveaway",
    },
    {
      title: translation.commingSoon,
      badgeType: "yellow",
      type: "COMMING SOON",
      route: "/products?itemType=COMMING SOON&itemStatus=AVAILABLE",
      id: "coming-soon",
    },
    {
      title: translation.clearance,
      badgeType: "red",
      type: "CLEARANCE",
      route: "/products?itemType=CLEARANCE&itemStatus=AVAILABLE",
      id: "clearance",
    },
  ];

  const mostSelling = {
    title: translation.mostSelling,
    badgeType: "yellow",
    type: "y",
    id: "most-selling",
  }
  const featuredProducts = {
    title: translation.featuredProducts,
    badgeType: "yellow",
    type: "y",
    id: "featured-products",
  }

  const fetchHomeImages = async () => {
    const res = await axios.get(
      `${BASE_API}${endpoints.products.homeImages}&token=${Cookies.get("token")}`
    );
    return res;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`home-images`],
    queryFn: fetchHomeImages,
    retry: false
  });

  useEffect(() => {
    if (data?.data?.length > 0) {
      const validPairs = data.data
        .filter(item => item["image desktop"] && item["image mobile"])
        .map(item => ({
          desktop: item["image desktop"],
          mobile: item["image mobile"],
        }));
      setImagePairs(validPairs);
    }
  }, [data]);

  // Slider effect: every 5 seconds, change image
  useEffect(() => {
    if (imagePairs.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePairs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imagePairs]);

  const currentImagePair = imagePairs[currentIndex] || {
    desktop: fallbackDesktopImage.src,
    mobile: fallbackMobileImage.src,
  };

  return (
    <>
      {
        !isLoading && (
          <Hero
            desktopImage={currentImagePair.desktop}
            mobileImage={currentImagePair.mobile}
            exist={imagePairs.length > 0}
          />
        )
      }

      <div className="custom-py-40 pt-0 mt-40">
        <BrandsSwiper />
      </div>

      <ColumnsGridSwiper
        title={mostSelling.title}
        badgeType={mostSelling.badgeType}
        type={mostSelling.type}
        id={mostSelling.id}
      />

      {searchTypes.map((grid, i) => (
        <GridSwiper
          key={i}
          title={grid.title}
          badgeType={grid.badgeType}
          type={grid.type}
          route={grid.route}
          id={grid.id}
        />
      ))}

      <ColumnsGridSwiper
        title={featuredProducts.title}
        badgeType={featuredProducts.badgeType}
        type={featuredProducts.type}
        id={featuredProducts.id}
      />
    </>
  );
}
