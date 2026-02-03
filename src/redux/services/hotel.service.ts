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
} = hotelApi;