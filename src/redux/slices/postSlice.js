// src/redux/slices/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiConnector } from '../../services/apiconnector'; // Adjust the path as necessary
import { endpoints } from '../../services/apis';

const { GET_ALL_POSTS_API } = endpoints;

const initialState = {
    posts: [],
    loading: false,
    error: null,
};

// Async thunk to fetch posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await apiConnector('GET', GET_ALL_POSTS_API);
    return response.data.posts; // Adjust based on your API response
});

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload; // Store the fetched posts
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default postSlice.reducer;
