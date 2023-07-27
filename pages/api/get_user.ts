import {NextApiRequest, NextApiResponse} from "next";

export default async function getUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { access_token }: any = req.body;

    const url = new URL('https://osu.ppy.sh/api/v2/me/osu');

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