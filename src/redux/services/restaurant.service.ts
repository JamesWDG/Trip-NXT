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
        }),
        createOrder: builder.mutation({
            query: (data: {totalAmount: number,subTotal: number, discountId: number, tax: number, deliveryFee  : number, orderItems : {itemId: number, quantity: number, price: number, itemToppings: number[]}[], deliveryAddress: any}) => ({
                url: endpoint.CREATE_ORDER,
                method: 'POST',
                body: data,
            })
        }),
        getItemWithId: builder.query({
            query: (id: string) => ({
                url: endpoint.GET_ITEM_WITH_ID(id),
                method: 'GET',
            })
        })
    })
});

export const { useLazyRestaurantGetQuery, useLazyRestaurantGetMenuQuery, useCreateOrderMutation, useLazyGetItemWithIdQuery } = restaurantApi;