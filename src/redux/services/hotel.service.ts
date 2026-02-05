import { endpoint } from "../../constants/api";
import { baseApi } from "./api";


const hotelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHotels: builder.query({
            query: () => ({
                url: endpoint.GET_HOTELS,
                method: 'GET',
                providesTags: ['Hotel']
            })
        }),
        checkAvailability: builder.mutation({
            query: (data) => ({
                method: 'POST',
                url: endpoint.CHECK_AVAILABILITY,
                body: data,
            })
        }),
        createHotelBooking: builder.mutation({
            query: (data: {
                hotelId: number;
                vendorId: number;
                checkInDate: string;
                checkOutDate: string;
                totalAmount: number;
                status?: string;
                emailSent?: boolean;
                paymentId?: string;
                numberOfGuests: number;
                numberOfRooms: number;
                numberOfBeds: number;
                children: number;
                adults: number;
                guestInfo: { name: string; email: string; phoneNumber: string };
            }) => ({
                method: 'POST',
                url: endpoint.CREATE_BOOKING,
                body: data,
            }),
            invalidatesTags: ['Hotel'],
        }),
        getFilteredHotels: builder.query({
            query: (params: {
                city?: string;
                checkInDate?: string;
                checkOutDate?: string;
                priceMin?: number;
                priceMax?: number;
                roomType?: string;
                guests?: number;
                rooms?: number;
                minRating?: number;
                page?: number;
                limit?: number;
            }) => {
                const search = new URLSearchParams();
                if (params.city) search.set('city', params.city);
                if (params.checkInDate) search.set('checkInDate', params.checkInDate);
                if (params.checkOutDate) search.set('checkOutDate', params.checkOutDate);
                if (params.priceMin != null) search.set('priceMin', String(params.priceMin));
                if (params.priceMax != null) search.set('priceMax', String(params.priceMax));
                if (params.roomType) search.set('roomType', params.roomType.toLowerCase());
                if (params.guests != null) search.set('guests', String(params.guests));
                if (params.rooms != null) search.set('rooms', String(params.rooms));
                if (params.minRating != null) search.set('minRating', String(params.minRating));
                if (params.page != null) search.set('page', String(params.page));
                if (params.limit != null) search.set('limit', String(params.limit));
                const qs = search.toString();
                return {
                    url: `${endpoint.GET_HOTELS_FILTER}${qs ? `?${qs}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Hotel'],
        }),
        getHotelBookingsForUser: builder.query({
            query: () => ({
                url: endpoint.GET_ALL_HOTEL_BOOKINGS_FOR_USER,
                method: 'GET',
            }),
            providesTags: ['Hotel'],
        }),
        getSingleHotelBooking: builder.query({
            query: (id: number) => ({
                url: endpoint.GET_SINGLE_HOTEL_BOOKING(id),
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Hotel' as const, id: `booking-${id}` }],
        }),
        updateHotelBookingStatus: builder.mutation({
            query: ({ id, status }: { id: number; status: string }) => ({
                url: endpoint.UPDATE_HOTEL_BOOKING_STATUS(id),
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Hotel'],
        }),
    })
});

export { hotelApi };
export const {
    useLazyGetHotelsQuery,
    useCheckAvailabilityMutation,
    useCreateHotelBookingMutation,
    useGetHotelBookingsForUserQuery,
    useGetSingleHotelBookingQuery,
    useUpdateHotelBookingStatusMutation,
    useLazyGetFilteredHotelsQuery,
} = hotelApi;