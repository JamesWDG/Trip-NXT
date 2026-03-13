import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/api";
import { setLogout } from "../slices/authSlice";
import { RootState } from "../store";



const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
    const region = state.settings?.currency;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    if (region) {
      headers.set('region', region);
    }
    return headers;
  },
  responseHandler: async (response) => {
    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';
    if (text && contentType.includes('application/json')) {
      try {
        return JSON.parse(text);
      } catch {
        return response.ok ? null : { message: 'Invalid JSON response' };
      }
    }
    if (!response.ok) {
      return { message: response.status === 404 ? 'Not found' : 'Request failed', status: response.status };
    }
    return text || null;
  },
});



export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    await api.dispatch(setLogout()); 
  }
  console.log(result , "resultresultresultresult")
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Restaurant', 'Hotel', 'Menu'],
  endpoints: () => ({}),
});