import {useEffect, useState} from "react";
import {getUser, getUserBeatmaps} from "@/utils/utils";
import {OsuMap} from "@/interfaces/Map";
import MapCardList from "@/components/MapCardList";
import {User} from "@/interfaces/User";
import UserCard from "@/components/UserCard";

function Maps() {

    let [user, setUser] = useState<User>({avatar_url:'',username:''})
    let [maps, setMaps] = useState<OsuMap[]>([])
    let [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        getUser().then((r) => {
            console.log(r)
            setUser(r)
            getUserBeatmaps().then((r: OsuMap[]) => {
                setMaps(r)
                setLoaded(true)
                console.log(user)
            })
        })

    }, [])

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-2">
                {
                    loaded ?
                        <div className="p-10">
                            <UserCard user={user}/>
                            <MapCardList maps={maps}/>
                        </div>
                        :
                        <h1>Loading...</h1>
                }
            </div>
        </div>
    )
}

export default Maps;