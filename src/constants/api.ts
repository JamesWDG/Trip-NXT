
type endpointTypes = {
    LOGIN: string;
    SIGNUP: string;
    LOGOUT: string;
    FORGOT_PASSWORD: string;
    VERIFY_OTP: string;
    RESEND_OTP: string;
    RESET_PASSWORD: string;
    GET_USER_PROFILE: string;
    SOCIAL_LOGIN: string;
    UPDATE_USER_PROFILE: (id: number) => string;
    RESTAURANT_GET: (page: number) => string;
    RESTAURANT_GET_MENU: (id: number) => string;
    CREATE_ORDER: string;
    GET_ITEM_WITH_ID: (id: string) => string;
    GET_HOTELS: string;
    CHECK_AVAILABILITY: string;
    CREATE_BOOKING: string;
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
    GET_USER_PROFILE: '/user/get-auth-user',
    SOCIAL_LOGIN: 'user/social-login',
    UPDATE_USER_PROFILE: (id:number) => `/user/update-user/${id}`,
    RESTAURANT_GET: (page:number) => `restaurant/get?page=${page}`,
    RESTAURANT_GET_MENU: (id:number) => `restaurant/get-restaurant-with-menu/${id}`,
    CREATE_ORDER: 'order/create-order',
    GET_ITEM_WITH_ID: (id) => `menu/get-cart-items/${id}`,
    GET_HOTELS: 'hotel/',
    CHECK_AVAILABILITY: '/booking/check-availability',
    CREATE_BOOKING: 'booking',
}