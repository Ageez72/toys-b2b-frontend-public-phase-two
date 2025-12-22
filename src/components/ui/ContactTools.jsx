'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppContext } from '../../../context/AppContext';
import { getProfile } from '@/actions/utils';
import { usePathname } from 'next/navigation';

const ContactTools = () => {
  const [showButton, setShowButton] = useState(false);
  const [profile, setProfile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const pathname = usePathname();

  // Wait for .profile-tab-panels to exist
  const waitForProfilePanel = (timeout = 10000, interval = 200) => {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (document.querySelector('.profile-tab-panels')) {
          clearInterval(intervalId);
          resolve(true);
        }
      }, interval);
      setTimeout(() => {
        clearInterval(intervalId);
        resolve(false);
      }, timeout);
    });
  };

  useEffect(() => {
    setMounted(true);

    let panelElement = null;

    const handleScroll = (e) => {
      const target = e?.target || window;
      const scrollTop = target === window ? window.scrollY : target.scrollTop;
      setShowButton(scrollTop > 300);
    };

    let interval;
    const attachScrollListener = async () => {
      const found = await waitForProfilePanel();
      if (found) {
        panelElement = document.querySelector('.profile-tab-panels');
        panelElement?.addEventListener('scroll', handleScroll);
      } else {
        // fallback to window scroll
        window.addEventListener('scroll', handleScroll);
      }
    };

    attachScrollListener();

    // Cookie polling
    let previousCookie = Cookies.get('profile');
    interval = setInterval(() => {
      const currentCookie = Cookies.get('profile');
      if (currentCookie !== previousCookie) {
        previousCookie = currentCookie;
        try {
          setProfile(currentCookie ? JSON.parse(currentCookie) : null);
        } catch {
          setProfile(null);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      panelElement?.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleOpen = (e) => {
    e.stopPropagation();
    document.querySelectorAll('.socials')?.forEach(el => el.classList.toggle('open'));
    document.querySelectorAll('.contact-tools')?.forEach(el => el.classList.toggle('open'));
  };

  const getWhatsAppLink = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('962')) {
      return `https://wa.me/+${cleaned}`;
    } else if (cleaned.startsWith('00962')) {
      return `https://wa.me/+${cleaned.slice(2)}`;
    } else {
      return `https://wa.me/+962${cleaned}`;
    }
  };

  if (!mounted) return null;

  const hasContact = profile?.contactEmail || profile?.contactPhone || state.isCorporate;

  return (
    <>
      <div className="isDesktop">
        <div className="contact-tools">
          {hasContact && (
            <>
              <div className="contact-link circle-icon-container contact-btn" onClick={toggleOpen}>
                <i className="icon-multiplication-sign close"></i>
                <i className="icon-call-center call"></i>
              </div>

              <div className="socials">
                {state.isCorporate ? (
                  <>
                    <a
                      href={getWhatsAppLink('+962789002194')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link circle-icon-container mb-2 contact-phone"
                    >
                      <i className="icon-whatsapp-brands"></i>
                    </a>
                  </>
                ) : (
                  <>
                    {profile?.contactEmail && (
                      <a
                        href={`mailto:${profile.contactEmail}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Email"
                        className="contact-link circle-icon-container mb-2 contact-email"
                      >
                        <i className="icon-sms"></i>
                      </a>
                    )}

                    {profile?.contactPhone && (
                      <a
                        href={getWhatsAppLink(profile.contactPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link circle-icon-container mb-2 contact-phone"
                      >
                        <i className="icon-whatsapp-brands"></i>
                      </a>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <button
          onClick={scrollToTop}
          aria-label="back-to-top"
          className={`back-to-top circle-icon-container ${showButton ? 'show' : 'not-allowed'}`}
        >
          <i className="icon-arrow-up"></i>
        </button>
      </div>
      <div className="isMobile">
        <div className="contact-tools">
          {hasContact && (
            <>
              <div className="contact-link circle-icon-container contact-btn" onClick={toggleOpen}>
                <i className="icon-multiplication-sign close"></i>
                <i className="icon-call-center call"></i>
              </div>

              <div className="socials">
                {state.isCorporate ? (
                  <>
                    <a
                      href={getWhatsAppLink('+962789002194')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link circle-icon-container mb-2 contact-phone"
                    >
                      <i className="icon-whatsapp-brands"></i>
                    </a>
                  </>
                ) : (
                  <>
                    {profile?.contactEmail && (
                      <a
                        href={`mailto:${profile.contactEmail}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Email"
                        className="contact-link circle-icon-container mb-2 contact-email"
                      >
                        <i className="icon-sms"></i>
                      </a>
                    )}

                    {profile?.contactPhone && (
                      <a
                        href={getWhatsAppLink(profile.contactPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link circle-icon-container mb-2 contact-phone"
                      >
                        <i className="icon-whatsapp-brands"></i>
                      </a>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <button
          onClick={scrollToTop}
          aria-label="back-to-top"
          className={`back-to-top mobile-back-to-top circle-icon-container ${showButton ? 'show' : 'not-allowed'}`}
        >
          <i className="icon-arrow-up"></i>
        </button>
      </div>
    </>
  );
};

export default ContactTools;
