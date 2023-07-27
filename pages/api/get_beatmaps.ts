import {NextApiRequest, NextApiResponse} from "next";

export default async function getUserBeatmaps(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { access_token, userId }: any = req.body;

    const url = new URL(
        `https://osu.ppy.sh/api/v2/users/${userId}/beatmapsets/graveyard`
    );

    const params: { [key: string]: string } = {
        limit: '50',
        offset: '0',
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
    };

    let apiResponse: any = await fetch(url, {
        method: 'GET',
        headers,
    }).then(response => response.json());

    res.status(200).json({ result: apiResponse });
}