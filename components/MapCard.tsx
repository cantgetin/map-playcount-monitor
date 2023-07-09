import React from 'react';
import {OsuMap} from "@/interfaces/Map";
import Image from 'next/image';

interface MapCardProps {
    map: OsuMap
}
const MapCard = (props: MapCardProps) => {
    return (
        <div className="flex bg-slate-900 text-white gap-2 w-full">
            <div>
                <img src={props.map.covers.card} width="200" height="auto" alt="map bg"/>
            </div>
            <div>
                <div>{props.map.artist} - {props.map.title}</div>
                <div>{props.map.beatmaps[0].playcount}</div>
            </div>
        </div>
    );
};

export default MapCard;