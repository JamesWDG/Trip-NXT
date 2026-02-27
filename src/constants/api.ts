
type endpointTypes = {
    LOGIN: string;
    SIGNUP: string;
    LOGOUT: string;
    REFRESH_TOKEN: string;
    FORGOT_PASSWORD: string;
    VERIFY_OTP: string;
    RESEND_OTP: string;
    RESET_PASSWORD: string;
    GET_USER_PROFILE: string;
    SOCIAL_LOGIN: string;
    UPDATE_USER_PROFILE: (id: number) => string;
    RESTAURANT_GET: (page: number, limit?: number, search?: string) => string;
    RESTAURANT_FILTER: string;
    RESTAURANT_GET_MENU: (id: number) => string;
    CREATE_ORDER: string;
    GET_ITEM_WITH_ID: (id: string) => string;
    MENU_POPULAR: string;
    GET_HOTELS: string;
    GET_HOTELS_FILTER: string;
    CHECK_AVAILABILITY: string;
    CREATE_BOOKING: string;
    GET_ORDERS_BY_USER_ID: string;
    GET_SINGLE_ORDER: (id: number) => string;
    UPDATE_ORDER_STATUS: (id: number) => string;
    GET_ALL_HOTEL_BOOKINGS_FOR_USER: string;
    GET_SINGLE_HOTEL_BOOKING: (id: number) => string;
    UPDATE_HOTEL_BOOKING_STATUS: (id: number) => string;
    ADD_TO_WISHLIST: string;
    DELETE_FROM_WISHLIST: (id: number, type: 'hotel' | 'dish') => string;
    GET_WISHLIST: string;
    CREATE_REVIEW: string;
    GET_REVIEWS_BY_RESTAURANT_ID: (id: number) => string;
    GET_REVIEWS_BY_MENU_ITEM_ID: (id: number) => string;
    GET_FEATURED_ITEMS: (id: number) => string;
    GET_ITEMS_BY_CATEGORY: string;
    GET_ACCOMODATION_ITEMS_BY_CATEGORY: string;
}

export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1/'
//  export const BASE_URL: string = 'https://immaterial-overfrequently-audrie.ngrok-free.dev/api/v1/' // ngrok
// export const BASE_URL: string = 'http://192.168.0.108:5003/api/v1' //live

export const endpoint: endpointTypes = {
    LOGIN: 'user/login',
    SIGNUP: 'user/register',
    LOGOUT: 'user/logout',
    FORGOT_PASSWORD: 'user/forget-password',
    VERIFY_OTP: 'user/verify-otp',
    RESEND_OTP: 'user/resend-otp',
    RESET_PASSWORD: 'user/reset-password',
    REFRESH_TOKEN: 'user/refresh-token',
    GET_USER_PROFILE: '/user/get-auth-user',
    SOCIAL_LOGIN: 'user/social-login',
    UPDATE_USER_PROFILE: (id:number) => `/user/update-user/${id}`,
    RESTAURANT_GET: (page: number, limit?: number, search?: string) => limit != null ? `restaurant/get?page=${page}&limit=${limit}&search=${search || ''}` : `restaurant/get?page=${page}&search=${search || ''}`,
    RESTAURANT_FILTER: 'restaurant/filter',
    RESTAURANT_GET_MENU: (id:number) => `restaurant/get-restaurant-with-menu/${id}`,
    CREATE_ORDER: 'order/create-order',
    GET_ITEM_WITH_ID: (id) => `menu/get-cart-items/${id}`,
    MENU_POPULAR: 'menu/popular',
    GET_HOTELS: 'hotel/',
    GET_HOTELS_FILTER: 'hotel/filter',
    CHECK_AVAILABILITY: '/booking/check-availability',
    CREATE_BOOKING: 'booking',
    GET_ORDERS_BY_USER_ID: 'order/get-orders-by-user-id',
    GET_SINGLE_ORDER: (id: number) => `order/get-single-order/${id}`,
    UPDATE_ORDER_STATUS: (id: number) => `order/update-order-status/${id}`,
    GET_ALL_HOTEL_BOOKINGS_FOR_USER: 'booking/get-all-hotel-bookings-for-user',
    GET_SINGLE_HOTEL_BOOKING: (id: number) => `booking/get-single-hotel-booking/${id}`,
    UPDATE_HOTEL_BOOKING_STATUS: (id: number) => `booking/update-hotel-booking-status/${id}`,
    ADD_TO_WISHLIST: 'wishlist/',
    DELETE_FROM_WISHLIST: (id: number, type: 'hotel' | 'dish') => `wishlist/${id}/${type}`,
    GET_WISHLIST: 'wishlist/',
    CREATE_REVIEW: 'review/create-review',
    GET_REVIEWS_BY_RESTAURANT_ID: (id: number) => `review/get-reviews-by-restaurant-id/${id}`,
    GET_REVIEWS_BY_MENU_ITEM_ID: (id: number) => `review/get-reviews-by-menu-item-id/${id}`,
    GET_FEATURED_ITEMS: (id: number) => `menu/featured/${id}`,
    GET_ITEMS_BY_CATEGORY: "menu/category",
    GET_ACCOMODATION_ITEMS_BY_CATEGORY: "hotel/type",
}