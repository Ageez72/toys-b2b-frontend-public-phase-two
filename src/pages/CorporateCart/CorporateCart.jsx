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

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [addressesItems, setAddressesItems] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const [importPopup, setImportPopup] = useState({
    open: false,
    success: false,
    message: "",
  });
  const router = useRouter()

  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.cart : en.cart;
  }, [state.LANG]);

  const showToastError = (message) => {
    const lang = Cookies.get("lang") || "AR";
    showWarningToast(message, lang, translation.warning);
  };

  const loadCart = () => {
    const items = state.STOREDITEMS;
    setCartItems(items);
  };

  const fetchProfile = async () => {
    const res = await axios.get(`${BASE_API}${endpoints.user.profile}&lang=${state.LANG}&token=${Cookies.get('token')}`, {});
    setAddressesItems(res.data.locations);
  };

  const handleGetOrder = async () => {
    const items = state.STOREDITEMS;
    try {
      // setLoading(true);
      const response = await axios.post(`${BASE_API}${endpoints.products.checkout}&lang=${state.LANG}&token=${Cookies.get('token')}`, items, {});
      setOrderSummary(response.data);
    } catch (error) {
      console.error('Failed to get order summary:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    const profile = getProfile(); 
    if (!profile.isCorporate) {
      setLoading(true)
      router.push('/cart');
      return;
    }
  }, [state.isCorporate]);

  useEffect(() => {
    loadCart();
    fetchProfile();
  }, [state.STOREDITEMS]);

  useEffect(() => {
    handleGetOrder();
    loadCart();
  }, [refresh, state.STOREDITEMS]);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  const breadcrumbItems = [
    { label: translation.home, href: '/home' },
    { label: translation.cart }
  ];

  const handleExport = () => {
    if (!orderSummary?.ITEMS?.length) return;

    // Map the data you want to export
    const exportData = orderSummary.ITEMS.map((item) => ({
      ["SKU"]: item.id,
      ["Barcode"]: item.barcode,
      ["Product Name"]: item.name,
      ["Selling Price"]: item.RSP,
      ["Price"]: item.LPRICE,
      ["Cost"]: item.PRICEAFTERDISCOUNT,
      ["Tax"]: `${Number(item.TAX).toFixed(2)}%`,
      [`Brand - Category`]: `${item.brand.description} - ${item.category.description}`,
      ["Quantity"]: item.qty || item.QTY,
      ["Total Price"]: Number(item.NET).toFixed(2),
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CartItems");

    // Convert to Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Save file
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "corporate_cart_items.xlsx");
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
            item: product.id,
            qty
          });
          successCount++;
        }

        // replace bulkItems with imported items only
        console.log(importedItems);

        if (importedItems.length) {
          Cookies.set('cart', JSON.stringify(importedItems), { expires: 7, path: '/' });
          // Send updated cart to backend
          const res = await axios.post(
            `${BASE_API}${endpoints.products.setCart}?lang=${lang}&token=${Cookies.get('token')}`,
            {
              "items": importedItems
            }
          );
          dispatch({ type: "STORED-ITEMS", payload: importedItems });
        }


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
      {loading && <Loader />}
      <Breadcrumb items={breadcrumbItems} />
      {/* <PaymentForm /> */}
      <div className="order-side mt-5 pt-5">
        <div className="flex justify-between items-center gap-5 mb-5">
          <div className="flex items-center gap-5">
            <h3 className="sub-title">{translation.addedProducts}</h3>
            <div className="items-count flex justify-center items-center">{cartItems.length}</div>
          </div>
          <div className="flex gap-3">
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
            <table className="checkout-table text-center w-full text-sm text-left rtl:text-right text-gray-500">
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
                    <tr className="bg-white" key={item.id}>
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
                        <span className="ms-1">{translation.jod}</span>
                      </td>
                    </tr>
                  ))}
                </>
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end">
        <div className="order-summary half-width">
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
                <span>{translation.jod}</span>
              </p>
            </div>
            <div className="order-item flex justify-between items-center mb-4">
              <p className="mb-0">{translation.tax}</p>
              <p className="mb-0 flex items-center gap-1">
                <span>{cartItems.length ? Number(orderSummary?.TAX).toFixed(2) : 0}</span>
                <span>{translation.jod}</span>
              </p>
            </div>
            <div className="order-item flex justify-between items-center mb-4">
              <p className="mb-0">{translation.discount}</p>
              <p className="mb-0 flex items-center gap-1">
                <span>{cartItems.length ? Number(orderSummary?.DISCOUNT).toFixed(2) : 0}</span>
                <span>{translation.jod}</span>
              </p>
            </div>
            <div className="order-item flex justify-between items-center mb-4">
              <p className="mb-0">{translation.deliveryFees}</p>
              <p className="mb-0 flex items-center gap-1">
                {/* <span>{cartItems.length ? Number(orderSummary?.DISCOUNT).toFixed(2) : 0}</span> */}
                <span>0</span>
                <span>{translation.jod}</span>
              </p>
            </div>
            <hr />
            <div className="order-item flex justify-between items-center mb-4">
              <h3 className="sub-title">{translation.total}</h3>
              <p className="mb-0 flex items-center gap-1 price">
                <span>{cartItems.length ? Number(orderSummary?.TOTAL).toFixed(2) : 0}</span>
                <span>{translation.jod}</span>
              </p>
            </div>
            <Link
              href="/checkout"
              className={`primary-btn w-full text-center block ${cartItems.length ? '' : 'disabled'}`}
            // onClick={handleSubmitChecker}
            >
              {translation.goTopayment}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
