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
        <>
            <h1 className="text-2xl">
                {props.user.graveyard_beatmapset_count + props.user.unranked_beatmapset_count} Maps fetched
            </h1>
            <div className="text-xl text-yellow-200">
                {calculateTotalPlays(props.maps)} Plays now
                {props.mapsOld ? 
                    <div className="text-sm text-orange-200">{calculateTotalPlays(props.mapsOld)} Plays last time</div> 
                    : null
                }
            </div>
            {props.mapsOld ?
                <div className="flex flex-col mt-auto ml-auto">
                    <div className="flex gap-2 justify-center items-center ml-auto px-2">
                        <h1 className="text-xs text-green-300">▲</h1>
                        <h1 className="text-2xl text-green-300">{calculateTotalPlays(props.maps) - calculateTotalPlays(props.mapsOld)}</h1>
                    </div>
                    <div className="text-xs text-zinc-400">total plays for last 8 days</div>
                </div>
                : null
            }

        </>
    );
};

export default SummaryCard;