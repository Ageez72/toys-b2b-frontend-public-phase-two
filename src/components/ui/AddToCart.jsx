'use client';

import { useState, useEffect } from 'react';
import { addToCart, getCart } from '@/actions/utils';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { showSuccessToast, showErrorToast } from '@/actions/toastUtils';

export default function AddToCart({ item }) {
  const [count, setCount] = useState(1);
  const { state = {}, dispatch = () => {} } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar); // default fallback

  const lang = state.LANG || 'EN';

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
  }, [state.LANG]);

  // Get existing qty of this item from the cart
  const existingQty = (() => {
    const cart = getCart();
    const existing = cart.find(obj => obj.item === item.id);
    return existing ? parseInt(existing.qty) : 0;
  })();

  const increase = () => {
    if (count + existingQty < 10) {
      setCount(prev => prev + 1);
    }
  };

  const decrease = () => {
    setCount(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    if (value + existingQty > 10) value = 10 - existingQty;
    setCount(value);
  };

  const handleAddToCart = () => {
    const result = addToCart({
      id: item.id,
      item: item.id,
      qty: count.toString(),
      image: item.images?.['800']?.main,
      name: item.name,
      price: item.price,
      avlqty: item.avlqty
    });

    if (!result.success) {
      showErrorToast(result.message || translation.defaultError, lang, translation.error);
    } else {
      setCount(1);
      const storedCart = getCart();
      if (storedCart) {
        dispatch({ type: 'STORED-ITEMS', payload: storedCart });
      }
      showSuccessToast(translation.addedToCart, lang, translation.success);
    }
  };

  return (
    <div className="add-to-cart flex items-center gap-3 w-full">
      <div className="product-card-quantity flex items-center gap-1 w-1/2">
        <button onClick={decrease} className="btn btn-secondary w-fit">
          <i className="icon-minus"></i>
        </button>
        <input
          className="w-fit text-center"
          type="number"
          min={1}
          max={10 - existingQty}
          value={count}
          onChange={handleQuantityChange}
        />
        <button onClick={increase} className="btn btn-secondary w-fit">
          <i className="icon-add"></i>
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className={`primary-btn w-1/2 add-to-cart-btn ${count + existingQty > 10 ? 'disabled' : null}`}
        disabled={count + existingQty > 10}
      >
        {translation.addCart}
      </button>
    </div>
  );
}
