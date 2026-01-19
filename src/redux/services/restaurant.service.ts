import { endpoint } from "../../constants/api";
import { baseApi } from "./api";


export const restaurantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        restaurantGet: builder.query({
            query: (page: number) => ({
                url: endpoint.RESTAURANT_GET(page),
                method: 'GET',
            }),
            providesTags: ['Restaurant']
        }),
        restaurantGetMenu: builder.query({
            query: (id: number) => ({
                url: endpoint.RESTAURANT_GET_MENU(id),
                method: 'GET',
            }),
            providesTags: ['Restaurant']
        })
    })
});

export const { useLazyRestaurantGetQuery, useLazyRestaurantGetMenuQuery } = restaurantApi;