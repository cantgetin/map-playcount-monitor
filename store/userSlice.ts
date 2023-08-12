import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import { User, emptyUser } from '@/interfaces/User';
import { LoadingState } from '@/interfaces/LoadingState';
import { RootState } from './store';
import { getUserWithRetry } from '@/utils/utils';

interface UserState {
    user: User | null
    loading: LoadingState
}

const initialState: UserState = {
    user: null,
    loading: LoadingState.Idle,
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (arg: undefined, thunkAPI) : Promise<User> => {
        const stateUser = selectUser(thunkAPI.getState() as RootState);
        if (stateUser !== null) {
            return stateUser;
        }

        let userStr = localStorage.getItem("user")
        let userLastTimeFetched = localStorage.getItem("user_last_time_fetched")

        let user: User = JSON.parse(userStr!)
        let now = new Date()

        if (user == null) {
            user = await getUserWithRetry()
            localStorage.setItem("user_last_time_fetched", now.getTime().toString())
            localStorage.setItem("user", JSON.stringify(user))
            return user
        }

        if (userLastTimeFetched == null) {
            userLastTimeFetched = now.getTime().toString()
            localStorage.setItem("user_last_time_fetched", userLastTimeFetched)
        }

        // Check if user is already fetched in the last 24 hours
        if (now.getTime() - Number(userLastTimeFetched) <= 24 * 60 * 60 * 1000) {
            return user
        }
        // If not, fetch it and save it
        else {
            user = await getUserWithRetry()
            localStorage.setItem("user_last_time_fetched", now.getTime().toString())
            localStorage.setItem("user", JSON.stringify(user))
            return user
        }
    }
)

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload
            state.loading = LoadingState.Succeeded
        })
        builder.addCase(fetchUser.pending, (state, action) => {
            state.loading = LoadingState.Pending
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = LoadingState.Failed
        })
    },
})

export const {} = userSlice.actions

export const selectUser = (state: RootState) => state.user.user
export const selectUserLoading = (state: RootState) => state.user.loading

export default userSlice.reducer