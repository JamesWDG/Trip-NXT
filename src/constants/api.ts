
type endpointTypes = {
    LOGIN: string;
    SIGNUP: string;
    LOGOUT: string;
    FORGOT_PASSWORD: string;
    VERIFY_OTP: string;
    RESEND_OTP: string;
    RESET_PASSWORD: string;
}

export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1/'

export const endpoint: endpointTypes = {
    LOGIN: 'user/login',
    SIGNUP: 'user/register',
    LOGOUT: 'user/logout',
    FORGOT_PASSWORD: 'user/forget-password',
    VERIFY_OTP: 'verify-otp',
    RESEND_OTP: 'user/resend-otp',
    RESET_PASSWORD: 'user/reset-password',
}