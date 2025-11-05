'use client';
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import InlineAddToCart from "@/components/ui/InlineAddToCart";
import { getCart, getProfile } from "@/actions/utils";
import ConfirmOrderModal from "@/components/ui/ConfirmOrderModal";
import SureOrderModal from "@/components/ui/SureOrderModal";
import Link from "next/link";
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';
import axios from 'axios';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import Cookies from 'js-cookie';
import Loader from "@/components/ui/Loaders/Loader";
import { showWarningToast } from "@/actions/toastUtils";
import ErrorOrderResModal from "@/components/ui/ErrorOrderResModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from 'next/navigation';
import SuccessModal from "@/components/ui/SuccessModal";
import ErrorModal from "@/components/ui/ErrorModal";
import ConfirmImportModal from "@/components/ui/ConfirmImportModal";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [addressesItems, setAddressesItems] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [notes, setNotes] = useState('');
  const [openSureOrder, setOpenSureOrder] = useState(false);
  const [errorOrderResContent, setErrorOrderResContent] = useState([]);
  const [openErrorOrderResModal, setOpenErrorOrderResModal] = useState(false);
  const [openConfirmOrder, setOpenConfirmOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [orderSummary, setOrderSummary] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const [importPopup, setImportPopup] = useState({
    open: false,
    success: false,
    message: "",
  });
  const [addOrderError, setAddOrderError] = useState(false);
  const [addOrderErrorFlag, setAddOrderErrorFlag] = useState(false);
  const [addOrderErrorList, setAddOrderErrorList] = useState([]);
  const [addOrderErrorAPI, setAddOrderErrorAPI] = useState(false);
  const [addOrderErrorAPIMsg, setAddOrderErrorAPIMsg] = useState(false);
  const [showReplaceCartPopup, setShowReplaceCartPopup] = useState(false);
  const [pendingImportedItems, setPendingImportedItems] = useState(null);
  const [pendingImportErrors, setPendingImportErrors] = useState([]);
  const router = useRouter();
  const profileData = getProfile()
  const siteLocation = Cookies.get("siteLocation")

  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    setSelectedPaymentMethod(state.corporatePayment ? state.corporatePayment : "Cash")
    document.title = state.LANG === 'AR' ? ar.cart : en.cart;
  }, [state.LANG, state.corporatePayment]);

  const showToastError = (message) => {
    const lang = Cookies.get("lang") || "AR";
    showWarningToast(message, lang, translation.warning);
  };

  const loadCart = () => {
    const items = getCart();
    setCartItems(items);
  };

  function getOverQtyItems(data) {
    if (!data || !Array.isArray(data.items)) return [];
    return data.items.filter(item => {
      const qty = parseInt(item.QTY, 10);
      const avlqty = parseInt(item.avlqty ?? item.AQTY, 10);
      return qty > avlqty;
    });
  }

  const fetchProfile = async () => {
    const res = await axios.get(`${BASE_API}${endpoints.user.profile}&lang=${state.LANG}&token=${Cookies.get('token')}`, {});
    setAddressesItems(res.data.locations);
  };

  const handleGetOrder = async () => {
    const items = getCart();
    console.log(items);

    try {
      const response = await axios.post(`${BASE_API}${endpoints.products.checkout}&lang=${state.LANG}&token=${Cookies.get('token')}`, items, {});
      setOrderSummary(response.data);
    } catch (error) {
      console.error('Failed to get order summary:', error);
    }
  };

  useEffect(() => {
    loadCart();
    fetchProfile();
  }, [state.STOREDITEMS]);

  useEffect(() => {
    handleGetOrder();
    loadCart();
  }, [refresh, state.STOREDITEMS, addOrderErrorFlag]);

  const handleSubmitChecker = () => {
    const storedCart = state.STOREDITEMS;
    if (!storedCart.length) {
      showWarningToast(translation.noProducts, state.LANG, translation.warning);
      return;
    }
    if (!selectedAddressId) {
      showWarningToast(translation.completeErrorMessage, state.LANG, translation.warning);
      return;
    }
    setOpenSureOrder(true);
  };

  const openPaymentWindow = (paymentUrl) => {
    router.push(paymentUrl);
    // const width = 600;
    // const height = 700;
    // const left = (window.innerWidth - width) / 2;
    // const top = (window.innerHeight - height) / 2;

    // window.open(
    //   paymentUrl,
    //   'PaymentWindow',
    //   `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=yes,status=no`
    // );
  };


  const handleSubmitOrder = async () => {
    const storedCart = getCart();
    const data = {
      notes: notes,
      deliveryDate: "",
      payOnline: selectedPaymentMethod === "Online" ? true : false,
      branchNo: profileData?.accountAddress === selectedAddressId ? "" : selectedAddressId.id,
      address: profileData?.accountAddress === selectedAddressId ? selectedAddressId : selectedAddressId.address,
      'branch name': profileData?.accountAddress === selectedAddressId ? "" : selectedAddressId["branch name"],
      items: storedCart.map(item => ({
        item: item.item,
        qty: item.qty
      }))
    };

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_API}${endpoints.products.order}&token=${Cookies.get('token')}`,
        data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response?.data);

      if (response.data?.error) {
        if (response.data.errorType === "qty") {
          setAddOrderError(true);
          setOpenSureOrder(false);
          setAddOrderErrorFlag(!addOrderErrorFlag);
          setAddOrderErrorList(response.data.items || []);
        } else {
          setAddOrderErrorAPI(true);
          setAddOrderErrorAPIMsg(state.LANG === 'AR' ? response.data.messageAR : response.data.messageEN || translation.errorHappened)
        }
      } else if (response.data && !response.data?.error) {
        if (selectedPaymentMethod === "Cash") {
          Cookies.set('cart', "[]", { expires: 7, path: '/' });
          await axios.post(
            `${BASE_API}${endpoints.products.setCart}?lang=${state.LANG}&token=${Cookies.get('token')}`,
            { "items": [] }
          );
          dispatch({ type: 'STORED-ITEMS', payload: [] });
          setOpenSureOrder(false);
          setOpenConfirmOrder(true);
          handleRefresh();
        } else {
          openPaymentWindow(response.data.paymentURL)
        }
      }
      // else {
      //   let exceededItems = getOverQtyItems(response?.data?.items);
      //   setErrorOrderResContent(exceededItems);
      //   setOpenSureOrder(false);
      //   setOpenErrorOrderResModal(true);
      // }
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  const breadcrumbItems = [
    { label: translation.home, href: '/home' },
    { label: translation.cart }
  ];

  const handleExport = () => {
    if (!orderSummary?.ITEMS?.length) return;
    const exportData = orderSummary.ITEMS.map((item) => ({
      ["SKU"]: item.id,
      ["Barcode"]: item.barcode,
      ["Product Name"]: item.name,
      ["Selling Price"]: item.RSP,
      ["Price"]: item.LPRICE,
      ["Cost"]: item.PRICEAFTERDISCOUNT,
      ["Tax"]: `${Number(item.TAX).toFixed(2)}`,
      [`Brand - Category`]: `${item.brand.description} - ${item.category.description}`,
      ["Quantity"]: item.qty || item.QTY,
      ["Total Price"]: Number(item.NET).toFixed(2),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CartItems");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "cart_items.xlsx");
  };

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
    const lang = Cookies.get("lang") || "AR";
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
        const qtyHeaders = ["quantity", "qty", "quantities", "quantitiy"];
        const qtyIndex = header.findIndex((h) => qtyHeaders.includes(h));

        const importedItems = [];
        const errors = [];
        let successCount = 0;

        if (skuIndex === -1 || qtyIndex === -1) {
          showToastError(translation.errorImportingFile);
          setIsImporting(false);
          return;
        }

        const skuQtyMap = {};
        rows.slice(1).forEach((row, rowIndex) => {
          const rawSku = row[skuIndex];
          const rawQty = row[qtyIndex];
          if (!rawSku) return;
          const sku = String(rawSku).trim().toUpperCase();
          const qty = Number(rawQty) || 0;
          // ✅ Apply quantity rules
          if (qty < 0.5) {
            // ❌ Treat as error — invalid quantity
            errors.push({
              index: rowIndex + 1,
              sku,
              reason: "qty",
            });
            return; // Skip processing this SKU
          }

          let finalQty = Math.round(qty);
          if (qty >= 0.5 && qty < 1) {
            finalQty = 1; // Round up small fractions to 1
          }

          skuQtyMap[sku] = (skuQtyMap[sku] || 0) + finalQty;
        });

        const skus = Object.keys(skuQtyMap);
        if (skus.length === 0) {
          showToastError(translation.noProductsSelected);
          setIsImporting(false);
          return;
        }

        const productFetches = skus.map((sku) => fetchProductBySku(sku));
        const fetchedProducts = await Promise.all(productFetches);

        for (let i = 0; i < skus.length; i++) {
          const sku = skus[i];
          const product = fetchedProducts[i];
          const qty = skuQtyMap[sku];

          if (!product) {
            errors.push({
              index: i + 1,
              sku,
              reason: "غير متوفر أو رقم المنتج غير صحيح",
            });
            continue;
          }

          const unitPrice = Number(product.price);
          let finalQty = Number(qty);
          const maxAllowed = Math.min(product.avlqty, 10);
          if (finalQty > maxAllowed) {
            showWarningToast(`${translation.notAllowedAdd}`, lang, translation.warning);
            finalQty = maxAllowed;
          }

          importedItems.push({
            item: product.id,
            qty: finalQty,
          });
          successCount++;
        }

        // If cart has items, ask user to replace
        if (cartItems.length > 0) {
          setPendingImportedItems(importedItems);
          setPendingImportErrors(errors); // ✅ store errors too
          setShowReplaceCartPopup(true);
          setIsImporting(false);
          return;
        }

        // Continue import if cart is empty
        if (importedItems.length) {
          Cookies.set('cart', JSON.stringify(importedItems), { expires: 7, path: '/' });
          await axios.post(
            `${BASE_API}${endpoints.products.setCart}?lang=${lang}&token=${Cookies.get('token')}`,
            { "items": importedItems }
          );
          dispatch({ type: "STORED-ITEMS", payload: importedItems });
        }

        const summaryArray = [
          translation.importSummary.success
            .replace("{success}", successCount)
            .replace("{errors}", errors.length),
          ...errors.map((err) => {
            if (err.reason === "qty") {
              return translation.qtyNotValid.replace("{sku}", err.sku)
            } else {
              return translation.importSummary.errorItem.replace("{sku}", err.sku)
            }
          }
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

  const completeImport = async (importedItems, successCount, errors, translation, lang) => {
    if (importedItems.length) {
      Cookies.set('cart', JSON.stringify(importedItems), { expires: 7, path: '/' });
      await axios.post(
        `${BASE_API}${endpoints.products.setCart}?lang=${lang}&token=${Cookies.get('token')}`,
        { "items": importedItems }
      );
      dispatch({ type: "STORED-ITEMS", payload: importedItems });
    }

    const summaryArray = [
      translation.importSummary.success
        .replace("{success}", successCount)
        .replace("{errors}", errors.length),
      ...errors.map((err) => {
        if (err.reason === "qty") {
          return translation.qtyNotValid.replace("{sku}", err.sku)
        } else {
          return translation.importSummary.errorItem.replace("{sku}", err.sku)
        }
      }
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
  };
  // Handler for user confirming to replace cart
  const handleReplaceCartConfirm = async () => {
    setShowReplaceCartPopup(false);
    if (pendingImportedItems) {
      // You may want to re-run the error/success summary logic here as well
      await completeImport(
        pendingImportedItems,
        pendingImportedItems.length,
        pendingImportErrors,
        translation,
        Cookies.get("lang") || "AR"
      );
      setPendingImportedItems(null);
    }
  };

  // Handler for user cancelling
  const handleReplaceCartCancel = () => {
    setShowReplaceCartPopup(false);
    setPendingImportedItems(null);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 pt-15 cart-page section-min">
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
      <ErrorModal
        open={addOrderError}
        title={translation.addOrderErrorTitle}
        message={translation.addOrderErrorMsg}
        onClose={() => setAddOrderError(false)}
      />
      <ErrorModal
        open={addOrderErrorAPI}
        message={addOrderErrorAPIMsg}
        onClose={() => setAddOrderErrorAPI(false)}
      />
      {loading && <Loader />}
      <Breadcrumb items={breadcrumbItems} />
      <div className="mt-5 pt-5">
        <div className="flex justify-between items-center flex-wrap gap-5 mb-5">
          <div className="flex items-center gap-5">
            <h3 className="sub-title">{translation.addedProducts}</h3>
            <div className="items-count flex justify-center items-center">{cartItems.length}</div>
          </div>
          <div className="flex gap-3 flex-wrap import-export-cart-btns">
            <button className={`flex items-center gap-1 outline-btn no-bg ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleExport}>
              <i className="icon-export text-lg"></i>
              {translation.exportCart}
            </button>
            <div>
              <label className="import-btn">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  // disabled={isImporting}
                  style={{ display: "none" }}
                  id="importExcel"
                />
              </label>
              <button
                className="flex items-center gap-1 outline-btn cursor-pointer no-bg"
                onClick={() => document.getElementById("importExcel").click()}
              >
                {isImporting && <span className="spinner"></span>}
                <i className="icon-import text-lg"></i>
                {translation.importCart}
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto mb-5">
          {
            cartItems.length === 0 ? (
              <>
                <div className='card empty-state flex justify-center items-center'>
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="261" height="260" viewBox="0 0 261 260" fill="none">
                      <rect x="0.5" width="260" height="260" rx="130" fill="url(#paint0_linear_239_8280)" />
                      <path opacity="0.4" d="M178.766 87.2H176.1L153.566 64.6667C151.766 62.8667 148.833 62.8667 146.966 64.6667C145.166 66.4667 145.166 69.4 146.966 71.2667L162.9 87.2H98.0997L114.033 71.2667C115.833 69.4667 115.833 66.5333 114.033 64.6667C112.233 62.8667 109.3 62.8667 107.433 64.6667L84.9663 87.2H82.2997C76.2997 87.2 63.833 87.2 63.833 104.267C63.833 110.733 65.1663 115 67.9663 117.8C69.5663 119.467 71.4997 120.333 73.5663 120.8C75.4997 121.267 77.5663 121.333 79.5663 121.333H181.433C183.5 121.333 185.433 121.2 187.3 120.8C192.9 119.467 197.166 115.467 197.166 104.267C197.166 87.2 184.7 87.2 178.766 87.2Z" fill="#7E818E" />
                      <path d="M181.566 121.333H79.5664C77.6331 121.333 75.4997 121.267 73.5664 120.733L81.9664 172C83.8997 183.467 88.8997 196.667 111.1 196.667H148.5C170.966 196.667 174.966 185.4 177.366 172.8L187.433 120.733C185.566 121.2 183.566 121.333 181.566 121.333ZM143.3 169.267C142.3 170.267 141.033 170.733 139.766 170.733C138.5 170.733 137.233 170.267 136.233 169.267L130.566 163.6L124.7 169.467C123.7 170.467 122.433 170.933 121.166 170.933C119.9 170.933 118.633 170.467 117.633 169.467C115.7 167.533 115.7 164.333 117.633 162.4L123.5 156.533L117.833 150.867C115.9 148.933 115.9 145.733 117.833 143.8C119.766 141.867 122.966 141.867 124.9 143.8L130.566 149.467L136.033 144C137.966 142.067 141.166 142.067 143.1 144C145.033 145.933 145.033 149.133 143.1 151.067L137.633 156.533L143.3 162.2C145.3 164.2 145.3 167.333 143.3 169.267Z" fill="#7E818E" />
                      <defs>
                        <linearGradient id="paint0_linear_239_8280" x1="130.5" y1="0" x2="130.5" y2="260" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#E9EBED" />
                          <stop offset="1" stopColor="white" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <h2 className='sub-title my-4 text-center'>{translation.noProducts}</h2>
                    <Link href="/home" className="primary-btn inline-flex">
                      {translation.backToStore}
                    </Link>
                  </div>
                </div></>
            ) : null
          }
          {cartItems.length ? (
            <table className="checkout-table text-center w-full text-sm text-left rtl:text-right text-gray-500 mb-5">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.image}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.productNumber}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.barcode}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.productName}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.sellingPrice}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.price}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.costPrice}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.tax}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.brand} - {translation.type}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.qty}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {translation.totalPrice}
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {orderSummary?.ITEMS?.map((item) => (
                    <tr className={`bg-white ${addOrderErrorList?.map(String).includes(String(item.id)) ? "hass-qty-error" : ""} ${item.id}`} key={item.id}>
                      <td className="px-3 py-3 text-center">
                        <Link href={`/products/${item.id}`} className="w-full h-full flex justify-center items-center">
                          <img src={item.images["800"].main} width={80} alt={item.name || "Product"} />
                        </Link>
                      </td>
                      <td scope="row" className="px-3 py-3 text-center">
                        {item.id}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.barcode}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Link href={`/products/${item.id}`}>{item.name}</Link>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.RSP}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.LPRICE}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.PRICEAFTERDISCOUNT}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.TAX}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.brand.description} - {item.category.description}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <InlineAddToCart
                          itemId={item.id}
                          avlqty={item.avlqty}
                          onQtyChange={loadCart}
                          onRefresh={handleRefresh}
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        {Number(item.NET).toFixed(2)}
                        <span className="ms-1">{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                      </td>
                    </tr>
                  ))}
                </>
              </tbody>
            </table>
          ) : null
          }
        </div>
        <div className="flex gap-7 flex-col lg:flex-row">
          <div className="order-side">
            {
              cartItems.length ? (
                <>
                  <h3 className="sub-title mb-4">{translation.shippingAddress} <span className="required">*</span></h3>
                  <div className="addresses">
                    {
                      profileData?.accountAddress ? (
                        <div className="card mb-3">
                          <div className="address-item">
                            <input
                              type="radio"
                              name="address"
                              id={`address-main`}
                              value={profileData?.accountAddress}
                              checked={selectedAddressId === profileData?.accountAddress}
                              onChange={() => setSelectedAddressId(profileData?.accountAddress)}
                            />
                            <label htmlFor={`address-main`} className="flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <i className="icon-location location"></i>
                                <span>{translation.mainAddress} - {profileData?.accountAddress}</span>
                              </span>
                              <i className="icon-tick-circle check"></i>
                            </label>
                          </div>
                        </div>
                      ) : null
                    }
                    {addressesItems.length ? (
                      addressesItems?.map((add, index) => (
                        <div className="card mb-3" key={add.id}>
                          <div className="address-item">
                            <input
                              type="radio"
                              name="address"
                              id={`address-${index}`}
                              value={add.id}
                              checked={selectedAddressId.id === add.id}
                              onChange={() => setSelectedAddressId(add)}
                            />
                            <label htmlFor={`address-${index}`} className="flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <i className="icon-location location"></i>
                                <span>{add["branch name"] ? add["branch name"] + " -" : null}  {add.address}</span>
                              </span>
                              <i className="icon-tick-circle check"></i>
                            </label>
                          </div>
                        </div>
                      ))
                    ) : null
                    }
                    {
                      !addressesItems.length && !profileData?.accountAddress ? (
                        <p className="">
                          {translation.noAddressesMessage}
                        </p>
                      ) : null
                    }
                  </div>
                  {
                    state.isCorporate && (
                      <>
                        <h3 className="sub-title mb-4 mt-8">{translation.paymentMethod}</h3>
                        <div className="payment-methods flex flex-wrap md:flex-nowrap gap-3">
                          {
                            (state.corporatePayment === "Cash" || state.corporatePayment === "") && (
                              <label htmlFor="cashOnDelivery" className="block w-full md:w-1/2">
                                <div className={`card ${selectedPaymentMethod === "Cash" ? 'selected' : ''}`}>
                                  <div className="payment-method">
                                    <i className="icon-money-3"></i>
                                    <span className="icon-tick-circle"></span>
                                    <input
                                      className="hidden"
                                      type="radio"
                                      name="paymentMethod"
                                      id="cashOnDelivery"
                                      value="Cash"
                                      checked={selectedPaymentMethod === "Cash"}
                                      onChange={() => setSelectedPaymentMethod("Cash")}
                                    />
                                    <span className="block mt-2">{translation.cashOnDelivery}</span>
                                  </div>
                                </div>
                              </label>
                            )
                          }
                          {
                            (state.corporatePayment === "Online" || state.corporatePayment === "") && (
                              <label htmlFor="creditCardPayment" className="block w-full md:w-1/2">
                                <div className={`card ${selectedPaymentMethod === "Online" ? 'selected' : ''}`}>
                                  <div className="payment-method">
                                    <i className="icon-cards"></i>
                                    <span className="icon-tick-circle"></span>
                                    <input
                                      className="hidden"
                                      type="radio"
                                      name="paymentMethod"
                                      id="creditCardPayment"
                                      value="Online"
                                      checked={selectedPaymentMethod === "Online"}
                                      onChange={() => setSelectedPaymentMethod("Online")}
                                    />
                                    <span className="block mt-2">{translation.creditCardPayment}</span>
                                  </div>
                                </div>
                              </label>
                            )
                          }
                        </div>
                      </>
                    )
                  }
                  <h3 className="sub-title mb-4 mt-8">{translation.orderNotes}</h3>
                  <div className="card">
                    <textarea
                      className="w-full h-full notes-text"
                      name="notes"
                      placeholder={translation.addNotes}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </>
              ) : null
            }
          </div>

          <div className="order-summary">
            <div className="card p-4">
              <h3 className="sub-title mb-6">{translation.orderSummary}</h3>
              <div className="order-item flex justify-between items-center mb-4">
                <p className="mb-0">{translation.itemCount}</p>
                <p className="mb-0">{orderSummary?.CNT}</p>
              </div>
              <div className="order-item flex justify-between items-center mb-4">
                <p className="mb-0">{translation.subtotal}</p>
                <p className="mb-0 flex items-center gap-1">
                  <span>{cartItems.length ? Number(orderSummary?.SUBTOTAL).toFixed(2) : 0}</span>
                  <span>{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                </p>
              </div>
              <div className="order-item flex justify-between items-center mb-4">
                <p className="mb-0">{translation.tax}</p>
                <p className="mb-0 flex items-center gap-1">
                  <span>{cartItems.length ? Number(orderSummary?.TAX).toFixed(2) : 0}</span>
                  <span>{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                </p>
              </div>
              <div className="order-item flex justify-between items-center mb-4">
                <p className="mb-0">{translation.discount}</p>
                <p className="mb-0 flex items-center gap-1">
                  <span>{cartItems.length ? Number(orderSummary?.DISCOUNT).toFixed(2) : 0}</span>
                  <span>{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                </p>
              </div>
              <div className="order-item flex justify-between items-center mb-4">
                <p className="mb-0">{translation.deliveryFees}</p>
                <p className="mb-0 flex items-center gap-1">
                  {/* <span>{cartItems.length ? Number(orderSummary?.DISCOUNT).toFixed(2) : 0}</span> */}
                  <span>0</span>
                  <span>{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                </p>
              </div>
              <hr />
              <div className="order-item flex justify-between items-center mb-4">
                <h3 className="sub-title">{translation.total}</h3>
                <p className="mb-0 flex items-center gap-1 price">
                  <span>{cartItems.length ? Number(orderSummary?.TOTAL).toFixed(2) : 0}</span>
                  <span>{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                </p>
              </div>
              <button
                className={`primary-btn w-full ${cartItems.length ? '' : 'disabled'}`}
                onClick={handleSubmitChecker}
              >
                {selectedPaymentMethod === "Online" ? translation.gotoPayment : translation.confirmOrder}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ErrorOrderResModal errorsContent={errorOrderResContent} setOpen={() => setOpenErrorOrderResModal(false)} open={openErrorOrderResModal} />
      <SureOrderModal setOpen={() => setOpenSureOrder(false)} open={openSureOrder} onHandleSubmit={handleSubmitOrder} />
      <ConfirmOrderModal setOpen={() => setOpenConfirmOrder(true)} open={openConfirmOrder} />
      <ConfirmImportModal
        open={showReplaceCartPopup}
        setOpen={setShowReplaceCartPopup}
        title={translation.warning}
        message={translation.areYouSure || "Your cart already has items. Do you want to replace it with the imported items?"}
        actions={
          <>
            <button className="primary-btn" onClick={handleReplaceCartConfirm}>{translation.yes || "Yes"}</button>
            <button className="outline-btn cursor-pointer" onClick={handleReplaceCartCancel}>{translation.no || "No"}</button>
          </>
        }
      />
    </div>
  );
}

export default Cart;
