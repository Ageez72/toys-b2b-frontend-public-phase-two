"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import { getProfile } from '@/actions/utils';
import { BASE_API, endpoints } from '../../../../../constant/endpoints';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorModal from '../../ErrorModal';

export default function StatementOfAccount({ order }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);
    const [fromdate, setFromdate] = useState("");
    const [todate, setTodate] = useState("");
    const [getProfileData, setGetProfileData] = useState("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");

    // validation states
    const [fromDateError, setFromDateError] = useState("");
    const [toDateError, setToDateError] = useState("");

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
        document.title = state.LANG === 'AR' ? ar.statementOfAccount : en.statementOfAccount;
    }, [state.LANG]);

    useEffect(() => {
        const profile = getProfile();
        setGetProfileData(profile ? profile : []);
    }, []);

    const validateDates = () => {
        let isValid = true;

        if (!fromdate) {
            setFromDateError(translation.fromDateRequired);
            isValid = false;
        } else {
            setFromDateError("");
        }

        if (!todate) {
            setToDateError(translation.toDateRequired);
            isValid = false;
        } else {
            setToDateError("");
        }

        if (fromdate && todate && new Date(fromdate) > new Date(todate)) {
            setToDateError(translation.invalidDateRange);
            isValid = false;
        }

        return isValid;
    };

    const fetchStatementOfAccountFile = async (type) => {
        if (!validateDates()) return;

        try {
            const res = await axios.get(
                `${BASE_API}${endpoints.products.getStatement}&type=${type}&fromdate=${fromdate}&todate=${todate}&lang=${state.LANG}&token=${Cookies.get('token')}`
            );

            const fileUrl = res?.data?.url;
            if (fileUrl) {
                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = fileUrl.split("/").pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                setIsErrorModalOpen(true);
                setErrorModalMessage(translation.noFileFound);
            }
        } catch (error) {
            console.error("Download failed", error);
            setIsErrorModalOpen(true);
            setErrorModalMessage(translation.errorDownload);
        }
    };

    return (
        <div className="py-3">
            <ErrorModal
                open={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={translation.error}
                message={errorModalMessage}
            />
            <h2 className='sub-title mb-3'>{translation.statementOfAccount}</h2>
            <p>{translation.statementOfAccountDesc}</p>

            <form className='mt-8' onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className='form-group'>
                        <label className='block mb-2'>{translation.accountNumber}</label>
                        <input
                            placeholder={translation.accountNumber}
                            type="text"
                            className={`w-full p-2.5 disabled`}
                            defaultValue={getProfileData?.accountNumber || ''}
                        />
                    </div>
                    <div className='form-group'>
                        <label className='block mb-2'>{translation.accountName}</label>
                        <input
                            placeholder={translation.accountName}
                            type="text"
                            className={`w-full p-2.5 disabled`}
                            defaultValue={getProfileData?.account || ''}
                        />
                    </div>

                    {/* From date */}
                    <div className='form-group'>
                        <label className='block mb-2'>{translation.from}</label>
                        <input
                            placeholder={translation.from}
                            type="date"
                            className={`w-full p-2.5`}
                            value={fromdate}
                            onChange={(e) => setFromdate(e.target.value)}
                        />
                        {fromDateError && <span className="text-red-500 text-sm mt-1 mb-0">{fromDateError}</span>}
                    </div>

                    {/* To date */}
                    <div className='form-group'>
                        <label className='block mb-2'>{translation.to}</label>
                        <input
                            placeholder={translation.to}
                            type="date"
                            className={`w-full p-2.5`}
                            value={todate}
                            onChange={(e) => setTodate(e.target.value)}
                        />
                        {toDateError && <span className="text-red-500 text-sm mt-1 mb-0">{toDateError}</span>}
                    </div>
                </div>

                <div className="flex justify-end flex-wrap gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => fetchStatementOfAccountFile("excel")}
                        className="primary-btn green-btn flex items-center justify-center gap-1"
                    >
                        <i className="icon-svgexport-15-1 text-xl"></i>
                        XLS
                    </button>
                    <button
                        type="button"
                        onClick={() => fetchStatementOfAccountFile("pdf")}
                        className="primary-btn red-btn flex items-center justify-center gap-1"
                    >
                        <i className="icon-PDF-1 text-xl"></i>
                        PDF
                    </button>
                </div>
            </form>
        </div>
    )
}
