import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoadingState } from '@/interfaces/LoadingState';
import { RootState } from './store';
import { getUserBeatmapsWithRetry } from '@/utils/utils';
import { OsuMap } from '@/interfaces/Map';

interface MapsState {
    maps: OsuMap[] | null
    loading: LoadingState
}

const initialState: MapsState = {
    maps: null,
    loading: LoadingState.Idle,
}

const calculatePlaysOnAllDiffs = (map: OsuMap): number => {
    let sum = 0
    map.beatmaps.forEach((b) => {
        sum += b.playcount
    })
    return sum
}

export const fetchMaps = createAsyncThunk(
    'maps/fetchMaps',
    async (userId: number, thunkAPI): Promise<OsuMap[]> => {
        const stateMaps = selectMaps(thunkAPI.getState() as RootState);
        if (stateMaps != null) {
            return stateMaps;
        }

        let mapsStr = localStorage.getItem("maps")
        let mapsLastTimeFetched = localStorage.getItem("maps_last_time_fetched")

        let maps: OsuMap[] = JSON.parse(mapsStr!)
        let now = new Date()

        if (maps == null) {
            maps = await getUserBeatmapsWithRetry(userId)
            maps.sort((a, b) => calculatePlaysOnAllDiffs(b) - calculatePlaysOnAllDiffs(a))
            localStorage.setItem("maps_last_time_fetched", now.getTime().toString())
            localStorage.setItem("maps", JSON.stringify(maps))
            return maps
        }

        if (mapsLastTimeFetched == null) {
            mapsLastTimeFetched = now.getTime().toString()
            localStorage.setItem("maps_last_time_fetched", mapsLastTimeFetched)
        }

        // Check if maps is already fetched in the last 24 hours
        if (now.getTime() - Number(mapsLastTimeFetched) <= 24 * 60 * 60 * 1000) {
            return maps
        }
        // If not, fetch it and save it
        else {
            maps = await getUserBeatmapsWithRetry(userId)
            maps.sort((a, b) => calculatePlaysOnAllDiffs(b) - calculatePlaysOnAllDiffs(a))
            localStorage.setItem("maps_last_time_fetched", now.getTime().toString())
            localStorage.setItem("maps", JSON.stringify(maps))
            return maps
        }
    }
)

const mapsSlice = createSlice({
    name: 'Maps',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchMaps.fulfilled, (state, action) => {
            state.maps = action.payload
            state.loading = LoadingState.Succeeded
        })
        builder.addCase(fetchMaps.pending, (state, action) => {
            state.loading = LoadingState.Pending
        })
        builder.addCase(fetchMaps.rejected, (state, action) => {
            state.loading = LoadingState.Failed
        })
    },
})

export const { } = mapsSlice.actions

export const selectMaps = (state: RootState) => state.maps.maps
export const selectMapsLoading = (state: RootState) => state.maps.loading

export default mapsSlice.reducer