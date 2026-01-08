
type endpointTypes = {
    LOGIN: string;
    SIGNUP: string;
    LOGOUT: string;
    FORGOT_PASSWORD: string;
    VERIFY_OTP: string;
    RESEND_OTP: string;
    RESET_PASSWORD: string;
    GET_USER_PROFILE: string;
    UPDATE_USER_PROFILE: (id: number) => string;
}

// export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1/'
export const BASE_URL: string = 'http://192.168.0.108:5003/api/v1' //live
export const endpoint: endpointTypes = {
    LOGIN: 'user/login',
    SIGNUP: 'user/register',
    LOGOUT: 'user/logout',
    FORGOT_PASSWORD: 'user/forget-password',
    VERIFY_OTP: 'user/verify-otp',
    RESEND_OTP: 'user/resend-otp',
    RESET_PASSWORD: 'user/reset-password',
    GET_USER_PROFILE: '/user/get-auth-user',
    UPDATE_USER_PROFILE: (id:number) => `/user/update-user/${id}`,

}