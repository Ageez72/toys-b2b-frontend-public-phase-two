'use client';
import React, { useState } from 'react';
import * as XLSX from "xlsx";
import SearchInput from './SearchInput';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
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
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const [importPopup, setImportPopup] = useState({
    open: false,
    success: false,
    message: "",
  });
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
    const maxQty = updated[index].avlqty > 10 ? 10 : updated[index].avlqty;

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

  const handleSubmit = async () => {
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
      // Send updated cart to backend
      const res = await axios.post(
        `${BASE_API}${endpoints.products.setCart}?lang=${lang}&token=${Cookies.get('token')}`,
        {
          "items": storedCart
        }
      );
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

      const url = `${BASE_API}${endpoints.products.list}&id=${encodeURIComponent(
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
    const fileInput = e.target;
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const header = rows[0].map((h) => String(h).toLowerCase().trim());
        const skuIndex = header.findIndex((h) => h === "sku");
        const qtyIndex = header.findIndex((h) => h === "quantity");

        if (skuIndex === -1 || qtyIndex === -1) {
          showToastError(translation.errorImportingFile);
          setIsImporting(false);
          return;
        }

        const skuQtyMap = {};
        rows.slice(1).forEach((row) => {
          const rawSku = row[skuIndex];
          const rawQty = row[qtyIndex];
          if (!rawSku) return;

          const sku = String(rawSku).trim().toUpperCase();
          const qty = Number(rawQty) || 0;
          if (qty <= 0) return;

          skuQtyMap[sku] = (skuQtyMap[sku] || 0) + qty;
        });

        const skus = Object.keys(skuQtyMap);
        if (skus.length === 0) {
          showToastError(translation.noProductsSelected);
          setIsImporting(false);
          return;
        }

        const productFetches = skus.map((sku) => fetchProductBySku(sku));
        const fetchedProducts = await Promise.all(productFetches);

        const importedItems = [];
        const errors = [];
        let successCount = 0;

        for (let i = 0; i < skus.length; i++) {
          const sku = skus[i];
          const product = fetchedProducts[i];
          const qty = skuQtyMap[sku];

          if (!product) {
            errors.push({
              index: i + 1, // الصنف رقم
              sku,
              reason: "غير متوفر أو رقم المنتج غير صحيح",
            });
            continue;
          }

          const unitPrice = Number(product.price);          

          let finalQty = Number(qty);
          const maxAllowed = Math.min(product.avlqty, 10);
          if (finalQty > maxAllowed) {
            showWarningToast(`${translation.quantityExceeded} ${maxAllowed}`, lang, translation.warning);
            finalQty = maxAllowed;
          }

          importedItems.push({
            ...product,
            qty: finalQty,
            unitPrice,
            total: unitPrice * finalQty,
            isConfirmed: true,
          });
          successCount++;
        }

        // merge with state
        setBulkItems((prev) => {
          const confirmed = prev.filter((it) => it.isConfirmed).map((it) => ({ ...it, qty: Number(it.qty || 0) }));

          for (const newItem of importedItems) {
            const idx = confirmed.findIndex((it) => it.id === newItem.id);
            if (idx >= 0) {
              const oldQty = Number(confirmed[idx].qty || 0);
              let updatedQty = oldQty + newItem.qty;
              const maxAllowed = Math.min(confirmed[idx].avlqty, 10);
              if (updatedQty > maxAllowed) {
                showWarningToast(`${translation.quantityExceeded} ${maxAllowed}`, lang, translation.warning);
                updatedQty = maxAllowed;
              }
              confirmed[idx].qty = updatedQty;              
              const unit = Number(confirmed[idx].unitPrice ?? confirmed[idx].price ?? newItem.unitPrice ?? 0);
              confirmed[idx].total = unit * updatedQty;
            } else {
              confirmed.push(newItem);
            }
          }

          return [...confirmed, { isConfirmed: false }];
        });

        // ✅ Build summary
        const summaryArray = [
          translation.importSummary.success
            .replace("{success}", successCount)
            .replace("{errors}", errors.length),
          ...errors.map((err) =>
            translation.importSummary.errorItem.replace("{sku}", err.sku)
          ),
        ];


        setImportSummary(summaryArray);
        setIsImporting(false);
        if (successCount > 0) {
          setImportPopup({
            open: true,
            success: true,
            message: translation.importSuccess || "Products imported successfully!",
          });
        } else {
          setImportPopup({
            open: true,
            success: false,
            message: summaryArray[0] || "Import failed. Please try again.",
          });
        }

      } catch (err) {
        console.error("❌ Import failed", err);
        setIsImporting(false);
        setImportPopup({
          open: true,
          success: false,
          message: translation.importFailed || "Import failed. Please try again.",
        });
        showToastError(translation.importFailed || "Import failed");
      } finally {
        fileInput.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    // Only export confirmed items
    const exportItems = bulkItems.filter(item => item.isConfirmed);

    if (exportItems.length === 0) return;

    const worksheetData = exportItems.map(item => ({
      Name: item.name,
      SKU: item.id,
      Quantity: item.qty,
      Price: item.price,
      Total: item.total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "bulk-items.xlsx");
  };

  const hasExportItems = bulkItems.some(item => item.isConfirmed);

  return (
    <>
      {importPopup.success && importPopup.open && (
        <SuccessModal
          icon="icon-document-download"
          open={importPopup.success}
          // message={importPopup.message}
          message={importSummary[0]}
          summary={importSummary}
          style={{ fontWeight: 'bold' }}
          onClose={() => setImportPopup({ open: false, success: false, message: "" })}
        />
      )}
      {!importPopup.success && importPopup.open && (
        <ErrorModal
          open={!importPopup.success}
          message={importPopup.message}
          summary={importSummary}
          style={{ fontWeight: 'bold' }}
          onClose={() => setImportPopup({ open: false, success: false, message: "" })}
        />
      )}
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
                                <span className='hidden'>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="bulk-action-btns flex justify-between items-center flex-wrap gap-3">
                    <button
                      className={`submit-bulk-btn primary-btn ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleSubmit}
                      disabled={isSubmitDisabled}
                    >
                      {translation.add}
                    </button>

                    <div className="flex flex-wrap gap-3">
                      <div>
                        <label className="import-btn">
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImport}
                            disabled={isImporting}
                            style={{ display: "none" }}
                            id="importExcel"
                          />
                        </label>
                        <button
                          className={`flex items-center gap-1 outline-btn ${!hasExportItems ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleExport}
                          disabled={!hasExportItems}
                        >
                          <i className="icon-import text-lg"></i>
                          {translation.exportExcel}
                        </button>
                      </div>
                      <div>
                        <label className="import-btn">
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImport}
                            disabled={isImporting}
                            style={{ display: "none" }}
                            id="importExcel"
                          />
                        </label>
                        <button
                          className="flex items-center gap-1 outline-btn cursor-pointer"
                          onClick={() => document.getElementById("importExcel").click()}
                        >
                          {isImporting && <span className="spinner"></span>}
                          <i className="icon-export text-lg"></i>
                          {translation.importExcel}
                        </button>
                      </div>
                      {/* <a className="flex items-center gap-1 outline-btn cursor-pointer" href="https://alekha-dev.s3.amazonaws.com/bulk_add_items_import_templates.xlsx" download>
                      <i className="icon-import text-lg"></i>
                      {translation.downloadExcel}
                    </a> */}
                      <button className="gray-btn" onClick={onClose}>
                        {translation.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
