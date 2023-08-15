import { useEffect } from "react";
import MapCardList from "@/components/MapCardList";
import UserCard from "@/components/UserCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUser, selectUser, selectUserLoading } from "@/store/userSlice";
import { fetchMaps, selectMaps, selectMapsLoading, selectOldMaps } from "@/store/mapsSlice";
import { LoadingState } from "@/interfaces/LoadingState";

function Maps() {

    const dispatch = useAppDispatch();

    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);

    const maps = useAppSelector(selectMaps);
    const mapsLoading = useAppSelector(selectMapsLoading);

    const mapsOld = useAppSelector(selectOldMaps);

    useEffect(() => {
        dispatch(fetchUser())
    }, [])

    useEffect(() => {
        if (user) {
            console.log('User: ', user)
            dispatch(fetchMaps(user.id))
        }
    }, [user])

    useEffect(() => {
        if (maps) {
            console.log('Maps: ', maps)
        }
    }, [maps])

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-2">
                <div className="p-10">
                    {userLoading === LoadingState.Pending && <LoadingSpinner />}
                    {userLoading === LoadingState.Succeeded && user != null && <UserCard user={user} />}
                    {userLoading === LoadingState.Failed && <p>Failed to fetch user.</p>}
                    {mapsLoading === LoadingState.Pending && <p>Loading...</p>}
                    {mapsLoading === LoadingState.Succeeded && maps != null && <MapCardList maps={maps} mapsOld={mapsOld} />}
                    {mapsLoading === LoadingState.Failed && <p>Failed to fetch maps.</p>}
                </div>
            </div>
        </div>
    )
}

export default Maps;