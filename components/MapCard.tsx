import React from 'react';
import { OsuMap } from "@/interfaces/Map";
import { getMapRemainingPendingTime } from '@/utils/utils';
interface MapCardProps {
    map: OsuMap
    oldMap: OsuMap | null
}
const MapCard = (props: MapCardProps) => {

    const calculatePlaysOnAllDiffs = (map: OsuMap): number => {
        let sum = 0
        map.beatmaps.forEach((b) => {
            sum += b.playcount
        })
        return sum
    }

    return (
        <div className="flex bg-zinc-900 text-white w-full rounded-lg overflow-hidden">
            <div>
                <img src={props.map.covers.card} className='h-full' width="200" alt="map bg" style={{ objectFit: 'cover' }} />
            </div>
            <div className="px-2 py-1 mr-auto">
                <div className="text-l">{props.map.artist} - {props.map.title}</div>
                <div className="flex gap-2 justify-left items-baseline">
                    <h1 className="text-xl text-yellow-200">{calculatePlaysOnAllDiffs(props.map)} plays</h1>
                    {props.oldMap &&
                        <h1 className="text-sm h-full text-orange-200">
                            were {calculatePlaysOnAllDiffs(props.oldMap)} plays
                        </h1>}
                </div>
                <div className='text-xs text-zinc-500'>
                    {getMapRemainingPendingTime(props.map.last_updated) === '' ? props.map.status : getMapRemainingPendingTime(props.map.last_updated)}
                </div>
            </div>
            {props.oldMap &&
                <div className="p-4 flex gap-2 justify-center items-center">
                    {
                        calculatePlaysOnAllDiffs(props.map) - calculatePlaysOnAllDiffs(props.oldMap) > 0 ?
                            <>
                                <h1 className="text-xs text-green-300">▲</h1>
                                <h1 className="text-2xl text-green-300">{calculatePlaysOnAllDiffs(props.map) - calculatePlaysOnAllDiffs(props.oldMap)}</h1>
                            </>
                            : null
                    }
                </div>
            }
        </div>
    );
};

export default MapCard;