import {useState} from "react";

function Maps() {

    let [accessToken, setAccessToken] = useState<string>(localStorage.getItem('access_token'))
    let [refreshToken, setRefreshToken] = useState<string>(localStorage.getItem('refresh_token'))

    return (
        <>
            <div>maps</div>
            <h1>Access token</h1>
            <span>{accessToken}</span>
            <h1>Refresh token</h1>
            <span>{refreshToken}</span>
        </>
    )
}

export default Maps;