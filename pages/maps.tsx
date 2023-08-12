import { useEffect, useState } from "react";
import { getUserWithRetry, getUserBeatmapsWithRetry } from "@/utils/utils";
import { OsuMap } from "@/interfaces/Map";
import MapCardList from "@/components/MapCardList";
import { User } from "@/interfaces/User";
import UserCard from "@/components/UserCard";
import LoadingSpinner from "@/components/LoadingSpinner";

function Maps() {

    let [user, setUser] = useState<User>({
        id: 0,
        graveyard_beatmapset_count: 0,
        unranked_beatmapset_count: 0,
        avatar_url: '',
        username: ''
    })

    let [maps, setMaps] = useState<OsuMap[]>([])
    let [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        getUserWithRetry().then((user) => {
            console.log('User: ', user)
            setUser(user)
            getUserBeatmapsWithRetry(user.id).then((userBeatmaps: OsuMap[]) => {
                setMaps(userBeatmaps)
                console.log('User Beatmaps: ', userBeatmaps)
                setLoaded(true)
            })
        })

    }, [])

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-2">
                {
                    loaded ?
                        <div className="p-10">
                            <UserCard user={user} />
                            <MapCardList maps={maps} />
                        </div>
                        :
                        <LoadingSpinner/>
                }
            </div>
        </div>
    )
}

export default Maps;