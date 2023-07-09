import {NextApiRequest, NextApiResponse} from "next";

export default async function getUserBeatmaps(
    req: NextApiRequest,
    res: NextApiResponse
) {

    let {access_token, userId} = req.body

    const url = new URL(
        `https://osu.ppy.sh/api/v2/users/${userId}/beatmapsets/graveyard`
    );

    const params = {
        "limit": "50",
        "offset": "0",
    };

    Object.keys(params)
        .forEach(key => url.searchParams.append(key, params[key]));

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };

    let stuff = await fetch(url, {
        method: "GET",
        headers,
    }).then(response => response.json())

    res.status(200).json({result: stuff});
}