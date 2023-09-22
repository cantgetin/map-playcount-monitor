import React from 'react';
import { OsuMap } from "@/interfaces/Map";
import MapCard from "@/components/MapCard";
import { User } from '@/interfaces/User';

interface SummaryCardProps {
    user: User
    maps: OsuMap[]
    mapsOld: OsuMap[] | null
}

const SummaryCard = (props: SummaryCardProps) => {

    // total count of maps
    // total plays on all maps
    // total plays growth

    const calculateTotalPlays = (maps: OsuMap[]): number => {
        let sum = 0
        maps.forEach((map) => {
            map.beatmaps.forEach((b) => {
                sum += b.playcount
            })
        })

        return sum
    }

    return (
        <div className="bg-zinc-900 gap-2 p-2 w-72 flex flex-col text-right">
            <h1 className="text-2xl">
                {props.user.graveyard_beatmapset_count + props.user.unranked_beatmapset_count} Maps fetched
            </h1>
            <h1 className="text-xl text-yellow-200">
                {calculateTotalPlays(props.maps)} Plays now
            </h1>
            {props.mapsOld != null ?
                <>
                    <div className="text-sm text-orange-200">
                        {calculateTotalPlays(props.mapsOld)} Plays last time
                    </div>
                    <div className="p-2 flex gap-2 justify-center items-center mt-auto ml-auto">
                        <h1 className="text-xs text-green-300">▲</h1>
                        <h1 className="text-2xl text-green-300">{calculateTotalPlays(props.maps) - calculateTotalPlays(props.mapsOld)}</h1>
                    </div>
                </>
                : null
            }

        </div>
    );
};

export default SummaryCard;