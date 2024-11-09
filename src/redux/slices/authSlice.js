import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiconnector';
import { endpoints } from '../../services/apis';

const { LOGIN_API, SIGNUP_API, SEND_OTP_API } = endpoints;

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

// Send OTP action
export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
    try {
        const response = await apiConnector('POST', SEND_OTP_API, { email });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Login action
export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await apiConnector('POST', LOGIN_API, { email, password });
        localStorage.setItem('token', response.token); // Store token during login
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Signup action
export const signup = createAsyncThunk('auth/signup', async ({ userDetails, otp }, { rejectWithValue }) => {
    try {
        const response = await apiConnector('POST', SIGNUP_API, { ...userDetails, otp });
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('token');
        },
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload; // Set authentication state
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.fulfilled, (state) => {
                toast.success('OTP sent successfully');
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.error = action.payload;
                toast.error('Failed to send OTP');
            })
            .addCase(signup.fulfilled, (state) => {
                state.isAuthenticated = false;
                toast.success('Signup Successful. Please login.');
            })
            .addCase(signup.rejected, (state, action) => {
                state.error = action.payload;
                toast.error('Signup Failed');
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                toast.success('Login Successful');
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
                toast.error('Login Failed');
            });
    },
});

export const { logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
