import { endpoint } from "../../constants/api";
import { baseApi } from "./api";

const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createWishlist: builder.mutation({
            query: (data: { dishId?: number, hotelId?: number }) => ({
                url: endpoint.ADD_TO_WISHLIST,
                method: 'POST',
                body: data,
                providesTags: ['Menu', 'Hotel'],
            })
        }),
        deleteFromWishlist: builder.mutation({
            query: ({ id, type }: { id: number, type: 'hotel' | 'dish' }) => ({
                url: endpoint.DELETE_FROM_WISHLIST(id, type),
                method: 'DELETE',
                providesTags: ['Menu', 'Hotel'],
            })
        }),
        getWishlist: builder.query({
            query: () => ({
                url: endpoint.GET_WISHLIST,
                method: 'GET',
            })
        })
    })
})

export const { useCreateWishlistMutation, useDeleteFromWishlistMutation, useLazyGetWishlistQuery } = wishlistApi;