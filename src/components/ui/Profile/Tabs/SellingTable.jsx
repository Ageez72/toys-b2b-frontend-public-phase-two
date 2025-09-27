"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";

export default function SellingTable({ data }) {
    const { state = {} } = useAppContext() || {};
    const translation = state.LANG === "EN" ? en : ar;

    return (
        <div className="selling-table-container">
            <div className="table-head flex">
                <div className='w-1/4'>{translation.number}</div>
                <div className='w-1/4'>{translation.address}</div>
                <div className='w-1/2'>{translation.target}</div>
            </div>

            {data.length === 0 && (
                <>
                    <div className='empty-state text-center my-20'>
                        <svg className='mx-auto' xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="none">
                            <rect width="260" height="260" rx="130" fill="url(#paint0_linear_422_4029)" />
                            <path opacity="0.4" d="M184 96.2665C184 99.8665 182.067 103.133 179 104.8L167.4 111.066L157.533 116.333L137.067 127.4C134.867 128.6 132.467 129.2 130 129.2C127.533 129.2 125.133 128.6 122.933 127.4L81 104.8C77.9333 103.133 76 99.8665 76 96.2665C76 92.6665 77.9333 89.3996 81 87.7329L94.1333 80.6663L104.6 74.9998L122.933 65.1333C127.333 62.7333 132.667 62.7333 137.067 65.1333L179 87.7329C182.067 89.3996 184 92.6665 184 96.2665Z" fill="#7E818E" />
                            <path opacity="0.4" d="M116 135.267L76.9999 115.733C73.9999 114.2 70.5333 114.4 67.6666 116.133C64.7999 117.867 63.1333 120.934 63.1333 124.267V161.133C63.1333 167.533 66.6665 173.267 72.3999 176.133L111.4 195.6C112.733 196.267 114.2 196.6 115.667 196.6C117.4 196.6 119.133 196.134 120.667 195.134C123.533 193.4 125.2 190.333 125.2 187V150.134C125.267 143.867 121.733 138.133 116 135.267Z" fill="#7E818E" />
                            <path opacity="0.4" d="M196.867 124.333V161.2C196.867 167.533 193.334 173.267 187.6 176.133L148.6 195.666C147.267 196.333 145.8 196.667 144.333 196.667C142.6 196.667 140.867 196.2 139.267 195.2C136.467 193.467 134.733 190.4 134.733 187.067V150.267C134.733 143.867 138.267 138.133 144 135.267L158.333 128.133L168.333 123.133L183 115.8C186 114.267 189.467 114.4 192.333 116.2C195.133 117.933 196.867 121 196.867 124.333Z" fill="#7E818E" />
                            <path d="M167.4 111.066L157.533 116.333L94.1333 80.6665L104.6 75L165.8 109.533C166.467 109.933 167 110.466 167.4 111.066Z" fill="#7E818E" />
                            <path d="M168.333 123.133V138.267C168.333 141 166.067 143.267 163.333 143.267C160.6 143.267 158.333 141 158.333 138.267V128.133L168.333 123.133Z" fill="#7E818E" />
                            <defs>
                                <linearGradient id="paint0_linear_422_4029" x1="130" y1="0" x2="130" y2="260" gradientUnits="userSpaceOnUse">
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
                    <div key={index} className="table-item flex mb-12">
                        <div className='w-1/4 px-3'>{index + 1}</div>
                        <div className='w-1/4 px-3'>{item.name}</div>
                        <div className='w-1/2 px-3 target-content'>
                            <div className='flex justify-between mb-2'>
                                <p className='mb-0 font-bold'>{translation.wantTarget}</p>
                                <p className='mb-0 font-bold'>
                                    <span>{item.target}</span>
                                    <span className="price-unit mx-1">{translation.jod}</span>
                                </p>
                            </div>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `calc(${progressPerc}% - 8px)` }}></div>
                            </div>
                            <div className='flex justify-between mt-2 red-text'>
                                <p className='mb-0 font-bold'>
                                    تم تحقيق {item.achieved} {translation.jod} من {item.target} {translation.jod}
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
