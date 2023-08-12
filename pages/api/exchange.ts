import { NextApiRequest, NextApiResponse } from "next";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

export default async function exchangeCodeForToken(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { code } = req.body;
    const url = new URL(
        "https://osu.ppy.sh/oauth/token"
    );
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    let body = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`;
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
    })
    const statusCode = response.status;
    const apiResponse = await response.json();
    res.status(statusCode).json({ ...apiResponse });
}