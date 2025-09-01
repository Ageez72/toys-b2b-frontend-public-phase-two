'use client';

import { useState, useEffect } from 'react';
import { addToCart, getCart } from '@/actions/utils';
import { useAppContext } from '../../../context/AppContext';
import SearchInput from './SearchInput';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { Toaster } from 'react-hot-toast';
import { showSuccessToast, showWarningToast, showErrorToast } from '@/actions/toastUtils';

export default function QuickAdd({ openSidebar }) {
    const [count, setCount] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);
    const [resetSearch, setResetSearch] = useState(false);
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const lang = state.LANG;

    const [translation, setTranslation] = useState(ar);
    useEffect(() => {
        setTranslation(state.LANG === 'EN' ? en : ar);
    }, [state.LANG]);

    const handleQuantityChange = (e) => {
        let value = parseInt(e.target.value, 10);

        if (isNaN(value)) {
            setCount('');
            return;
        }

        // Clamp the value between 1 and 10
        if (value < 1) value = 1;
        if (value > 10) value = 10;

        setCount(value);
    };

    const getSelectedProduct = (item) => {
        setSelectedItem(item);
    };

    const handleAddToCart = () => {
        if (!selectedItem?.id) {
            showWarningToast(translation.chooseItem, lang, translation.warning);
            return;
        }

        if (!count) {
            showWarningToast(translation.chooseQty, lang, translation.warning);
            return;
        }

        const result = addToCart({
            id: selectedItem.id,
            item: selectedItem.id,
            qty: count.toString(),
            image: selectedItem.images?.['800']?.main,
            name: selectedItem.name,
            price: selectedItem.price,
            avlqty: selectedItem.avlqty,
        });

        if (!result.success) {
            showErrorToast(result.message || translation.defaultError, lang, translation.error);
        } else {
            setCount('');
            setSelectedItem([]);
            setResetSearch(true);
            const storedCart = getCart();
            if (storedCart) {
                dispatch({ type: 'STORED-ITEMS', payload: storedCart });
            }
            showSuccessToast(translation.addedToCart, lang, translation.success);
        }
    };

    return (
        <>
            <div className="quick-add-container flex">
                <div className="search-input form-group mb-0">
                    <div className="relative h-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <i className="icon-search-normal"></i>
                        </div>
                        <div
                            className="absolute inset-y-0 start-0 flex items-center pe-3.5 password-icon"
                            onClick={() => {
                                openSidebar();
                                document.documentElement.classList.add('html-overflow');
                            }}
                        >
                            <i className="icon-setting-4"></i>
                        </div>
                        <SearchInput
                            bulk={false}
                            onCollectQuickAdd={getSelectedProduct}
                            resetTrigger={resetSearch}
                            onResetDone={() => setResetSearch(false)}
                        />
                    </div>
                </div>

                <div className="quantatity-container flex items-center gap-2 card">
                    <div className="form-group mb-0">
                        <div className="relative">
                            <input
                                className="p-2.5"
                                placeholder={translation.qty}
                                value={count}
                                type="number"
                                min="0"
                                max="10"
                                maxLength={10}
                                onChange={handleQuantityChange}
                            />
                        </div>
                    </div>
                    <button className="primary-btn" onClick={handleAddToCart}>
                        <i className="icon-plus"></i>
                        <span>{translation.add}</span>
                    </button>
                </div>
            </div>
        </>
    );
}
