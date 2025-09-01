'use client';
import React, { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import { useAppContext } from '../../../context/AppContext';
import { endpoints } from "../../../constant/endpoints";
import Cookies from "js-cookie";

export default function SidebarModal({ open, onClose }) {
  const [lang, setLang] = useState('EN'); // Default to EN or any fallback
  const { state = {}, dispatch = () => {} } = useAppContext() || {};

  useEffect(() => {
    const userLang = Cookies.get('lang') || 'AR';
    setLang(userLang);
  }, []);

  const sidebarPosition = lang === 'AR' ? 'right-0' : 'left-0 translate-x-full-100';

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-9999"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed top-0 ${open ? "opacity-100" : "opacity-0"} ${sidebarPosition} h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <FilterBar
          catalogEndpoint={endpoints.products.catalogList}
          categoriesEndpoint={endpoints.products.categoriesList}
          searchTerm=""
          onClose={onClose}
        />
      </div>
    </>
  );
}
