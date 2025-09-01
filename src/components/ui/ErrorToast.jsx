'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';

export default function ErrorToast({ message }) {
    const [mounted, setMounted] = useState(false);
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);

    useEffect(() => {
        setTranslation(state.LANG === 'EN' ? en : ar);
    }, [state.LANG]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className={`fixed top-6 ${state.LANG === 'EN' ? 'left-6' : 'right-6'} z-9999 w-auto max-w-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg animate-slide-in`}>
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    <i className="icon-warning-2 text-red-500 text-lg"></i>
                </div>
                <div className="flex-1 text-sm">
                    <strong className="block font-bold mb-1">{translation.warning}</strong>
                    <span>{message}</span>
                </div>
            </div>
        </div>,
        document.body,
    );
}
