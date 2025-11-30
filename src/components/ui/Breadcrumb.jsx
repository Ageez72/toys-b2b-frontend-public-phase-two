'use client';
import React, { useState, useEffect } from 'react';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';

export default function Breadcrumb({ items = [] }) {
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // default fallback
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    return (
        <nav className="flex breadcrumb-wrapper" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="inline-flex items-center m-0">
                            {index !== 0 && (
                                <svg className='mx-1' xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" viewBox="0 0 1024 1024">
                                    <g id="icomoon-ignore">
                                    </g>
                                    <path d="M640 881.92c-8.107 0-16.213-2.987-22.613-9.387l-278.185-278.187c-45.227-45.227-45.227-119.467 0-164.693l278.185-278.186c12.373-12.373 32.853-12.373 45.227 0s12.373 32.853 0 45.227l-278.185 278.186c-20.48 20.48-20.48 53.76 0 74.24l278.185 278.187c12.373 12.373 12.373 32.853 0 45.227-6.4 5.973-14.507 9.387-22.613 9.387z" />
                                </svg>
                            )}

                            {isLast ? (
                                <span className="last">
                                    {item.label}
                                </span>
                            ) : (
                                <a
                                    href={item.href}
                                    className="inline-flex items-center m-0"
                                >
                                    {item.label}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
