"use client"
import React, { useState, useEffect, Suspense } from 'react';
import FilterSingleItem from './FilterSingleItem';
import Select2Form from './Select2Form';
import MultiRangeSlider from './MultiRangeSlider';
import MultiRangeSliderAge from './MultiRangeSliderAge';
import BrandsFilters from './BrandsFilters';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API } from '../../../constant/endpoints';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';


export default function FilterBar({ isProductsPage, resetUpperFilters, catalogEndpoint, categoriesEndpoint, sortItem, pageSizeItem, searchTerm, onClose, count, filtersSections }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // default fallback
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);
    const [showClearButton, setShowClearButton] = useState(false);

    const StatusOptions = [
        {
            id: 1,
            title: translation.all,
            value: "ALL"
        },
        {
            id: 2,
            title: translation.available,
            value: "AVAILABLE"
        },
        {
            id: 3,
            title: translation.notAvailable,
            value: "OUTOFSTOCK"
        },
    ]

    const itemTypeOptions = [
        {
            id: 1,
            title: translation.newArrivals,
            value: "NEW ARRIVAL"
        },
        {
            id: 2,
            title: translation.commingSoon,
            value: "COMMING SOON"
        },
        {
            id: 3,
            title: translation.offers,
            value: "GIVEAWAY"
        },
        {
            id: 4,
            title: translation.clearance,
            value: "CLEARANCE"
        },
    ]
    const router = useRouter();
    const useParams = useSearchParams();
    const lang = Cookies.get('lang') || 'AR';

    const [fromPrice, setFromPrice] = useState(useParams.get('fromPrice') || 0); // نطاق السعر
    const [toPrice, setToPrice] = useState(useParams.get('toPrice') || 0); // نطاق السعر
    const [fromAge, setFromAge] = useState(useParams.get('fromAge') || 0); // نطاق العمر
    const [toAge, setToAge] = useState(useParams.get('toAge') || 0); // نطاق العمر
    const [itemType, setItemType] = useState(useParams.get('itemType') || ""); // الاقسام
    const [brand, setBrand] = useState(() => {
        const value = useParams.get('brand');
        return value ? value.split(',') : [];
    }); // العلامات التجارية
    const [category, setCategory] = useState(useParams.get('category') ? useParams.get('category').split(',') : ""); // التصنيفات
    const [catalog, setCatalog] = useState(useParams.get('catalog') ? useParams.get('catalog').split(',') : ""); // الاستخدامات
    const [itemStatus, setItemStatus] = useState(useParams.get('itemStatus') || "AVAILABLE"); // حالة التوفر
    const [categoriesAllOptions, setCategoriesAllOptions] = useState(filtersSections?.categories || []);
    const [catalogsAllOptions, setCatalogsAllOptions] = useState(filtersSections?.catalogs?.catalogs || []);;
    const [selectedCategoriesOptions, setSelectedCategoriesOptions] = useState([]);
    const [selectedCatalogsOptions, setSelectedCatalogsOptions] = useState([]);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);

    useEffect(() => {
        const url = new URL(window.location.href);
        const itemType = url.searchParams.get("itemType");
        const allTab = document.querySelectorAll(".allProductsTab");
        const clearanceTab = document.querySelectorAll(".clearanceTab");
        if (isProductsPage) {
            if (itemType === "CLEARANCE") {
                clearanceTab?.forEach(tab => tab.classList.add("active"));
                allTab?.forEach(tab => tab.classList.remove("active"));
                document.title = state.LANG === "AR" ? ar.clearance : en.clearance;
            } else {
                allTab?.forEach(tab => tab.classList.add("active"));
                clearanceTab?.forEach(tab => tab.classList.remove("active"));
                document.title = state.LANG === "AR" ? ar.allProducts : en.allProducts;
            }
        }
    }, [itemType]);

    const handleApplyFilters = () => {

        if (isProductsPage) {
            const query = new URLSearchParams();
            const params = new URLSearchParams(window.location.search);

            if (fromPrice) query.set('fromPrice', fromPrice);
            if (toPrice) query.set('toPrice', toPrice);
            if (fromAge) query.set('fromAge', fromAge);
            if (toAge) query.set('toAge', toAge);
            if (itemType) query.set('itemType', itemType);
            if (itemStatus) query.set('itemStatus', itemStatus);
            if (sortItem) query.set('sort', sortItem);
            if (pageSizeItem) query.set('pageSize', pageSizeItem);
            if (searchTerm) query.set('search', searchTerm);
            if (brand && brand.length > 0) query.set('brand', brand.join(','));
            if (category && category.length > 0) query.set('category', category.join(','));
            if (catalog && catalog.length > 0) query.set('catalog', catalog.join(','));
            if (params.has('page')) {
                const pageValue = params.get('page');
                query.set('page', pageValue);
            }
            // Clear pagination token when filters change
            Cookies.remove('pagesToken');
            // Push new query to URL
            router.push(`/products?${query.toString()}`);
        } else {
            const searchParams = new URLSearchParams(); // This will be used for building query
            let searchItems = '';

            if (fromAge) searchParams.append('fromAge', fromAge);
            if (toAge) searchParams.append('toAge', toAge);
            if (itemType) searchParams.append('itemType', itemType);
            if (itemStatus) searchParams.append('itemStatus', itemStatus);
            if (sortItem) searchParams.append('sort', sortItem);
            if (pageSizeItem) searchParams.append('pageSize', pageSizeItem);
            if (searchTerm) searchParams.append('search', searchTerm);
            if (brand && brand.length > 0) searchParams.append('brand', brand.join(','));
            if (category && category.length > 0) searchParams.append('category', category.join(','));
            if (catalog && catalog.length > 0) searchParams.append('catalog', catalog.join(','));
            // console.log(searchParams.toString());

            searchItems = `${searchParams.toString()}`;
            Cookies.set('store_filters', searchItems);
            onClose && onClose()
        }
    };

    const handleClearFilter = (range) => {
        if (range) {
            const query = new URLSearchParams(window.location.search);
            if (range === "price") {
                query.delete('fromPrice');
                query.delete('toPrice');
                setFromPrice(0);
                setToPrice(0);
            } else if (range === "age") {
                query.delete('fromAge');
                query.delete('toAge');
                setFromAge(0);
                setToAge(0);
            }
            router.push(`/products?${query.toString()}`);
            return;
        }

        if (isProductsPage) {
            const query = new URLSearchParams();
            Cookies.remove('pagesToken');
            query.set('page', '1');
            // Reset all filters
            setFromPrice(0);
            setToPrice(0);
            setFromAge(0);
            setToAge(0);
            setItemType("");
            setItemStatus("");
            setBrand([]);
            setCategory([]);
            setCatalog([]);

            setSelectedCategoriesOptions([]);
            setSelectedCatalogsOptions([]);
            resetUpperFilters && resetUpperFilters()

            // Push clean URL
            router.push('/products?itemStatus=AVAILABLE');
        } else {
            Cookies.remove('store_filters');
            onClose && onClose()
        }

    }

    const changePriceFrom = (from) => {
        setFromPrice(from);
    }

    const changePriceTo = (to) => {
        setToPrice(to)
    }

    const changeAgeFrom = (from) => {
        setFromAge(from);
    }

    const changeAgeTo = (to) => {
        setToAge(to)
    }

    const changeSingleItem = (name, value) => {
        if (name === "itemType") {
            setItemType(value)
        } else if (name === "itemStatus") {
            setItemStatus(value)
        }
    }

    const changeMultiItem = (name, value) => {
        if (name === "categories") {
            setCategory(value.map(item => item.value))
        } else if (name === "catalog") {
            setCatalog(value.map(item => item.value))
        }
    }

    const parentOptions = (st, options) => {
        setBrand(options)
        fetchCategoriesOptions(st, options)
    }

    // get all options
    const fetchCategoriesOptions = async (ch, brands = []) => {
        try {
            if (!isProductsPage) {
                const res = await axios.get(`${BASE_API}${categoriesEndpoint}&brand=${brands?.join(',')}&lang=${lang}&token=${Cookies.get('token')}`, {});
                setCategoriesAllOptions(res.data);
                const arr = res.data.filter(item => category.includes(item.categoryId));
                let selected = [];
                arr?.map(item => (
                    selected.push({
                        label: item.description,
                        value: item.categoryId
                    })
                ))
                setSelectedCategoriesOptions(selected)
            } else {
                setCategoriesAllOptions(filtersSections?.categories);
                const arr = filtersSections?.categories?.filter(item => category.includes(item.categoryId));
                let selected = [];
                arr?.map(item => (
                    selected.push({
                        label: item.description,
                        value: item.categoryId
                    })
                ))
                setSelectedCategoriesOptions(selected)
            }
            if (!ch) {
                setCategoryOpen(true)
            }
        } catch (error) {
            error.status === 401 && router.push("/");
        }

    }

    const fetchCatalogsOptions = async () => {
        const lang = Cookies.get('lang') || 'AR';
        try {
            if (!isProductsPage) {
                const res = await axios.get(`${BASE_API}${catalogEndpoint}&lang=${lang}&token=${Cookies.get('token')}`, {});
                setCatalogsAllOptions(res.data);
                const arr = res?.data?.catalogs?.filter(item => catalog.includes(item.code));
                let selected = [];
                arr?.map(item => (
                    selected.push({
                        label: item.name,
                        value: item.categoryId
                    })
                ))
                setCatalogOpen(true)
                setSelectedCatalogsOptions(selected)
            } else {
                setCatalogsAllOptions(filtersSections?.catalogs);
                const arr = filtersSections?.catalogs?.filter(item => catalog.includes(item.code));
                let selected = [];
                arr?.map(item => (
                    selected.push({
                        label: item.name,
                        value: item.categoryId
                    })
                ))
                setCatalogOpen(true)
                setSelectedCatalogsOptions(selected)
            }

        } catch (error) {
            error.status === 401 && router.push("/");
        }
    }

    useEffect(() => {
        fetchCatalogsOptions()
        if (brand.length > 0) {
            parentOptions(false, brand);
        }
        // if(brand.length){
        // }else {
        fetchCategoriesOptions(true, brand)
        // }
    }, [filtersSections])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const entries = Array.from(params.entries());

        // Exclude default filter like itemStatus=AVAILABLE
        const meaningfulParams = entries.filter(([key, value]) => {
            return !(key === 'itemStatus' && value === 'AVAILABLE');
        });

        if (meaningfulParams.length > 1) {
            setShowClearButton(true);
        } else {
            setShowClearButton(false);
        }
    }, [useParams.toString()]);

    useEffect(() => {
        // Cleanup on unmount: remove 'active' class from header links
        return () => {
            document.querySelectorAll(".allProductsTab, .clearanceTab").forEach(tab => {
                tab.classList.remove("active");
            });
        };
    }, []);

    useEffect(() => {
        const filterstatus = Cookies.get('filterstatus');
        if (isProductsPage && filterstatus && filterstatus === "filter") {
            handleApplyFilters();
        }
    }, [itemType, brand, catalog, category, itemStatus, sortItem, pageSizeItem]);

    return (
        <>
            <div className={`filter-bar card ${isProductsPage ? "filter-products-page" : "hero-filter"}`}>
                <div className="filter-header flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${count.hasAny ? "has-filters" : ""}`}>
                        {
                            count.count > 0 ? <span className="red-filter">{count.count}</span> : null
                        }
                        <i className="icon-filter-search"></i>
                        <span className='filter-title'>{translation.filterResults}</span>
                    </div>
                    {
                        <div className="close-filter">
                            <i className="icon-multiplication-sign cursor-pointer" onClick={() => {
                                if (onClose) {
                                    onClose();
                                }
                                const filterElement = document.querySelector(".filter-products-page");
                                if (filterElement) {
                                    filterElement.classList.remove("active");
                                    document.documentElement.classList.remove("html-overflow");
                                }
                            }}></i>
                        </div>

                    }
                </div>
                <div className="filter-body">
                    {
                        filtersSections ? (
                            <>
                                {
                                    filtersSections?.brands?.length > 0 && (
                                        <BrandsFilters selected={brand} parentOptions={parentOptions} brandsOptions={filtersSections?.brands} isFiltersPage={true} />
                                    )
                                }
                                {
                                    categoriesAllOptions?.length > 0 && (
                                        // categoryOpen && (
                                        <Select2Form title={translation.categories} options={categoriesAllOptions} name="categories" handleMultiItem={changeMultiItem} initSelected={selectedCategoriesOptions} initiallyOpen={selectedCategoriesOptions.length > 0} />
                                        // )
                                    )
                                }
                                {
                                    filtersSections?.types?.length > 0 && (
                                        <FilterSingleItem title={translation.sectors} selected={itemType} options={filtersSections?.types} name="itemType" handleSingleItem={changeSingleItem} />
                                    )
                                }

                                <Suspense fallback={<div>Loading...</div>}>
                                    <MultiRangeSlider title={translation.priceRange} min={Math.floor(parseFloat(filtersSections?.price_min)) || 0} max={Math.floor(parseFloat(filtersSections?.price_max)) || 1600} selectedFrom={fromPrice} selectedTo={toPrice} handlePriceFrom={changePriceFrom} handlePriceTo={changePriceTo} isProductsPage={isProductsPage} onSubmitRange={handleApplyFilters} onClearRange={handleClearFilter} />
                                </Suspense>

                                {
                                    filtersSections?.age_min && filtersSections?.age_max && (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <MultiRangeSliderAge title={translation.ageRange} min={Math.floor(parseFloat(filtersSections?.age_min))} max={Math.floor(parseFloat(filtersSections?.age_max))} selectedFrom={fromAge} selectedTo={toAge} handleAgeFrom={changeAgeFrom} handleAgeTo={changeAgeTo} isProductsPage={isProductsPage} onSubmitRange={handleApplyFilters} onClearRange={handleClearFilter} />
                                        </Suspense>
                                    )
                                }

                                {
                                    catalogsAllOptions?.length > 0 && (
                                        // catalogOpen && (
                                        <Select2Form title={translation.catalogs} options={catalogsAllOptions} name="catalog" handleMultiItem={changeMultiItem} initSelected={selectedCatalogsOptions} initiallyOpen={selectedCatalogsOptions.length > 0} isProductsPage={isProductsPage} />
                                        // )
                                    )
                                }
                                <FilterSingleItem title={translation.availablity} selected={itemStatus} options={StatusOptions} name="itemStatus" handleSingleItem={changeSingleItem} />
                                {showClearButton && (
                                    <div className="action-btns flex gap-3 mt-4">
                                        {/* <button className="primary-btn flex-1" onClick={handleApplyFilters}>{translation.apply}</button> */}
                                        <button className="gray-btn flex-1" onClick={() => handleClearFilter(null)}>
                                            {translation.clear}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : !isProductsPage ? (
                            <>
                                <BrandsFilters selected={brand} parentOptions={parentOptions} />
                                {
                                    categoryOpen && (
                                        <Select2Form title={translation.categories} options={categoriesAllOptions} name="categories" handleMultiItem={changeMultiItem} initSelected={selectedCategoriesOptions} initiallyOpen={selectedCategoriesOptions.length > 0} />
                                    )
                                }
                                <FilterSingleItem title={translation.sectors} selected={itemType} options={itemTypeOptions} name="itemType" handleSingleItem={changeSingleItem} />
                                <Suspense fallback={<div>Loading...</div>}>
                                    <MultiRangeSlider title={translation.priceRange} min={0} max={1600} selectedFrom={fromPrice} selectedTo={toPrice} handlePriceFrom={changePriceFrom} handlePriceTo={changePriceTo} isProductsPage={false} />
                                </Suspense>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <MultiRangeSliderAge title={translation.ageRange} min={0} max={18} selectedFrom={fromAge} selectedTo={toAge} handleAgeFrom={changeAgeFrom} handleAgeTo={changeAgeTo} isProductsPage={false} />
                                </Suspense>
                                {
                                    catalogOpen && (
                                        <Select2Form title={translation.catalogs} options={catalogsAllOptions} name="catalog" handleMultiItem={changeMultiItem} initSelected={selectedCatalogsOptions} initiallyOpen={selectedCatalogsOptions.length > 0} />
                                    )
                                }
                                <FilterSingleItem title={translation.availablity} selected={itemStatus} options={StatusOptions} name="itemStatus" handleSingleItem={changeSingleItem} />

                                <div className="action-btns flex gap-3 mt-4">
                                    <button className="primary-btn flex-1" onClick={handleApplyFilters}>{translation.apply}</button>
                                    {showClearButton && (
                                        <button className="gray-btn flex-1" onClick={() => handleClearFilter(null)}>
                                            {translation.clear}
                                        </button>
                                    )}
                                </div>
                            </>
                        ) :
                            <div className='text-center py-4'>
                                <span className="filters-loader"></span>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}
