"use server";
import { endpoints } from "../../constant/endpoints";
import api from "../../lib/axios";
import { BASE_API } from "../../constant/endpoints";

export async function login(username, password) {
  const userData = await api.get(`${endpoints.auth.login}&username=${username}&password=${password}`);
  return userData.data;
}
export async function registerUser(data) {
  const userRegisterData = await api(`${endpoints.auth.regis}&username=${data.username}&password=${data.password}&email=${data.email}&mobile=${data.mobile}&name=${data.name}&businessname=${data.businessname}`,);
  return userRegisterData.data;
}

export async function fetchProducts(params, token) {
  const products = await api.get(`${endpoints.products.list}&pageSize=12&${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Override the interceptor token here
      },
    }
  );
  return products.data;
}

export async function fetchBrandsFilters() {
  const brands = await api.get(`${endpoints.products.brandsFilters}&lang=AR`);
  return brands.data;
}

export async function fetchHomeProducts(type) {
  const res = await axios.get(`${BASE_API}${endpoints.products.list}&itemType=${type}&pageSize=12`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    }
  });
  return res;
}
