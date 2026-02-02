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
    })
});

export { hotelApi };
export const { useLazyGetHotelsQuery, useCheckAvailabilityMutation, useCreateHotelBookingMutation } = hotelApi;