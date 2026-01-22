"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/components/ui/Loaders/Loader';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API, endpoints } from '../../constant/endpoints';
import Placeholder from "../../src/assets/imgs/200x100.svg"
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";
import { useAppContext } from '../../context/AppContext';

export default function Page() {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [search, setSearch] = useState("");

  const { push } = useRouter();
  const { state = {} } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.brands : en.brands;
  }, [state.LANG]);

  async function fetchBrandsPage() {
    const lang = Cookies.get('lang') || 'AR';
    const res = await axios.get(`${BASE_API}${endpoints.home.brandsSwiper}&lang=${lang}&token=${Cookies.get('token')}`);
    return res;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['brandsPage'],
    queryFn: fetchBrandsPage,
    retry: false,
  });

  if (isLoading) return <Loader />;
  if (error instanceof Error) return push("/");

  const brands = data?.data || [];

  // 🔍 Filter Brands
  const filteredBrands = brands.filter((brand) =>
    brand.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTooltip = (key) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    <div className="container section-min-2 brands-page">
      <h2 className="main-title mt-40 mb-4">{translation.brands}</h2>

      {/* 🔍 Search Input */}
      <div className="relative h-full mt-5 mobile-search-input isMobile">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <i className="icon-search-normal"></i>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-full ps-10 p-2.5"
          type="text"
          placeholder={translation.mobile.brandsSearchPlaceholder}
        />
      </div>

      <div className="isDesktop">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-40">
          {
            data?.data.map((brand, i) => (

              <Link key={brand.brandID}
                href={`/products?itemStatus=AVAILABLE&pageSize=12&brand=${brand.brandID}`}
                className="block w-full h-full relative z-10"
              >
                <div className="relative group brands card" style={{ height: "132px" }} onClick={() => toggleTooltip(brand.description)}>
                  <div className={`
                  absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                  transition-opacity duration-300 
                  ${activeTooltip === brand.description ? "opacity-100" : "opacity-0"} 
                  group-hover:opacity-100 pointer-events-none
              `}>
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      {brand.description}
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>
                  <Image
                    className='brand-logo pointer-events-auto'
                    src={brand.image !== "" ? brand.image : Placeholder}
                    alt={brand.description !== "" ? brand.description : 'Brand'}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </Link>
            ))
          }
        </div>
      </div>

      <div className="isMobile">

        {/* 🟦 Empty State */}
        {filteredBrands.length === 0 && search.trim() !== "" && (
          <div className='empty-state text-center mt-40'>
            <svg className='m-auto' style={{ width: "200px", height: "200px" }} xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="none">
              <rect width="260" height="260" rx="130" fill="url(#paint0_linear_422_4029)" />
              <path opacity="0.4" d="M184 96.2665C184 99.8665 182.067 103.133 179 104.8L167.4 111.066L157.533 116.333L137.067 127.4C134.867 128.6 132.467 129.2 130 129.2C127.533 129.2 125.133 128.6 122.933 127.4L81 104.8C77.9333 103.133 76 99.8665 76 96.2665C76 92.6665 77.9333 89.3996 81 87.7329L94.1333 80.6663L104.6 74.9998L122.933 65.1333C127.333 62.7333 132.667 62.7333 137.067 65.1333L179 87.7329C182.067 89.3996 184 92.6665 184 96.2665Z" fill="#7E818E" />
              <path opacity="0.4" d="M116 135.267L76.9999 115.733C73.9999 114.2 70.5333 114.4 67.6666 116.133C64.7999 117.867 63.1333 120.934 63.1333 124.267V161.133C63.1333 167.533 66.6665 173.267 72.3999 176.133L111.4 195.6C112.733 196.267 114.2 196.6 115.667 196.6C117.4 196.6 119.133 196.134 120.667 195.134C123.533 193.4 125.2 190.333 125.2 187V150.134C125.267 143.867 121.733 138.133 116 135.267Z" fill="#7E818E" />
              <path opacity="0.4" d="M196.867 124.333V161.2C196.867 167.533 193.334 173.267 187.6 176.133L148.6 195.666C147.267 196.333 145.8 196.667 144.333 196.667C142.6 196.667 140.867 196.2 139.267 195.2C136.467 193.467 134.733 190.4 134.733 187.067V150.267C134.733 143.867 138.267 138.133 144 135.267L158.333 128.133L168.333 123.133L183 115.8C186 114.267 189.467 114.4 192.333 116.2C195.133 117.933 196.867 121 196.867 124.333Z" fill="#7E818E" />
              <path d="M167.4 111.066L157.533 116.333L94.1333 80.6665L104.6 75L165.8 109.533C166.467 109.933 167 110.466 167.4 111.066Z" fill="#7E818E" />
              <path d="M168.333 123.133V138.267C168.333 141 166.067 143.267 163.333 143.267C160.6 143.267 158.333 141 158.333 138.267V128.133L168.333 123.133Z" fill="#7E818E" />
              <defs>
                <linearGradient id="paint0_linear_422_4029" x1="130" y1="0" x2="130" y2="260" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E9EBED" />
                  <stop offset="1" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
            <h2 className='sub-title'>{translation.products.resultsNotFound}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-40">
          {filteredBrands.map((brand) => (
            <Link
              key={brand.brandID}
              href={`/products?brand=${brand.brandID}&itemStatus=AVAILABLE`}
              className="block w-full h-full relative z-10"
            >
              <div
                className="relative group brands card"
                style={{ height: "132px" }}
                onClick={() => toggleTooltip(brand.description)}
              >
                {/* Tooltip */}
                <div className={`
                absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                transition-opacity duration-300 
                ${activeTooltip === brand.description ? "opacity-100" : "opacity-0"} 
                pointer-events-none
              `}>
                  <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                    {brand.description}
                    <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                </div>

                {/* Image */}
                <Image
                  className='brand-logo pointer-events-auto'
                  src={brand.image !== "" ? brand.image : Placeholder}
                  alt={brand.description || 'Brand'}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
