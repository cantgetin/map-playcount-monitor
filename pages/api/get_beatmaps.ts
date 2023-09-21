import { NextApiRequest, NextApiResponse } from "next";

export default async function getUserBeatmaps(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { access_token, userId, type }: any = req.body;
    const url = new URL(
        `https://osu.ppy.sh/api/v2/users/${userId}/beatmapsets/${type}`
    );
    const params: { [key: string]: string } = {
        limit: '100',
        offset: '0',
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
    };
    let response: any = await fetch(url, {
        method: 'GET',
        headers,
    })
    const statusCode = response.status;
    const apiResponse = await response.json();
    res.status(statusCode).json({ ...apiResponse });
}