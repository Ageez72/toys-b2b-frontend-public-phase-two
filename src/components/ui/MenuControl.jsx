'use client';
import React, { useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import LangSwitcher from './LangSwitcher';
import ProfileDropdown from './ProfileDropdown';
import Link from 'next/link';

export default function MenuControl({onGoTo}) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  let cartLength = state.STOREDITEMS.length;

  useEffect(() => {
    cartLength = state.STOREDITEMS.length;
  }, [state.STOREDITEMS])

  return (
    <div className='flex items-center'>
      <LangSwitcher top={true} />
      <div className="flex items-center justify-between gap-3">
        <div className="vl"></div>
        <Link href="/cart" onClick={()=> onGoTo && onGoTo()}>
          <div className="circle-icon-container">
            <span className='cart-icon relative'>
              {cartLength > 0 && (
                <span className='cart-count-num'>{cartLength}</span>
              )}
              <i className="icon-bag-happy"></i>
            </span>
          </div>
        </Link>
        <ProfileDropdown onGoTo={onGoTo} />
      </div>
    </div>
  );
}
