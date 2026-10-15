import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredients-slice';
import feedReducer from './slices/feed-slice';
import ordersReducer from './slices/orders-slice';
import constructorReducer from './slices/constructor-slice';
import orderReducer from './slices/order-slice';
import userReducer from './slices/user-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  profileOrders: ordersReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
});
