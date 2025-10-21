"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import Cookies from 'js-cookie';

export default function SellingTable({ data }) {
    const { state = {} } = useAppContext() || {};
    const translation = state.LANG === "EN" ? en : ar;
    const siteLocation = Cookies.get("siteLocation")

    return (
        <div className="selling-table-container">
            <div className="table-head flex">
                <div className='width-10'>{translation.number}</div>
                <div className='w-1/4'>{translation.address}</div>
                <div className='width-65'>{translation.target}</div>
            </div>

            {data.length === 0 && (
                <>
                    <div className='empty-state text-center my-20'>
                        <svg className='mx-auto' xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="none">
                            <rect width="260" height="260" rx="130" fill="url(#paint0_linear_1451_4175)" />
                            <path opacity="0.4" d="M152.696 75.8333H107.305C87.5882 75.8333 75.834 87.5875 75.834 107.304V152.642C75.834 172.413 87.5882 184.167 107.305 184.167H152.642C172.359 184.167 184.113 172.413 184.113 152.696V107.304C184.167 87.5875 172.413 75.8333 152.696 75.8333Z" fill="#7E818E" />
                            <path d="M153.941 107.304V152.696C153.941 156.163 151.124 158.979 147.658 158.979C144.137 158.979 141.32 156.163 141.32 152.696V107.304C141.32 103.838 144.137 101.021 147.658 101.021C151.124 101.021 153.941 103.838 153.941 107.304Z" fill="#7E818E" />
                            <path d="M118.679 135.038V152.696C118.679 156.163 115.863 158.979 112.342 158.979C108.875 158.979 106.059 156.163 106.059 152.696V135.038C106.059 131.571 108.875 128.754 112.342 128.754C115.863 128.754 118.679 131.571 118.679 135.038Z" fill="#7E818E" />
                            <defs>
                                <linearGradient id="paint0_linear_1451_4175" x1="130" y1="0" x2="130" y2="260" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#E9EBED" />
                                    <stop offset="1" stopColor="white" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <h2 className='sub-title mt-5'>{translation.noData}</h2>
                    </div>
                </>
            )}

            {data.map((item, index) => {
                const progressPerc = item.perc > 100 ? 100 : item.perc;
                const remaining = item.target - item.achieved;

                return (
                    <div key={index} className="table-item flex">
                        <div className='width-10 px-3'>{index + 1}</div>
                        <div className='w-1/4 px-3 border-center'>{item.name}</div>
                        <div className='width-65 px-3 target-content'>
                            <div className='flex justify-between mb-2'>
                                <p className='mb-0 font-bold'>{translation.wantTarget}</p>
                                <p className='mb-0 font-bold'>
                                    <span>{item.target}</span>
                                    <span className="price-unit mx-1">{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                                </p>
                            </div>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `calc(${progressPerc}% - 8px)` }}></div>
                            </div>
                            <div className='flex justify-between mt-2 red-text'>
                                <p className='mb-0 font-bold'>
                                    {translation.achievedTarget
                                        .replace("{achieved}", item.achieved)
                                        .replace("{target}", item.target)
                                        .replace(/{jod}/g, siteLocation === "primereach" ? translation.iqd : translation.jod)}
                                </p>
                                <p className='mb-0 font-bold'>
                                    <span>{translation.remaining} </span>
                                    <span>{remaining > 0 ? remaining : 0}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
