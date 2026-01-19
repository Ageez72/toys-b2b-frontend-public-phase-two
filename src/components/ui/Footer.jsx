'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import Link from 'next/link';
import { getProfile } from '@/actions/utils';

export default function Footer() {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar); // default fallback
  const profileData = getProfile()
  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
  }, [state.LANG]);

  const d = new Date();
  return (
    <>
      <footer className='isDesktop'>
        <section className={`footer-section flex items-center ${profileData.isCorporate || profileData.hideTargetSOA ? "justify-between" : "justify-center"} max-w-screen-xl mx-auto p-4 text-center`}>
          <p className="mb-0">{translation.copyrights} {d.getFullYear()}</p>
          {
            profileData.isCorporate || profileData.hideTargetSOA ? (
              <p className='terms-link'>
                <Link href="/terms-and-conditions">
                  {translation.termsAndConditions}
                </Link>
              </p>
            ) : null
          }
        </section>
      </footer>
    </>
  );
}
