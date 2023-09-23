import React from 'react';
import { OsuMap } from "@/interfaces/Map";
import MapCard from "@/components/MapCard";

interface MapCardListProps {
    maps: OsuMap[]
    mapsOld: OsuMap[] | null
}

const MapCardList = (props: MapCardListProps) => {

    return (
        <div className="flex flex-col gap-2">
            {
                props.maps.map((map) =>
                    <MapCard map={map} oldMap={props.mapsOld?.filter(o => o.id === map.id)
                        ? props.mapsOld?.filter(o => o.id === map.id)[0]
                        : null} key={map.id} 
                        />
                )
            }
        </div>
    );
};

export default MapCardList;