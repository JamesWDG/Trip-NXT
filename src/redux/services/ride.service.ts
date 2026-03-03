import { endpoint } from '../../constants/api';
import { baseApi } from './api';

export interface RidePayload {
  id: number;
  userId: number;
  vendorId: number | null;
  pickup: { lat: number; lng: number; address?: string };
  dropoff: { lat: number; lng: number; address?: string };
  offeredFare: number;
  negotiatedFare: number | null;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; name: string; phoneNumber?: string };
  vendor?: { id: number; userId: number; vehicleType: string; user?: { id: number; name: string; phoneNumber?: string } };
  offers?: Array<{ id: number; vendorId: number; proposedFare: number; status: string; vendor?: { id: number; user?: { name: string } } }>;
}

function parseRideResponse(raw: any): any {
  const body = raw?.data ?? raw;
  const inner = body?.data;
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) return inner;
  if (typeof body?.data === 'object' && !Array.isArray(body?.data)) return body.data;
  return body;
}

function parseRideListResponse(raw: any): RidePayload[] {
  const body = raw?.data ?? raw;
  const inner = body?.data;
  if (Array.isArray(inner)) return inner;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRide: builder.mutation<RidePayload, {
      pickupLat: number; pickupLng: number; pickupAddress?: string;
      dropoffLat: number; dropoffLng: number; dropoffAddress?: string;
      offeredFare: number;
    }>({
      query: (body) => ({
        url: endpoint.RIDE_CREATE,
        method: 'POST',
        body,
      }),
      transformResponse: parseRideResponse,
    }),
    getRideForUser: builder.query<RidePayload, number>({
      query: (rideId) => ({ url: endpoint.RIDE_USER(rideId), method: 'GET' }),
      transformResponse: parseRideResponse,
    }),
    getMyActiveRides: builder.query<RidePayload[], void>({
      query: () => ({ url: endpoint.RIDE_MY_ACTIVE, method: 'GET' }),
      transformResponse: parseRideListResponse,
    }),
    getMyRideHistory: builder.query<{ list: RidePayload[]; total: number }, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: endpoint.RIDE_MY_HISTORY,
        method: 'GET',
        params: { limit, offset },
      }),
      transformResponse: (raw: any) => {
        const body = raw?.data ?? raw;
        const inner = body?.data ?? body;
        return {
          list: Array.isArray(inner?.list) ? inner.list : [],
          total: typeof inner?.total === 'number' ? inner.total : 0,
        };
      },
    }),
    acceptOffer: builder.mutation<RidePayload, { rideId: number; offerId: number }>({
      query: ({ rideId, offerId }) => ({
        url: endpoint.RIDE_ACCEPT_OFFER(rideId),
        method: 'POST',
        body: { offerId },
      }),
      transformResponse: parseRideResponse,
    }),
    rejectOffer: builder.mutation<void, { rideId: number; offerId: number }>({
      query: ({ rideId, offerId }) => ({
        url: endpoint.RIDE_REJECT_OFFER(rideId),
        method: 'POST',
        body: { offerId },
      }),
    }),
    cancelRide: builder.mutation<RidePayload, { rideId: number; asVendor?: boolean }>({
      query: ({ rideId, asVendor }) => ({
        url: endpoint.RIDE_CANCEL(rideId),
        method: 'POST',
        body: { asVendor: !!asVendor },
      }),
      transformResponse: parseRideResponse,
    }),
    createRideBookingLog: builder.mutation<any, { rideId: number; amount: number }>({
      query: ({ rideId, amount }) => ({
        url: `${endpoint.RIDE_CREATE}/booking-log`,
        method: 'POST',
        body: { rideId, amount },
      }),
    }),
  }),
});

export const {
  useCreateRideMutation,
  useGetRideForUserQuery,
  useLazyGetRideForUserQuery,
  useGetMyActiveRidesQuery,
  useLazyGetMyActiveRidesQuery,
  useGetMyRideHistoryQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCancelRideMutation,
  useCreateRideBookingLogMutation,
} = rideApi;
