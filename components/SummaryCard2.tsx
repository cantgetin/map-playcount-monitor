import { OsuMap } from "@/interfaces/Map"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectMaps, selectOldMaps, selectMapsLastTimeFetched, selectMapsOldLastTimeFetched, fetchMaps, forceFetchMaps } from "@/store/mapsSlice"
import { selectUser } from "@/store/userSlice"
import { getTimeAgoString, unixTimestampToDate } from "@/utils/utils"
import { useEffect, useState } from "react"

const types = ['graveyard', 'loved', 'nominated', 'pending', 'ranked', 'wip']

const SummaryCard2 = () => {
    const dispatch = useAppDispatch();

    // add hook for this stuff below
    const { user, maps, mapsOld, mapsLastTimeFetched, mapsOldLastTimeFetched } = useAppSelector((state) => ({
        user: selectUser(state),
        maps: selectMaps(state),
        mapsOld: selectOldMaps(state),
        mapsLastTimeFetched: selectMapsLastTimeFetched(state),
        mapsOldLastTimeFetched: selectMapsOldLastTimeFetched(state),
    }));

    const forceRefresh = () => {
        if (user != null) dispatch(forceFetchMaps(user.id));
    }

    return (
        <div className="bg-zinc-900 w-full rounded-lg flex flex-col gap-2 mt-auto">
            <div className="bg-green-600 px-2 py-1 rounded-lg text-xs cursor-pointer w-fit select-none hover:bg-green-700"
                onClick={forceRefresh}>
                Refresh ⭮
            </div>
            <div className="text-xs text-zinc-400">
                <div>Last fetched {getTimeAgoString(mapsLastTimeFetched)}</div>
                {
                    mapsOldLastTimeFetched ?
                        <div>Previously fetched {getTimeAgoString(mapsOldLastTimeFetched)} ago</div>
                        : null
                }
            </div>
            <div className="flex flex-wrap gap-2">
                {
                    maps != null ?
                        types.map((type) => {
                            if (maps.filter(o => o.status == type).length == 0) return null
                            else return (
                                <div key={type} className="bg-zinc-800 px-2 py-1 rounded-lg text-sm cursor-pointer">
                                    {type} {maps.filter(o => o.status == type).length}
                                </div>
                            )
                        }
                        )
                        : null
                }
            </div>
        </div>
    )
}

export default SummaryCard2