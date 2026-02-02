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
        })
    })
});

export const { useLazyGetHotelsQuery, useCheckAvailabilityMutation } = hotelApi;