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
    let maps: OsuMap[] = []
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

export function unixTimestampToDate(timestampString: string): string {
    const timestamp = parseInt(timestampString, 10);
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 
        ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getTimeAgoString(timestampString: string): string {
    let timestamp = parseInt(timestampString, 10);
    const now = new Date().getTime();
    const timeDifference = now - timestamp;

    return millisecondsToDHMString(timeDifference)
}

export function millisecondsToDHMString(time: number): string {
    const minutesAgo = Math.floor(time / (1000 * 60));
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    if (daysAgo > 0) {
        return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
        return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    } else if (minutesAgo > 0) {
        return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    } else {
        return 'just now';
    }
}

export function getMapRemainingPendingTime(dateString: string): string {
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - targetDate.getTime();
    const daysInMilliseconds = 28 * 24 * 60 * 60 * 1000;
    if (differenceInMilliseconds < daysInMilliseconds) {
      return `pending for ${millisecondsToDuration(daysInMilliseconds - differenceInMilliseconds)}`
    } else {
      return ''
    }
}

function millisecondsToDuration(milliseconds: number): string {
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const oneMinute = 60 * 1000;
    const days = Math.floor(milliseconds / oneDay);
    milliseconds %= oneDay;
    const hours = Math.floor(milliseconds / oneHour);
    milliseconds %= oneHour;
    const minutes = Math.floor(milliseconds / oneMinute);
  
    let result = '';
    if (days > 0) {
      result += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
  
    return result.trim();
  }