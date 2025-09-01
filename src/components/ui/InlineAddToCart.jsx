'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getCart } from '@/actions/utils';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';
import { showWarningToast, showErrorToast } from '@/actions/toastUtils';

export default function InlineAddToCart({ itemId, avlqty, onQtyChange, onRefresh }) {
  const [count, setCount] = useState(0);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar); // default fallback

  const lang = state.LANG || "EN";

  const MAX_QTY = 10;

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
  }, [state.LANG]);

  useEffect(() => {
    const cart = getCart();
    const item = cart.find(i => i.item === itemId);
    if (item) setCount(parseInt(item.qty));
  }, [itemId]);

  const updateCart = (newQty) => {
    let cart = getCart();
    const index = cart.findIndex(i => i.item === itemId);

    if (newQty <= 0) {
      if (index !== -1) cart.splice(index, 1);
    } else {
      if (index !== -1) {
        cart[index].qty = newQty.toString();
      } else {
        cart.push({ item: itemId, qty: newQty.toString() });
      }
    }

    Cookies.set('cart', JSON.stringify(cart), { expires: 7, path: '/' });
    const storedCart = getCart();
    if (storedCart) dispatch({ type: "STORED-ITEMS", payload: storedCart });

    setCount(newQty);
    if (onQtyChange) onQtyChange();
  };

  const removeFromCart = () => {
    let cart = getCart();
    const newCart = cart.filter(item => item.item !== itemId);
    Cookies.set('cart', JSON.stringify(newCart), { expires: 7, path: '/' });
    const storedCart = getCart();
    if (storedCart) dispatch({ type: "STORED-ITEMS", payload: storedCart });

    setCount(0);
    if (onQtyChange) onQtyChange();
    onRefresh && onRefresh();

    showErrorToast(translation.itemRemoved, lang, translation.warning);
  };

  const increase = () => {
    const newQty = count + 1;

    if (newQty > 10) return; // Hard limit: max 10 units per item

    if (newQty > avlqty) {
      const msg = state.LANG === "EN"
        ? `Only ${avlqty} item(s) are available in total.`
        : `متوفر فقط ${avlqty} قطعة من هذا المنتج.`;
      showWarningToast(msg, state.LANG, translation.warning);
    }

    if (newQty > avlqty) return; // Prevent going beyond available qty

    updateCart(newQty);
    onRefresh && onRefresh();
  };

  const decrease = () => {
    updateCart(count > 0 ? count - 1 : 0);
    onRefresh && onRefresh();
  };

  const handleManualChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;

    if (value > avlqty) {
      const msg = lang === "EN"
        ? `Only ${avlqty} item(s) are available in total.`
        : `متوفر فقط ${avlqty} قطعة من هذا المنتج.`;
      showWarningToast(msg, lang, translation.warning);
      value = avlqty;
    }

    if (value > 10) {
      value = 10;
    }

    if (value < 0) value = 0;

    updateCart(value);
    onRefresh && onRefresh();
  };

  return (
    <div className="add-to-cart flex gap-3">
      <div className="product-card-quantity flex items-center gap-1 w-3/4">
        <button onClick={decrease} className="btn btn-secondary w-fit">
          <i className="icon-minus"></i>
        </button>

        <input
          type="number"
          className="min-w-[50px] w-[60px] text-center rounded px-1 py-0.5"
          value={count}
          min={0}
          max={Math.min(avlqty, MAX_QTY)}
          onChange={handleManualChange}
        />

        <button
          onClick={increase}
          className="btn btn-secondary w-fit"
        // disabled={count >= Math.min(avlqty, MAX_QTY)}
        >
          <i className="icon-add"></i>
        </button>
      </div>

      <div
        className="w-1/4 text-center remove-cart-item flex items-center justify-center cursor-pointer"
        onClick={removeFromCart}
        title="Remove item"
      >
        <i className="icon-trash text-red-500"></i>
      </div>
    </div>
  );
}
