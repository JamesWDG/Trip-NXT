
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
    RESTAURANT_GET: (page: number, limit?: number) => string;
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
    CAB_ONLINE_VENDORS: string;
    CAB_NEARBY_VENDORS: string;
    NOTIFICATION_REGISTER_TOKEN: string;
    RIDE_CREATE: string;
    RIDE_MY_ACTIVE: string;
    RIDE_MY_HISTORY: string;
    RIDE_USER: (rideId: number) => string;
    RIDE_ACCEPT_OFFER: (rideId: number) => string;
    RIDE_REJECT_OFFER: (rideId: number) => string;
    RIDE_CANCEL: (rideId: number) => string;
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
    RESTAURANT_GET: (page: number, limit?: number) => limit != null ? `restaurant/get?page=${page}&limit=${limit}` : `restaurant/get?page=${page}`,
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
    CAB_ONLINE_VENDORS: 'cab/online-vendors',
    CAB_NEARBY_VENDORS: 'cab/nearby-vendors',
    NOTIFICATION_REGISTER_TOKEN: 'notification/register-token',
    RIDE_CREATE: 'ride',
    RIDE_MY_ACTIVE: 'ride/my/active',
    RIDE_MY_HISTORY: 'ride/my/history',
    RIDE_USER: (rideId: number) => `ride/user/${rideId}`,
    RIDE_ACCEPT_OFFER: (rideId: number) => `ride/${rideId}/accept-offer`,
    RIDE_REJECT_OFFER: (rideId: number) => `ride/${rideId}/reject-offer`,
    RIDE_CANCEL: (rideId: number) => `ride/${rideId}/cancel`,
}