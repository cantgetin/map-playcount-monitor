import {NextApiRequest, NextApiResponse} from "next";

export default async function getUser(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { access_token } = req.body;
    const url = new URL('https://osu.ppy.sh/api/v2/me/osu');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`,
    };
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    const statusCode = response.status;
    const apiResponse = await response.json();
    res.status(statusCode).json({ ...apiResponse });
}