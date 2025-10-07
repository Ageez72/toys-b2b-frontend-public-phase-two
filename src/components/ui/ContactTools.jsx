'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppContext } from '../../../context/AppContext';
import { getProfile } from '@/actions/utils';

const ContactTools = () => {
  const [showButton, setShowButton] = useState(false);
  const [profile, setProfile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { state = {}, dispatch = () => {} } = useAppContext() || {};

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial cookie load
    let previousCookie = Cookies.get('profile');
    if (previousCookie) {
      try {
        setProfile(JSON.parse(previousCookie));
      } catch (e) {
        console.error('Invalid profile cookie:', e);
      }
    }

    // Poll for cookie changes
    const interval = setInterval(() => {
      const currentCookie = Cookies.get('profile');
      if (currentCookie !== previousCookie) {
        previousCookie = currentCookie;
        try {
          setProfile(currentCookie ? JSON.parse(currentCookie) : null);
        } catch (e) {
          console.error('Invalid profile cookie:', e);
          setProfile(null);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleOpen = (e) => {
    e.stopPropagation();
    document.querySelector('.socials')?.classList.toggle('open');
    document.querySelector('.contact-tools')?.classList.toggle('open');
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
    <div className="contact-tools">
      <button
        onClick={scrollToTop}
        className={`back-to-top circle-icon-container ${showButton ? 'show' : 'not-allowed'}`}
      >
        <i className="icon-arrow-up"></i>
      </button>

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
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link circle-icon-container mb-2 contact-email"
                >
                  <i className="icon-sms"></i>
                </a>
                <a
                  href={getWhatsAppLink('')}
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
  );
};

export default ContactTools;
