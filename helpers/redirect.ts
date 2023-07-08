import axios from "axios";

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