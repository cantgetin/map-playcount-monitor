import React from 'react';
import {OsuMap} from "@/interfaces/Map";
import MapCard from "@/components/MapCard";

interface MapCardListProps {
    maps: OsuMap[]
}

const MapCardList = (props: MapCardListProps) => {

    return (
        <div className="flex flex-col gap-2 py-2">
            {
                props.maps.map((map) =>
                    <MapCard map={map} key={map.id}/>
                )
            }
        </div>
    );
};

export default MapCardList;