import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { resetConstructor } from './constructor-slice';

import type { RootState } from '../store';
import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  loginError: null,
  registerError: null,
  updateUserError: null,
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

export const loginUser = createAsyncThunk('user/loginUser', (data: TLoginData) =>
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

export const logout = createAsyncThunk('user/logout', async (_, { dispatch }) => {
  try {
    await logoutApi();
  } finally {
    /* Локальный выход выполняем всегда, даже если сервер не ответил */
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    /* Конструктор — собственность браузера, а не аккаунта:
         другому пользователю чужой бургер видеться не должен */
    dispatch(resetConstructor());
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(initUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.error.message ?? null;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.error.message ?? null;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError = action.error.message ?? null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loginError = null;
        state.registerError = null;
        state.updateUserError = null;
      });
  },
});

export const userSelectors = {
  selectUserState: (state: RootState): TUserState => state.user,
  selectUser: (state: RootState): TUser | null => state.user.user,
  selectIsAuthChecked: (state: RootState): boolean => state.user.isAuthChecked,
  selectLoginError: (state: RootState): string | null => state.user.loginError,
  selectRegisterError: (state: RootState): string | null => state.user.registerError,
  selectUpdateUserError: (state: RootState): string | null => state.user.updateUserError,
};

export default userSlice.reducer;
