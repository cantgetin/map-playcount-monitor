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
    selectMapsLoading,
    selectOldMaps,
} from "@/store/mapsSlice";
import { LoadingState } from "@/interfaces/LoadingState";
import SummaryCard from "@/components/SummaryCard";
import MapFilter from "@/components/MapFilter";

function Maps() {
    const dispatch = useAppDispatch();

    const { user, maps, mapsOld } = useAppSelector((state) => ({
        user: selectUser(state),
        maps: selectMaps(state),
        mapsOld: selectOldMaps(state),
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
            console.log('User:',user)
            console.log('Maps:',maps)
        }
    }, [maps])

    const userLoadingState = useAppSelector(selectUserLoading);
    const mapsLoadingState = useAppSelector(selectMapsLoading);

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col">
                <div className="p-10 gap-2">
                    {userLoadingState === LoadingState.Succeeded &&
                        mapsLoadingState === LoadingState.Succeeded &&
                        user &&
                        maps && (
                            <UserCard user={user}>
                                <SummaryCard user={user} maps={maps} mapsOld={mapsOld} />
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
        </div>
    );
}

export default Maps;