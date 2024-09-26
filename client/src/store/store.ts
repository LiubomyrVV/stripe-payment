import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '../features/payment/paymentSlice';

const store = configureStore({
    reducer: {
        payment: paymentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;