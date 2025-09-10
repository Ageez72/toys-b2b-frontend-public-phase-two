'use client';
import React, { useState } from 'react';
import * as XLSX from "xlsx";
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
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_API, endpoints } from "../../../constant/endpoints";

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

  // ------------------------
  // Import Excel Handler
  // ------------------------
  const fetchProductBySku = async (sku) => {
  try {
    const token = Cookies.get("token");
    const lang = Cookies.get("lang") || "AR";

    const url = `${BASE_API}${endpoints.products.list}&search=${encodeURIComponent(
      sku
    )}&pageSize=1&itemStatus=AVAILABLE&lang=${lang}&token=${token}`;

    const res = await axios.get(url);
    return res.data?.items?.[0] || null;
  } catch (err) {
    console.error("❌ Error fetching product by SKU:", sku, err);
    return null;
  }
};
const handleImport = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);    

    const importedItems = [];

    for (let row of jsonData) {
      const sku = row.sku;
      const qty = row.quantity;      

      if (!sku) continue;

      const product = await fetchProductBySku(sku);      

      if (product) {
        importedItems.push({
          ...product,
          qty,
          total: product.priceAfterDisc * qty,
          isConfirmed: true,
        });
      }
    }

    // Merge into bulkItems
    setBulkItems((prev) => [...prev, ...importedItems, { isConfirmed: false }]);
  };

  reader.readAsArrayBuffer(file);
};

  return (
    <Dialog open={open} onClose={onClose} className="relative z-999">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-99999999 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 w-full">
          <DialogPanel className="relative add-bulk-modal transform overflow-hidden rounded-lg bg-white text-start shadow-xl transition-all my-25">
            <div className="p-32">
              <h2 className="modal-title">{translation.oneClick}</h2>
              <div className="add-bulk-table">
                {/* Table Head */}
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

                {/* Table Body */}
                <div className="table-body">
                  {bulkItems.map((item, index) => (
                    <div key={index} className="product-row flex items-center gap-4">
                      <div className="name-qty flex items-center justify-between">
                        <div className="name">
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
                          <div className="item flex-1">{item.id}</div>
                          <div className="item flex-1">
                            {item.status === 'AVAILABLE' ? translation.available : translation.notAvailable}
                          </div>
                          <div className="item flex-1">{item.avlqty > 10 ? 10 : item.avlqty}</div>
                          <div className="item flex-1">{item.price?.toFixed(2)} {translation.jod}</div>
                          <div className="item flex-1">{item.total?.toFixed(2)} {translation.jod}</div>
                          <div className="item delete">
                            <button className="delete-btn" onClick={() => removeRow(index)}>
                              <i className="icon-minus"></i>
                              <span readOnly>dd</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="action-btns flex gap-3 mt-4">
                  <div>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      id="importExcel"
                      style={{ display: "none" }}
                      onChange={handleImport}
                    />
                    <button
                      className="primary-btn"
                      onClick={() => document.getElementById("importExcel").click()}
                    >
                      Import
                    </button>
                  </div>
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
