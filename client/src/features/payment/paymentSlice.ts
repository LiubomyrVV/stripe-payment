import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PaymentState {
    clientSecret: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    clientSecret: null,
    loading: false,
    error: null,
};

export const createPaymentIntent = createAsyncThunk(
    'payment/createPaymentIntent',
    async (amount: number, thunkAPI) => {
        try {
            const response = await axios.post('/create-payment-intent', { amount });
            return response.data.clientSecret;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentIntent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.clientSecret = action.payload;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default paymentSlice.reducer;
