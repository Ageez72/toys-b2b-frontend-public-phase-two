'use client';

import { useState, useEffect } from 'react';
import { addToCart, getCart } from '@/actions/utils';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { showSuccessToast, showErrorToast } from '@/actions/toastUtils';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AddToCart({ item, hasTitle = false }) {
  const [count, setCount] = useState(1);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
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

  const handleAddToCart = async () => {
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
      return;
    }

    setCount(1);

    const storedCart = getCart();
    if (storedCart) {
      dispatch({ type: 'STORED-ITEMS', payload: storedCart });
    }

    try {
      // Send updated cart to backend
      const res = await axios.post(
        `${BASE_API}${endpoints.products.setCart}?lang=${lang}&token=${Cookies.get('token')}`,
        {
          "items": storedCart
        }
      );

      // console.log(res.data);
      showSuccessToast(translation.addedToCart, lang, translation.success);
    } catch (error) {
      console.error(error);
      showErrorToast(translation.defaultError, lang, translation.error);
    }
  };


  return (
    <>

      <div className="isDesktop">
        <div className="add-to-cart grid grid-cols-2 gap-3 w-full mt-3 lg-mt-0">
          <div className="product-card-quantity flex items-center gap-1 flex-1">
            <button onClick={decrease} className="btn btn-secondary w-fit" aria-label='Decrease quantity'>
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
            <button onClick={increase} className="btn btn-secondary w-fit" aria-label='Increase quantity'>
              <i className="icon-add"></i>
            </button>
          </div>
          <div className="isDesktop flex-1">
            <button
              onClick={handleAddToCart}
              className={`w-full primary-btn w-1/2 add-to-cart-btn ${count + existingQty > 10 ? 'disabled' : null}`}
              disabled={count + existingQty > 10}
            >
              <span className='isDesktop'>
                {translation.addCart}
              </span>
            </button>
          </div>
          <div className="mob-icon isMobile">
            <button
              onClick={handleAddToCart}
              className={`primary-btn w-1/2 add-to-cart-btn ${count + existingQty > 10 ? 'disabled' : null}`}
              disabled={count + existingQty > 10}
            >
              <i className="icon-bag-happy"></i>
              {hasTitle && <span>{translation.mobile.addToCart}</span>}
            </button>
          </div>
        </div>
      </div>
      <div className="isMobile">
        <div className="add-to-cart flex items-center gap-3 w-full mt-3 lg-mt-0">
          <div className="product-card-quantity flex items-center gap-1 w-50">
            <button onClick={decrease} className="btn btn-secondary w-fit" aria-label='Decrease quantity'>
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
            <button onClick={increase} className="btn btn-secondary w-fit" aria-label='Increase quantity'>
              <i className="icon-add"></i>
            </button>
          </div>
          <div className="isDesktop w-50">
            <button
              onClick={handleAddToCart}
              className={`w-full primary-btn w-1/2 add-to-cart-btn ${count + existingQty > 10 ? 'disabled' : null}`}
              disabled={count + existingQty > 10}
            >
              <span className='isDesktop'>
                {translation.addCart}
              </span>
            </button>
          </div>
          <div className="mob-icon isMobile">
            <button
              onClick={handleAddToCart}
              className={`primary-btn w-1/2 add-to-cart-btn ${count + existingQty > 10 ? 'disabled' : null}`}
              disabled={count + existingQty > 10}
            >
              <i className="icon-bag-happy"></i>
              {hasTitle && <span>{translation.mobile.addToCart}</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
