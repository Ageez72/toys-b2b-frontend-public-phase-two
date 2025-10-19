'use client';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import LangSwitcher from './LangSwitcher';
import ProfileDropdown from './ProfileDropdown';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import primereach from "../../assets/imgs/primereach.png";

export default function MenuControl({ onGoTo }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const cartLength = state?.STOREDITEMS?.length || 0;
  const siteLocation = Cookies.get("siteLocation")

  return (
    <div className="flex items-center">
      <LangSwitcher top={true} />
      <div className="flex items-center justify-between gap-3">
        <div className="vl"></div>
        <Link
          // href={state.isCorporate ? '/corporate-cart' : '/cart'}
          href={'/cart'}
          onClick={() => onGoTo && onGoTo()}
        >
          <div className="circle-icon-container">
            <span className="cart-icon relative">
              {cartLength > 0 && (
                <span className="cart-count-num">{cartLength}</span>
              )}
              <i className="icon-bag-happy"></i>
            </span>
          </div>
        </Link>
        <ProfileDropdown onGoTo={onGoTo} />
        {
          state.isCorporate && state.corporateImage && (
            <img
              className={`corporate-img hidden lg:block`}
              src={state.corporateImage}
              alt={state.corporateName}
            />
          )
        }
        {
          !state.isCorporate && siteLocation === "primereach" && (
            <img
              className={`corporate-img hidden lg:block`}
              src={primereach.src}
              alt={primereach.src}
            />
          )
        }
      </div>
    </div>
  );
}
