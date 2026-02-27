import { endpoint } from "../../constants/api";
import { baseApi } from "./api";


export const restaurantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        restaurantGet: builder.query({
            query: (args: number | { page: number; limit?: number, search?: string }) => {
                const page = typeof args === 'number' ? args : args.page;
                const limit = typeof args === 'number' ? undefined : args.limit;
                const search = typeof args === 'number' ? undefined : args.search;
                return {
                    url: endpoint.RESTAURANT_GET(page, limit, search || ''),
                    method: 'GET',
                };
            },
            providesTags: ['Restaurant']
        }),
        getFilteredRestaurants: builder.query({
            query: (params: {
                city?: string;
                minRadius?: number;
                maxRadius?: number;
                day?: string;
                time?: string;
                page?: number;
                limit?: number;
            }) => {
                const search = new URLSearchParams();
                if (params.city) search.set('city', params.city);
                if (params.minRadius != null) search.set('minRadius', String(params.minRadius));
                if (params.maxRadius != null) search.set('maxRadius', String(params.maxRadius));
                if (params.day) search.set('day', params.day);
                if (params.time) search.set('time', params.time);
                if (params.page != null) search.set('page', String(params.page));
                if (params.limit != null) search.set('limit', String(params.limit));
                const qs = search.toString();
                return {
                    url: `${endpoint.RESTAURANT_FILTER}${qs ? `?${qs}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Restaurant'],
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
        }),
        getPopularMenus: builder.query({
            query: (limit?: number) => ({
                url: limit != null ? `${endpoint.MENU_POPULAR}?limit=${limit}` : endpoint.MENU_POPULAR,
                method: 'GET',
                invalidatesTags: ['Menu'],
            }),
            providesTags: ['Restaurant','Menu'],
        }),
        getOrdersByUserId: builder.query({
            query: () => ({
                url: endpoint.GET_ORDERS_BY_USER_ID,
                method: 'GET',
            }),
            providesTags: ['Restaurant'],
        }),
        getSingleOrder: builder.query({
            query: (id: number) => ({
                url: endpoint.GET_SINGLE_ORDER(id),
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Restaurant' as const, id: `order-${id}` }],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }: { orderId: number; status: string; }) => ({
                url: endpoint.UPDATE_ORDER_STATUS(orderId),
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                'Restaurant',
                { type: 'Restaurant' as const, id: `order-${orderId}` },
            ],
        }),
        getFeaturedItems: builder.query({
            query: (id: number) => ({
                url: endpoint.GET_FEATURED_ITEMS(id),
                method: 'GET',
            }),
        }),
        getItemsByCategory: builder.query({
            query: (params : {category: string, restaurant:number}) => ({
                url: endpoint.GET_ITEMS_BY_CATEGORY,
                method: 'GET',
                params
            })
        })
    })
});

export const {
    useLazyRestaurantGetQuery,
    useLazyGetFilteredRestaurantsQuery,
    useLazyRestaurantGetMenuQuery,
    useCreateOrderMutation,
    useLazyGetItemWithIdQuery,
    useGetOrdersByUserIdQuery,
    useGetSingleOrderQuery,
    useUpdateOrderStatusMutation,
    useLazyGetPopularMenusQuery,
    useLazyGetFeaturedItemsQuery,
    useLazyGetItemsByCategoryQuery,
} = restaurantApi;