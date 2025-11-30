"use client"
import React, { useState, useEffect } from 'react';
import FilterMultiItem from './FilterMultiItem';
import Loader from '@/components/ui/Loaders/Loader';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';
import { useRouter } from 'next/navigation';


export default function BrandsFilters({ selected = [], initiallyOpen = false, parentOptions, brandsOptions, isFiltersPage }) {
    const [selectedMap, setSelectedMap] = useState({});
    const [allSelected, setAllSelected] = useState(selected); // flat array of selected IDs
    const router = useRouter();

    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);

    async function fetchBrandsFilters() {
        try {
            const lang = Cookies.get('lang') || 'AR';
            const res = await axios.get(`${BASE_API}${endpoints.products.brandsFilters}&lang=${lang}&token=${Cookies.get('token')}`, {});
            return res;
        } catch (error) {
            error.status === 401 && router.push("/");
        }
    }


    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);


    const { data, isLoading, error } = useQuery({
        queryKey: ['brandsFilters'],
        queryFn: fetchBrandsFilters,
    })


    useEffect(() => {
        if (selected.length > 0 && brandsOptions?.length) {
            const initialMap = {};
            brandsOptions.forEach((brandGroup) => {
                initialMap[brandGroup.code] = brandGroup.brands
                    .filter((b) => selected.includes(b.brandID))
                    .map((b) => b.brandID);
            });

            setSelectedMap(initialMap);
        } else if (selected.length > 0 && data?.data?.length) {
            const initialMap = {};
            data.data.forEach((brandGroup) => {
                initialMap[brandGroup.code] = brandGroup.brands
                    .filter((b) => selected.includes(b.brandID))
                    .map((b) => b.brandID);
            });

            setSelectedMap(initialMap);
        }
    }, [data, brandsOptions, selected]);

    const handleOptionsChange = (brandCode, selectedItems) => {
        setSelectedMap((prev) => {
            const updated = { ...prev, [brandCode]: selectedItems };
            const allSelected = Object.values(updated).flat();
            parentOptions(false, allSelected);
            return updated;
        });
    };

    if (error instanceof Error) return <p>Error: {error.message}</p>;
    if (!data?.data?.length) return null;

    return (
        <div className="accordion-wrapper">
            <Disclosure defaultOpen={selected.length > 0 || initiallyOpen}>
                {({ open: isOpen }) => (
                    <div>
                        <DisclosureButton className="accordion-item w-full flex items-center justify-between cursor-pointer">
                            <span className="title">{translation.brands}</span>
                            <i className={`icon-arrow-down-01-round arrow-down ${isOpen ? 'rotate-180' : ''}`}></i>
                        </DisclosureButton>

                        <DisclosurePanel>
                            <DisclosurePanel>
                                {isFiltersPage && brandsOptions ? brandsOptions?.map((brand) =>
                                    brand.brands?.length > 0 && (
                                        <FilterMultiItem
                                            key={brand.code}
                                            title={brand.code}
                                            options={brand.brands}
                                            name="brand"
                                            selected={selectedMap[brand.code] || []}
                                            onOptionsChange={(code, selectedItems) =>
                                                handleOptionsChange(code, selectedItems)
                                            }
                                        />
                                    )
                                ) : null}
                                {!isFiltersPage && data?.data ? data?.data?.map((brand) =>
                                    data?.data?.length > 0 && (
                                        <FilterMultiItem
                                            key={brand.code}
                                            title={brand.code}
                                            options={brand.brands}
                                            name="brand"
                                            selected={selectedMap[brand.code] || []}
                                            onOptionsChange={(code, selectedItems) => {
                                                handleOptionsChange(code, selectedItems)
                                            }
                                            }
                                        />
                                    )
                                ) : null}
                            </DisclosurePanel>
                        </DisclosurePanel>
                    </div>
                )}
            </Disclosure>
        </div>
    );
}


