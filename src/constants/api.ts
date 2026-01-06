
type endpointTypes = {
    LOGIN: string;
    SIGNUP: string;
    LOGOUT: string;
    FORGOT_PASSWORD: string;
    VERIFY_OTP: string;
    RESEND_OTP: string;
    RESET_PASSWORD: string;
}

export const BASE_URL: string = 'https://api.trip-nxt.com/api/v1/user/'

export const endpoint: endpointTypes = {
    LOGIN: 'login',
    SIGNUP: 'register',
    LOGOUT: 'logout',
    FORGOT_PASSWORD: 'forget-password',
    VERIFY_OTP: 'verify-otp',
    RESEND_OTP: 'resend-otp',
    RESET_PASSWORD: 'reset-password',
}