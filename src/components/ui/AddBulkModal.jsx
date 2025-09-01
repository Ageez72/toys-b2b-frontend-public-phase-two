'use client';
import React, { useState } from 'react';
import SearchInput from './SearchInput';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel
} from '@headlessui/react';
import { addToCart, getCart } from '@/actions/utils';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';
import { showSuccessToast, showWarningToast, showErrorToast } from '@/actions/toastUtils';

export default function AddBulkModal({ open, onClose }) {
  const [bulkItems, setBulkItems] = useState([{ isConfirmed: false }]);
  const [resetTriggers, setResetTriggers] = useState({});
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const translation = state.LANG === "EN" ? en : ar;
  const lang = state.LANG || 'EN';

  const showToastError = (message) => {
    showWarningToast(message, lang, translation.warning);
  };

  const showDoneToast = (message) => {
    showSuccessToast(message, lang, translation.success);
  };

  const handleProductSelect = (selectedItem, index) => {
    const exists = bulkItems.find(item => item.id === selectedItem.id);
    if (exists) {
      showErrorToast(translation.productAlreadyAdded, lang, translation.error);
      setResetTriggers(prev => ({ ...prev, [index]: true }));
      return;
    }

    const updated = [...bulkItems];
    updated[index] = {
      ...selectedItem,
      qty: 1,
      total: selectedItem.price * 1,
      isConfirmed: true
    };

    setBulkItems([...updated, { isConfirmed: false }]);
  };

  const handleResetDone = (index) => {
    setResetTriggers(prev => ({ ...prev, [index]: false }));
  };

  const updateQty = (index, qty) => {
    let parsedQty = Math.max(0, parseInt(qty || 0));
    const updated = [...bulkItems];
    const maxQty = updated[index].avlqty;

    if (parsedQty > maxQty) {
      showErrorToast(`${translation.quantityExceeded} ${maxQty}`, lang, translation.error);
      parsedQty = maxQty;
    }

    updated[index].qty = parsedQty;
    updated[index].total = parsedQty * updated[index].price;
    setBulkItems(updated);
  };

  const removeRow = (index) => {
    const updated = [...bulkItems];
    updated.splice(index, 1);
    setBulkItems(updated);
  };

  const handleSubmit = () => {
    const hasInvalidItem = bulkItems.some(item =>
      item.isConfirmed &&
      (!item.qty || item.qty <= 0 || item.qty > item.avlqty)
    );

    if (hasInvalidItem) {
      showToastError(translation.quantityValidationFailed || "Please check quantities before submitting.");
      return;
    }

    const selectedItems = bulkItems.filter(item => item.isConfirmed);

    if (selectedItems.length === 0) {
      showWarningToast(translation.noProductsSelected || "Please add at least one product.", lang, translation.warning);
      return;
    }

    for (let i = 0; i < selectedItems.length; i++) {
      const selectedItem = selectedItems[i];
      addToCart({
        item: selectedItem.id,
        qty: selectedItem.qty.toString(),
        image: selectedItem.images['800'].main,
        name: selectedItem.name,
        price: selectedItem.price,
        avlqty: selectedItem.avlqty
      });
    }

    const storedCart = getCart();
    if (storedCart) {
      dispatch({ type: 'STORED-ITEMS', payload: storedCart });
    }

    showDoneToast(translation.addedToCart);
    setBulkItems([{ isConfirmed: false }]);
    onClose();
  };

  const isSubmitDisabled = bulkItems.some(item =>
    item.isConfirmed && (!item.qty || item.qty <= 0 || item.qty > item.avlqty)
  );

  return (
    <Dialog open={open} onClose={onClose} className="relative z-999">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-99999999 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 w-full">
          <DialogPanel className="relative add-bulk-modal transform overflow-hidden rounded-lg bg-white text-start shadow-xl transition-all my-25">
            <div className="p-32">
              <h2 className="modal-title">{translation.oneClick}</h2>
              <div className="add-bulk-table">
                <div className="table-head flex gap-4">
                  <div className="name-qty flex items-center justify-between">
                    <div className="name mb-3 lg:mb-0">{translation.name}</div>
                    <div className="qty">{translation.qty}</div>
                  </div>
                  <div className="info flex items-center justify-between gap-1">
                    <div className="item flex-1">{translation.productNumber}</div>
                    <div className="item flex-1">{translation.availablity}</div>
                    <div className="item flex-1">{translation.totalItems}</div>
                    <div className="item flex-1">{translation.itemPrice}</div>
                    <div className="item flex-1">{translation.totalPrice}</div>
                    <div className="item delete"></div>
                  </div>
                </div>

                <div className="table-body">
                  {bulkItems.map((item, index) => (
                    <div key={index} className="product-row flex items-center gap-4">
                      <div className="name-qty flex items-center justify-between">
                        <div className="name">
                          <label className="mobile-title hidden">{translation.name}</label>
                          {item.isConfirmed ? (
                            <input
                              type="text"
                              value={item.name}
                              title={item.name}
                              readOnly
                              className="w-full mobile-box"
                            />
                          ) : (
                            <SearchInput
                              bulk={true}
                              onCollectBulkItems={(selectedItem) =>
                                handleProductSelect(selectedItem, index)
                              }
                              pageSize="10"
                              resetTrigger={resetTriggers[index] || false}
                              onResetDone={() => handleResetDone(index)}
                            />
                          )}
                        </div>
                        <div className="qty">
                          <label className="mobile-title hidden">{translation.qty}</label>
                          <input
                            type="number"
                            min="1"
                            placeholder={translation.qty}
                            value={item.qty || ''}
                            onChange={(e) =>
                              updateQty(index, parseInt(e.target.value || '0'))
                            }
                            className="w-full mobile-box"
                            disabled={!item.isConfirmed}
                          />
                        </div>
                      </div>

                      {item.isConfirmed && (
                        <div className="info flex items-center justify-between">
                          <div className="item flex-1">
                            <label className="mobile-title hidden">{translation.productNumber}</label>
                            <span className="mobile-box">{item.id}</span>
                          </div>
                          <div className="item flex-1">
                            <label className="mobile-title hidden">{translation.availablity}</label>
                            <span className="mobile-box">
                              {item.status === 'AVAILABLE' ? translation.available : translation.notAvailable}
                            </span>
                          </div>
                          <div className="item flex-1">
                              <label className="mobile-title hidden">{translation.totalItems}</label>
                              <span className="mobile-box">{item.avlqty > 10 ? 10 : item.avlqty}</span>
                            </div>
                          <div className="item flex-1">
                            <label className="mobile-title hidden">{translation.itemPrice}</label>
                            <span className="mobile-box">
                              {item.price?.toFixed(2)} {translation.jod}
                            </span>
                          </div>
                          <div className="item flex-1">
                            <label className="mobile-title hidden">{translation.totalPrice}</label>
                            <span className="mobile-box">
                              {item.total?.toFixed(2)} {translation.jod}
                            </span>
                          </div>
                          <div className="item delete">
                            <button
                              className="delete-btn"
                              onClick={() => removeRow(index)}
                            >
                              <i className="icon-minus"></i>
                              <span className="mobile-title hidden">{translation.delete}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="action-btns flex gap-3 mt-4">
                  <button
                    className={`primary-btn ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                  >
                    {translation.add}
                  </button>
                  <button className="gray-btn" onClick={onClose}>
                    {translation.cancel}
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
