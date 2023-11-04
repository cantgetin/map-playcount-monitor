import React from 'react';
import { OsuMap } from "@/interfaces/Map";
import MapCard from "@/components/MapCard";
import { User } from '@/interfaces/User';
import { getTimeAgoString } from '@/utils/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectMaps, selectOldMaps, selectMapsLastTimeFetched, selectMapsOldLastTimeFetched } from '@/store/mapsSlice';
import { selectUser } from '@/store/userSlice';

const SummaryCard = () => {
    const dispatch = useAppDispatch();

    const { user, maps, mapsOld, mapsLastTimeFetched, mapsOldLastTimeFetched } = useAppSelector((state) => ({
        user: selectUser(state),
        maps: selectMaps(state),
        mapsOld: selectOldMaps(state),
        mapsLastTimeFetched: selectMapsLastTimeFetched(state),
        mapsOldLastTimeFetched: selectMapsOldLastTimeFetched(state),
    }));

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
            {user && maps ?
                    <>
                        <h1 className="text-2xl">
                            {user.graveyard_beatmapset_count + user.unranked_beatmapset_count} Maps fetched
                        </h1>
                        <div className="text-xl text-yellow-200">
                            {calculateTotalPlays(maps)} Plays now
                            {mapsOld ?
                                <div className="text-sm text-orange-200">{calculateTotalPlays(mapsOld)} Plays last time</div>
                                : null
                            }
                        </div>
                    </>
                    : null

            }
            {mapsOld ?
                <div className="flex flex-col mt-auto ml-auto">
                    <div className="flex gap-2 justify-center items-center ml-auto px-2">
                        <h1 className="text-xs text-green-300">▲</h1>
                        <h1 className="text-2xl text-green-300">{calculateTotalPlays(maps!) - calculateTotalPlays(mapsOld)}</h1>
                    </div>
                    <div className="text-xs text-zinc-400">total plays for last {getTimeAgoString(mapsOldLastTimeFetched!)}</div>
                </div>
                : null
            }

        </>
    );
};

export default SummaryCard;