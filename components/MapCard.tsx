import React from 'react';
import { OsuMap } from "@/interfaces/Map";
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
                <img src={props.map.covers.card} width="200" height="auto" alt="map bg" />
            </div>
            <div className="p-2 mr-auto">
                <div className="text-l">{props.map.artist} - {props.map.title}</div>
                <div className="flex gap-2 justify-left items-center">
                    <h1 className="text-xl text-yellow-200">{calculatePlaysOnAllDiffs(props.map)} plays</h1>
                    {props.oldMap && <h1 className="text-sm text-orange-200">were {calculatePlaysOnAllDiffs(props.oldMap)} plays</h1>}
                </div>
            </div>
            {props.oldMap &&
                <div className="p-2 flex gap-2 justify-center items-center">
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