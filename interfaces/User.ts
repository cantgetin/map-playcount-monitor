export interface User {
    id: number
    avatar_url: string
    username: string
    graveyard_beatmapset_count: number
    unranked_beatmapset_count: number
    //last_time_fetched: number
}

export const emptyUser: User = {
    id: 0,
    graveyard_beatmapset_count: 0,
    unranked_beatmapset_count: 0,
    avatar_url: '',
    username: ''
    //last_time_fetched: 0,
}