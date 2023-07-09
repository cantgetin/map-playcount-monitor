import {useEffect, useState} from "react";
import {getUserBeatmaps} from "@/utils/utils";
import {OsuMap} from "@/interfaces/Map";
import MapCardList from "@/components/MapCardList";

function Maps() {

    let [accessToken, setAccessToken] = useState<string>('')
    let [refreshToken, setRefreshToken] = useState<string>('')
    let [maps, setMaps] = useState<OsuMap[]>([])

    useEffect(() => {
        setRefreshToken(localStorage.getItem('refresh_token'))
        setAccessToken(localStorage.getItem('access_token'))
        getUserBeatmaps().then((r: OsuMap[]) => {
            setMaps(r)
        })
    }, [])

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl">Maps</h1>
                <MapCardList maps={maps}/>
            </div>
        </div>
    )
}

export default Maps;