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
        })
    })
});

export const { useLazyGetHotelsQuery} = hotelApi;