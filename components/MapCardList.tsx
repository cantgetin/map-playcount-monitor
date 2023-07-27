import React from 'react';
import {OsuMap} from "@/interfaces/Map";
import MapCard from "@/components/MapCard";

interface MapCardListProps {
    maps: OsuMap[]
}

const MapCardList = (props: MapCardListProps) => {

    const calculatePlaysOnAllDiffs = (map: OsuMap): number => {
        let sum = 0
        map.beatmaps.forEach((b) => {
            sum += b.playcount
        })
        return sum
    }

    return (
        <div className="flex flex-col gap-2 py-2">
            {
                props.maps.sort((a, b) =>
                    calculatePlaysOnAllDiffs(b) - calculatePlaysOnAllDiffs(a)).map((map) =>
                    <MapCard map={map} key={map.id}/>
                )
            }
        </div>
    );
};

export default MapCardList;