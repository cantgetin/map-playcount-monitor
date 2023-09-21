import axios from "axios";
import { TokenResponse } from "@/interfaces/TokenResponse";
import { OsuMap } from "@/interfaces/Map";

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
        let res = await axios.post('/api/exchange', { code: code })

        let data: TokenResponse = res.data
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        console.log('set access and refresh token to localstorage', res)
    }
}

export async function exchangeRefreshTokenForAccessToken(refreshToken: string) {
    return await axios.post('/api/refresh', { refreshToken: localStorage.getItem('refresh_token') }).then(r => r.data)
}

export async function getUserBeatmaps(userId: number): Promise<OsuMap[]> {
    const types = ['graveyard', 'loved', 'nominated', 'pending', 'ranked']
    let maps : OsuMap[] = []
    for (let type of types) {
        await axios.post('/api/get_beatmaps', { userId: userId, type: type, access_token: localStorage.getItem('access_token') }).then(r => {
            const arrayOfObjects = Object.keys(r.data).map(key => ({
                key,
                ...r.data[key],
            }));
            maps = maps.concat(arrayOfObjects);
        })
    }
    return maps
}

export async function getUser(): Promise<any> {
    return await axios.post('/api/get_user', { access_token: localStorage.getItem('access_token') }).then(r => r.data)
}

export async function getUserWithRetry() {
    try {
        const user = await getUser();
        return user;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            const res = await exchangeRefreshTokenForAccessToken(refreshToken!);
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('refresh_token', res.refresh_token);
            const user = await getUser();
            return user;
        } else {
            throw error;
        }
    }
};

export async function getUserBeatmapsWithRetry(userId: number) {
    try {
        const beatmaps = await getUserBeatmaps(userId);
        return beatmaps;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            const res = await exchangeRefreshTokenForAccessToken(refreshToken!);
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('refresh_token', res.refresh_token);
            const beatmaps = await getUserBeatmaps(userId);
            return beatmaps;
        } else {
            throw error;
        }
    }
};

// async function handleApiError<T>(error: any, originalFunction: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
//     if (error.response && (error.response.status === 401)) {
//         let refreshToken = localStorage.getItem('refresh_token')
//         const res = await exchangeRefreshTokenForAccessToken(refreshToken!);
//         localStorage.setItem('access_token', res.access_token);
//         localStorage.setItem('refresh_token', res.refresh_token);
//         return originalFunction(...args);
//     } else {
//         throw error;
//     }
// }