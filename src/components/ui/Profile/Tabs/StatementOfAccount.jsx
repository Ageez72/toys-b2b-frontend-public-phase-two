"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";

export default function StatementOfAccount({ order }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
        document.title = state.LANG === 'AR' ? ar.statementOfAccount : en.statementOfAccount;
    }, [state.LANG]);


    return (
        <div className="py-3">
            <h2 className='sub-title mb-3'>{translation.statementOfAccount}</h2>
            <p>{translation.statementOfAccountDesc}</p>

            <form className='mt-8'>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className='form-group'>
                        <label className='block mb-2'>
                            {translation.accountNumber}
                        </label>
                        <div className='relative'>
                            <input
                                placeholder={translation.accountNumber}
                                type="text"
                                className={`w-full p-2.5 disabled`}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='block mb-2'>
                            {translation.accountName}
                        </label>
                        <div className='relative'>
                            <input
                                placeholder={translation.accountName}
                                type="text"
                                className={`w-full p-2.5 disabled`}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='block mb-2'>
                            {translation.from}
                        </label>
                        <div className='relative'>
                            <input
                                placeholder={translation.from}
                                type="date"
                                className={`w-full p-2.5`}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='block mb-2'>
                            {translation.to}
                        </label>
                        <div className='relative'>
                            <input
                                placeholder={translation.to}
                                type="date"
                                className={`w-full p-2.5`}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end flex-wrap gap-4 mt-4">
                    <button className="primary-btn green-btn flex items-center justify-center gap-1">
                        <i className="icon-svgexport-15-1 text-xl"></i>
                        XLS
                    </button>
                    <button className="primary-btn red-btn flex items-center justify-center gap-1">
                        <i className="icon-PDF-1 text-xl"></i>
                        PDF
                    </button>
                </div>
            </form>
        </div>
    )
}
