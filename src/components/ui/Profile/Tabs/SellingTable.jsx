"use client"
import Reac, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";

export default function SellingTable() {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);


    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    return (
        <div className="selling-table-container">
            <div className="table-head flex">
                <div className='w-1/4'>{translation.number}</div>
                <div className='w-1/4'>{translation.address}</div>
                <div className='w-1/2'>{translation.target}</div>
            </div>
            <div className="table-item flex mb-12">
                <div className='w-1/4 px-3'>1</div>
                <div className='w-1/4 px-3'>هنا يضاف اسم المنتج</div>
                <div className='w-1/2 px-3 target-content'>
                    <div className='flex justify-between mb-2'>
                        <p className='mb-0 font-bold'>{translation.wantTarget}</p>
                        <p className='mb-0 font-bold'>
                            <span>10,000</span>
                            <span className="price-unit mx-1">{translation.jod}</span>
                        </p>
                    </div>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `calc(${22.5}% - 8px)` }}></div>
                    </div>
                    <div className='flex justify-between mt-2 red-text'>
                        <p className='mb-0 font-bold'>تم تحقيق 6,500 دأ من 10,000 د.أ</p>
                        <p className='mb-0 font-bold'>
                            <span>{translation.remaining} </span>
                            <span>5,000</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="table-item flex mb-12">
                <div className='w-1/4 px-3'>2</div>
                <div className='w-1/4 px-3'>هنا يضاف اسم المنتج</div>
                <div className='w-1/2 px-3 target-content'>
                    <div className='flex justify-between mb-2'>
                        <p className='mb-0 font-bold'>{translation.wantTarget}</p>
                        <p className='mb-0 font-bold'>
                            <span>10,000</span>
                            <span className="price-unit mx-1">{translation.jod}</span>
                        </p>
                    </div>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `calc(${22.5}% - 8px)` }}></div>
                    </div>
                    <div className='flex justify-between mt-2 red-text'>
                        <p className='mb-0 font-bold'>تم تحقيق 6,500 دأ من 10,000 د.أ</p>
                        <p className='mb-0 font-bold'>
                            <span>{translation.remaining} </span>
                            <span>5,000</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
