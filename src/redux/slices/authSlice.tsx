import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authService';



interface User {
  id?: string;
  email?: string;
  password?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogout: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
    setCredentials: (state, action) => {
      if (action.payload?.accessToken) state.token = action.payload.accessToken;
      if (action.payload?.refreshToken) state.refreshToken = action.payload.refreshToken;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    saveCredentials: (state, action) => {
      state.user = {
        ...state.user,
        email: action.payload?.email,
        password: '',
        name: action.payload?.name,
        phoneNumber: action.payload?.phoneNumber,
        address: action.payload?.address,
      };
    },
    clearCredentials: state => {
      state.user = {
        ...state.user,
        email: undefined,
        password: undefined,
        id: undefined,
        name: undefined,
        phoneNumber: undefined,
        address: undefined,
      };
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.otpVerification.matchFulfilled,
      (state, action) => {
        if (action.payload?.data && action.payload?.data?.type !== 'reset') {
          state.token = action.payload.data?.accessToken;
          if (action.payload.data?.refreshToken) state.refreshToken = action.payload.data.refreshToken;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        if (action.payload?.data) {
          state.token = action.payload.data?.accessToken;
          if (action.payload.data?.refreshToken) state.refreshToken = action.payload.data.refreshToken;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.socialLogin.matchFulfilled,
      (state, action) => {
        if (action.payload?.data) {
          state.token = action.payload.data?.accessToken;
          if (action.payload.data?.refreshToken) state.refreshToken = action.payload.data.refreshToken;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action) => {
        if (action.payload?.data) {
          state.token = action.payload.data?.accessToken;
          if (action.payload.data?.refreshToken) state.refreshToken = action.payload.data.refreshToken;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state, action) => {
        if (action.payload?.data) {
          state.token = null;
          state.refreshToken = null;
          state.user = null;
        }
      },
    );
  },
});

export const { setLogout, setRememberMe, saveCredentials, clearCredentials, setCredentials } =
  authSlice.actions;

export default authSlice.reducer;
