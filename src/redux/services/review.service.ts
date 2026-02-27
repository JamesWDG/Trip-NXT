import { endpoint } from "../../constants/api";
import { baseApi } from "./api";


export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (data) => ({
                url: endpoint.CREATE_REVIEW,
                method: 'POST',
                body: data,
            }) 
        }),
        getReviewsByRestaurantId: builder.query({
            query: (id: number) => ({
                url: endpoint.GET_REVIEWS_BY_RESTAURANT_ID(id),
                method: 'GET',
            })
        }),
        getReviewsByMenuItemId: builder.query({
            query: (id: number) => ({
                url: endpoint.GET_REVIEWS_BY_MENU_ITEM_ID(id),
                method: 'GET',
            })
        })
    }),
})

export const {useCreateReviewMutation, useLazyGetReviewsByRestaurantIdQuery, useLazyGetReviewsByMenuItemIdQuery} = reviewApi;