import { OsuMap } from "@/interfaces/Map"
import { getTimeAgoString, unixTimestampToDate } from "@/utils/utils"
import { useEffect, useState } from "react"


interface MapFilterProps {
    maps: OsuMap[]
    mapsLastTimeFetched: string
    mapsOldLastTimeFetched: string | null
}

const types = ['graveyard', 'loved', 'nominated', 'pending', 'ranked', 'wip']

const SummaryCard2 = (props: MapFilterProps) => {

    return (
        <div className="bg-zinc-900 w-full rounded-lg flex flex-col gap-2 mt-auto">
            <div className="text-xs text-zinc-400">
                <div>Last fetched {getTimeAgoString(props.mapsLastTimeFetched)}</div>
                {
                    props.mapsOldLastTimeFetched ?
                        <div>Previously fetched {getTimeAgoString(props.mapsOldLastTimeFetched)}</div>
                        : null
                }
            </div>
            <div className="flex flex-wrap gap-2">
                {
                    types.map((type) => {
                        if (props.maps.filter(o => o.status == type).length == 0) return null
                        else return (
                            <div key={type} className="bg-zinc-800 px-2 py-1 rounded-lg text-sm cursor-pointer">
                                {type} {props.maps.filter(o => o.status == type).length}
                            </div>
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}

export default SummaryCard2