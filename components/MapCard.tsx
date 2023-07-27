import React from 'react';
import {OsuMap} from "@/interfaces/Map";
interface MapCardProps {
    map: OsuMap
}
const MapCard = (props: MapCardProps) => {

    const calculatePlaysOnAllDiffs = (map) : number => {
        let sum = 0
        map.beatmaps.forEach((b) => {
            sum += b.playcount
        })
        return sum
    }

    return (
        <div className="flex bg-zinc-900 text-white w-full">
            <div>
                <img src={props.map.covers.card} width="200" height="auto" alt="map bg"/>
            </div>
            <div className="p-2">
                <div className="text-l">{props.map.artist} - {props.map.title}</div>
                <h1 className="text-xl text-yellow-200">{calculatePlaysOnAllDiffs(props.map)} plays</h1>
            </div>
        </div>
    );
};

export default MapCard;