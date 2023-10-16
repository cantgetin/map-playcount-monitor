import { useEffect } from "react";
import MapCardList from "@/components/MapCardList";
import UserCard from "@/components/UserCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchUser,
    selectUser,
    selectUserLoading,
} from "@/store/userSlice";
import {
    fetchMaps,
    selectMaps,
    selectMapsLastTimeFetched,
    selectMapsLoading,
    selectMapsOldLastTimeFetched,
    selectOldMaps,
} from "@/store/mapsSlice";
import { LoadingState } from "@/interfaces/LoadingState";
import SummaryCard from "@/components/SummaryCard";
import SummaryCard2 from "@/components/SummaryCard2";

function Maps() {
    const dispatch = useAppDispatch();

    // add hook for this stuff below
    const { user, maps, mapsOld, mapsLastTimeFetched, mapsOldLastTimeFetched } = useAppSelector((state) => ({
        user: selectUser(state),
        maps: selectMaps(state),
        mapsOld: selectOldMaps(state),
        mapsLastTimeFetched: selectMapsLastTimeFetched(state),
        mapsOldLastTimeFetched: selectMapsOldLastTimeFetched(state),
    }));

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            dispatch(fetchMaps(user.id));
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (maps) {
            console.log('User:', user)
            console.log('Maps:', maps)
        }
    }, [maps])

    const userLoadingState = useAppSelector(selectUserLoading);
    const mapsLoadingState = useAppSelector(selectMapsLoading);

    return (
        <div className="flex justify-center items-center">
                <div className="p-10 flex flex-col gap-2">
                    {userLoadingState === LoadingState.Succeeded &&
                        mapsLoadingState === LoadingState.Succeeded &&
                        user &&
                        maps && (
                            <UserCard user={user}>
                                <SummaryCard user={user} maps={maps} mapsOld={mapsOld} />
                                <SummaryCard2 maps={maps} mapsLastTimeFetched={mapsLastTimeFetched} mapsOldLastTimeFetched={mapsOldLastTimeFetched}/>
                            </UserCard>
                        )}
                    {mapsLoadingState === LoadingState.Succeeded && maps && (
                        <MapCardList maps={maps} mapsOld={mapsOld} />

                    )}
                    {(mapsLoadingState === LoadingState.Pending || userLoadingState === LoadingState.Pending) && <LoadingSpinner />}
                    {mapsLoadingState === LoadingState.Failed && (<p>Failed to fetch maps.</p>)}
                    {userLoadingState === LoadingState.Failed && (<p>Failed to fetch user.</p>)}
                </div>
        </div>
    );
}

export default Maps;