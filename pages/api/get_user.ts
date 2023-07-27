import {NextApiRequest, NextApiResponse} from "next";

export default async function getUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let {access_token} = req.body

    const url = new URL(
        "https://osu.ppy.sh/api/v2/me/osu"
    );

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };

    let apiResponse = await fetch(url, {
        method: "GET",
        headers,
    }).then(response => response.json());

    res.status(200).json({result: apiResponse});
}