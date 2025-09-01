// components/Toast.js
'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Cookies from 'js-cookie';
import { useAppContext } from '../../../context/AppContext';

export default function Toast({ message, type = 'success', address }) {
  const [lang, setLang] = useState('EN'); // Default to EN or any fallback
  const { state = {}, dispatch = () => {} } = useAppContext() || {};
  if (!message) return null;

  useEffect(() => {
    const userLang = Cookies.get('lang') || 'AR';
    setLang(userLang);
    }, []);

  return createPortal(
    <div className={`fixed ${address ? 'bottom-16' : 'bottom-32'} ${lang === "AR" ? 'right-6' : 'left-6'} z-[99999] px-4 py-2 rounded-lg shadow-lg transition-all ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {message}
    </div>,
    typeof window !== 'undefined' ? document.body : null
  );
}
