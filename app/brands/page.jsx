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
  const { push } = useRouter();
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar); // default fallback
  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.brands : en.brands;
  }, [state.LANG]);

  async function fetchBrandsPage() {
    const lang = Cookies.get('lang') || 'AR';
    const res = await axios.get(`${BASE_API}${endpoints.home.brandsSwiper}&lang=${lang}&token=${Cookies.get('token')}`, {});
    return res;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['brandsPage'],
    queryFn: fetchBrandsPage,
    retry: false,
  });

  if (isLoading) return <Loader />;
  if (error instanceof Error) return push("/");

  const toggleTooltip = (key) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  }

  return (
    <div className="container section-min-2">
      <h2 className="main-title mt-40 mb-4">{translation.brands}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-40">
        {
          data?.data.map((brand, i) => (

            <Link key={brand.brandID}
              href={`/products?brand=${brand.brandID}&itemStatus=AVAILABLE`}
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
  )
}