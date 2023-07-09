import axios from "axios";
import {TokenResponse} from "@/interfaces/TokenResponse";
import {OsuMap} from "@/interfaces/Map";

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
function generateRandomString() {
    return "x".repeat(5)
        .replace(/./g, c => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 62)]);
}

export function redirectToAuthorize() {
    const url = new URL(
        "https://osu.ppy.sh/oauth/authorize"
    );

    const randomString: string = generateRandomString()
    localStorage.setItem('state', randomString)

    const params: any = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "public identify",
        "state": randomString,
    };
    Object.keys(params)
        .forEach(key => url.searchParams.append(key, params[key]));

    window.location.href = url.toString();
}

export async function handleOsuSiteRedirect(state: string, code: string) {
    console.log(`redirect state: ${state} local state: ${localStorage.getItem('state')}, all good`)
    if (state == localStorage.getItem('state')) {
        localStorage.setItem('code', code?.toString())
        console.log('set the code to local storage, now exchange code for token')

        // exchange code for authorization token
        let res = await axios.post('/api/exchange', {code: code})

        let data : TokenResponse = res.data.result
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        console.log('set access and refresh token to localstorage', res)
    }
}

export async function getUserBeatmaps() : Promise<OsuMap[]> {
    return await axios.post('/api/get_beatmaps', {userId: 7192129, access_token: localStorage.getItem('access_token')}).then(r => r.data.result)
}