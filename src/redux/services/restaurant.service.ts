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
            query: ({ orderId, status, restaurantId }: { orderId: number; status: string; restaurantId: number }) => ({
                url: endpoint.UPDATE_ORDER_STATUS(orderId),
                method: 'PUT',
                body: { status, restaurantId },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                'Restaurant',
                { type: 'Restaurant' as const, id: `order-${orderId}` },
            ],
        }),
    })
});

export const {
    useLazyRestaurantGetQuery,
    useLazyRestaurantGetMenuQuery,
    useCreateOrderMutation,
    useLazyGetItemWithIdQuery,
    useGetOrdersByUserIdQuery,
    useGetSingleOrderQuery,
    useUpdateOrderStatusMutation,
} = restaurantApi;