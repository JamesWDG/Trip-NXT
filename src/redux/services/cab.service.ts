import { endpoint } from '../../constants/api';
import { baseApi } from './api';

export type OnlineCabVendor = {
  id: number;
  cabId: number;
  userId: number;
  latitude: number;
  longitude: number;
  status: string;
  cab?: {
    id: number;
    vehicleType: string;
    vehicleModal: string;
    vehicleNumber: string;
    user?: { id: number; name: string; phoneNumber?: string };
  };
};

/**
 * Extract vendors array from API response.
 * - baseQuery returns { data: responseBody, meta }, so transformResponse receives that.
 * - Backend body is { data: { success, message, data: vendors[] } }.
 * - So vendors live at raw.data.data.data (baseQuery .data → body .data .data).
 */
function parseVendorsResponse(raw: any): OnlineCabVendor[] {
  if (!raw) return [];
  // baseQuery result: raw = { data: body, meta }; body = { data: { success, message, data: [...] } }
  const body = raw.data ?? raw;
  const inner = body?.data;
  if (inner && Array.isArray(inner.data)) return inner.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw)) return raw;
  return [];
}

const cabApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnlineVendors: builder.query<OnlineCabVendor[], void>({
      query: () => ({ url: endpoint.CAB_ONLINE_VENDORS, method: 'GET' }),
      transformResponse: parseVendorsResponse,
    }),
    getNearbyVendors: builder.query<
      OnlineCabVendor[],
      { latitude: number; longitude: number; radiusKm?: number }
    >({
      query: ({ latitude, longitude, radiusKm = 15 }) => ({
        url: endpoint.CAB_NEARBY_VENDORS,
        method: 'GET',
        params: { latitude, longitude, radiusKm },
      }),
      transformResponse: parseVendorsResponse,
    }),
  }),
});

export const {
  useLazyGetOnlineVendorsQuery,
  useLazyGetNearbyVendorsQuery,
  useGetNearbyVendorsQuery,
} = cabApi;
