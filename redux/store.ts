// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { categoryApiSlice } from './slices/categoryApiSlice'; // Adjust the path accordingly
import { userManagementApiSlice } from './slices/userManagementApiSlice';
import { userApiSlice } from './slices/userApiSlice';
import {lotInApiSlice} from './slices/stockInAPISlice';
import {lotMovementApiSlice} from './slices/LotMovementApiSlice';
import {stockOutApiSlice} from './slices/stockOutApiSlice';
import {supplierApiSlice } from './slices/supplierAPISlice';
import {colorApiSlice } from './slices/colorApiSlice';
import {fabricApiSlice } from './slices/fabricApiSlice';
import {gsmApiSlice } from './slices/gsmApiSlice';
import {knitTypeApiSlice } from './slices/knitTypeApiSlice';
import {customerApiSlice } from './slices/coustomerApiSlice';

const store = configureStore({
  reducer: {
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    [userManagementApiSlice.reducerPath]: userManagementApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer, // Both now have unique reducerPaths
    [lotInApiSlice.reducerPath]: lotInApiSlice.reducer, 
    [lotMovementApiSlice.reducerPath]: lotMovementApiSlice.reducer, 
    [stockOutApiSlice.reducerPath]: stockOutApiSlice.reducer, 
    [supplierApiSlice.reducerPath]: supplierApiSlice.reducer,
    [colorApiSlice.reducerPath]: colorApiSlice.reducer,
    [fabricApiSlice.reducerPath]: fabricApiSlice.reducer,
    [gsmApiSlice.reducerPath]: gsmApiSlice.reducer,
    [knitTypeApiSlice.reducerPath]: knitTypeApiSlice.reducer, 
    [customerApiSlice.reducerPath]: customerApiSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      categoryApiSlice.middleware,
      userManagementApiSlice.middleware, 
      userApiSlice.middleware,
      lotInApiSlice.middleware,
      lotMovementApiSlice.middleware,
      stockOutApiSlice.middleware,
      supplierApiSlice.middleware,
      colorApiSlice.middleware,
      fabricApiSlice.middleware,
      gsmApiSlice.middleware,
      knitTypeApiSlice.middleware,
      customerApiSlice.middleware,
    ),
});

setupListeners(store.dispatch);

export default store;
