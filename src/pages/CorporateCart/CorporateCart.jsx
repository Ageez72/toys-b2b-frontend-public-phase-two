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
  const [orderSummary, setOrderSummary] = useState(null);

  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(ar);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.cart : en.cart;
  }, [state.LANG]);

  const loadCart = () => {
    const items = state.STOREDITEMS;
    setCartItems(items);
  };

  function getOverQtyItems(data) {
    if (!data || !Array.isArray(data.items)) return [];

    return data.items.filter(item => {
      const qty = parseInt(item.QTY, 10);
      const avlqty = parseInt(item.avlqty ?? item.AQTY, 10); // fallback if `avlqty` is undefined

      return qty > avlqty;
    });
  }


  const fetchProfile = async () => {
    const res = await axios.get(`${BASE_API}${endpoints.user.profile}&lang=${state.LANG}&token=${Cookies.get('token')}`, {});
    setAddressesItems(res.data.locations);
  };

  const handleGetOrder = async () => {
    const items = state.STOREDITEMS;
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_API}${endpoints.products.checkout}&lang=${state.LANG}&token=${Cookies.get('token')}`, items, {});
      setOrderSummary(response.data);
    } catch (error) {
      console.error('Failed to get order summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    fetchProfile();
  }, [state.STOREDITEMS]);

  useEffect(() => {
    handleGetOrder();
    loadCart();
  }, [refresh, state.STOREDITEMS]);

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

  const handleSubmitOrder = async () => {
    const storedCart = state.STOREDITEMS;

    const data = {
      notes: notes,
      deliveryDate: "",
      address: selectedAddressId,
      items: storedCart.map(item => ({
        item: item.id,
        qty: item.qty
      }))
    };
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_API}${endpoints.products.order}&token=${Cookies.get('token')}`, data, {});
      if (response.data && !response.data.ERROR) {
        Cookies.set('cart', "[]", { expires: 7, path: '/' });
        dispatch({ type: 'STORED-ITEMS', payload: [] });
        setOpenSureOrder(false);
        setOpenConfirmOrder(true);
        handleRefresh();
      } else {
        let exceededItems = getOverQtyItems(response?.data?.items);
        setErrorOrderResContent(exceededItems)
        setOpenSureOrder(false);
        setOpenErrorOrderResModal(true)
      }
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

    // Map the data you want to export
    const exportData = orderSummary.ITEMS.map((item) => ({
      [translation.sku]: item.id,
      [translation.barcode]: item.barcode,
      [translation.productName]: item.name,
      [translation.sellingPrice]: item.RSP,
      [translation.price]: item.LPRICE,
      [translation.costPrice]: item.PRICEAFTERDISCOUNT,
      [translation.tax]: `${Number(item.TAX).toFixed(2)}%`,
      [`${translation.brand} - ${translation.type}`]: `${item.brand.description} - ${item.category.description}`,
      [translation.qty]: item.qty || item.QTY,
      [translation.totalPrice]: Number(item.NET).toFixed(2),
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

  return (
    <div className="max-w-screen-xl mx-auto p-4 pt-15 cart-page section-min">
      {/* {loading && <Loader />} */}
      <Breadcrumb items={breadcrumbItems} />
      {/* <PaymentForm /> */}
      <div className="order-side mt-5 pt-5">
        <div className="flex justify-between items-center gap-5 mb-5">
          <div className="flex items-center gap-5">
            <h3 className="sub-title">{translation.addedProducts}</h3>
            <div className="items-count flex justify-center items-center">{cartItems.length}</div>
          </div>
          <button className="flex items-center gap-1 outline-btn cursor-pointer no-bg" onClick={handleExport}>
            <i className="icon-export text-lg"></i>
            {translation.export}
          </button>
        </div>

        <div className="relative overflow-x-auto mb-5">
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
              {cartItems.length ? (
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
              ) : (
                <tr className="bg-white">
                  <td colSpan="11">
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
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
      <ErrorOrderResModal errorsContent={errorOrderResContent} setOpen={() => setOpenErrorOrderResModal(false)} open={openErrorOrderResModal} />
      <SureOrderModal setOpen={() => setOpenSureOrder(false)} open={openSureOrder} onHandleSubmit={handleSubmitOrder} />
      <ConfirmOrderModal setOpen={() => setOpenConfirmOrder(true)} open={openConfirmOrder} />
    </div>
  );
}

export default Cart;
