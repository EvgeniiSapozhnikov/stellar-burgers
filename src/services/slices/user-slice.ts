import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@api';
import type { TLoginData, TRegisterData } from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import type { TUser } from '@utils-types';

import type { RootState } from '../store';

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null,
};

export const initUser = createAsyncThunk('user/initUser', async () => {
  if (!getCookie('accessToken') && !localStorage.getItem('refreshToken')) {
    return null;
  }
  const res = await getUserApi();
  return res.user;
});

const saveAuthTokens = (refreshToken: string, accessToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  (data: TLoginData) =>
    loginUserApi(data).then((res) => {
      saveAuthTokens(res.refreshToken, res.accessToken);
      return res.user;
    })
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  (data: TRegisterData) =>
    registerUserApi(data).then((res) => {
      saveAuthTokens(res.refreshToken, res.accessToken);
      return res.user;
    })
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  (data: Partial<TRegisterData>) => updateUserApi(data).then((res) => res.user)
);

export const logout = createAsyncThunk('user/logout', () =>
  logoutApi().then(() => {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  })
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // initUser: определяем, залогинен ли пользователь при старте приложения
      .addCase(initUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(initUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const userSelectors = {
  selectUserState: (state: RootState): TUserState => state.user,
  selectUser: (state: RootState): TUser | null => state.user.user,
  selectIsAuthChecked: (state: RootState): boolean => state.user.isAuthChecked,
  selectError: (state: RootState): string | null => state.user.error,
};

export default userSlice.reducer;
