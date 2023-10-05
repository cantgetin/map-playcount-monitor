import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoadingState } from '@/interfaces/LoadingState';
import { RootState } from './store';
import { getUserBeatmapsWithRetry } from '@/utils/utils';
import { OsuMap } from '@/interfaces/Map';

interface MapsState {
    maps: OsuMap[] | null
    mapsOld: OsuMap[] | null
    loading: LoadingState
    mapsLastTimeFetched: string
    mapsOldLastTimeFetched: string | null
}

const initialState: MapsState = {
    maps: null,
    mapsOld: null,
    loading: LoadingState.Idle,
    mapsLastTimeFetched: '',
    mapsOldLastTimeFetched: ''
}

const mapsFetchTimeoutSec = 12 * 60 * 60 * 1000

const calculatePlaysOnAllDiffs = (map: OsuMap): number => {
    let sum = 0
    map.beatmaps.forEach((b) => {
        sum += b.playcount
    })
    return sum
}

// todo: refactor this
export const fetchMaps = createAsyncThunk(
    'maps/fetchMaps',
    async (userId: number, thunkAPI): Promise<{
        maps: OsuMap[],
        mapsOld: OsuMap[] | null,
        mapsLastTimeFetched: string,
        mapsOldLastTimeFetched: string | null
    }> => {
        const stateMaps = selectMaps(thunkAPI.getState() as RootState);
        const stateOldMaps = selectOldMaps(thunkAPI.getState() as RootState);
        const stateMapsLastTimeFetched = selectMapsLastTimeFetched(thunkAPI.getState() as RootState);
        const stateMapsOldLastTimeFetched = selectMapsOldLastTimeFetched(thunkAPI.getState() as RootState);

        if (stateMaps != null) {
            return {
                maps: stateMaps,
                mapsOld: stateOldMaps,
                mapsLastTimeFetched: stateMapsLastTimeFetched,
                mapsOldLastTimeFetched: stateMapsOldLastTimeFetched
            };
        }

        let mapsStr = localStorage.getItem("maps")
        let mapsOldStr = localStorage.getItem("maps_old")
        let mapsLastTimeFetched = localStorage.getItem("maps_last_time_fetched")
        let mapsOldLastTimeFetched = localStorage.getItem("maps_old_last_time_fetched")

        let maps: OsuMap[] = JSON.parse(mapsStr!)
        let mapsOld: OsuMap[] = JSON.parse(mapsOldStr!)
        let now = new Date()

        // Assume that this is first time
        if (maps == null) {
            maps = await getUserBeatmapsWithRetry(userId)
            maps.sort((a, b) => calculatePlaysOnAllDiffs(b) - calculatePlaysOnAllDiffs(a))
            localStorage.setItem("maps_last_time_fetched", now.getTime().toString())
            localStorage.setItem("maps", JSON.stringify(maps))
            return {
                maps: maps,
                mapsOld: mapsOld,
                mapsLastTimeFetched: localStorage.getItem("maps_last_time_fetched")!,
                mapsOldLastTimeFetched: mapsOldLastTimeFetched
            }
        }

        // Assume that maps is not null here
        // Check if maps were fetched in the last 12 hours, if so return
        if (now.getTime() - Number(mapsLastTimeFetched) <= mapsFetchTimeoutSec) {
            return {
                maps: maps,
                mapsOld: mapsOld,
                mapsLastTimeFetched: mapsLastTimeFetched!,
                mapsOldLastTimeFetched: mapsOldLastTimeFetched
            }
        }
        // If not, save current maps, fetch the latest maps, save them too
        else {
            localStorage.setItem("maps_old", JSON.stringify(maps))
            let newMaps = await getUserBeatmapsWithRetry(userId)
            newMaps.sort((a, b) => calculatePlaysOnAllDiffs(b) - calculatePlaysOnAllDiffs(a))
            localStorage.setItem("maps_last_time_fetched", now.getTime().toString())
            localStorage.setItem("maps", JSON.stringify(newMaps))
            localStorage.setItem("maps_old_last_time_fetched", mapsLastTimeFetched!)
            return {
                maps: newMaps,
                mapsOld: maps,
                mapsLastTimeFetched: localStorage.getItem("maps_last_time_fetched")!,
                mapsOldLastTimeFetched: localStorage.getItem("maps_old_last_time_fetched")!
            }
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
            state.maps = action.payload.maps
            state.mapsOld = action.payload.mapsOld
            state.loading = LoadingState.Succeeded
            state.mapsLastTimeFetched = action.payload.mapsLastTimeFetched
            state.mapsOldLastTimeFetched = action.payload.mapsOldLastTimeFetched
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
export const selectOldMaps = (state: RootState) => state.maps.mapsOld

export const selectMapsLastTimeFetched = (state: RootState) => state.maps.mapsLastTimeFetched
export const selectMapsOldLastTimeFetched = (state: RootState) => state.maps.mapsOldLastTimeFetched

export const selectMapsLoading = (state: RootState) => state.maps.loading

export default mapsSlice.reducer