export interface OsuMap {
    id: number
    artist: string
    title: string
    created: string
    covers: MapCovers
    beatmaps: Beatmap[]
}

export interface MapCovers {
    card: string
    cover: string
}

export interface Beatmap {
    difficulty_rating: number
    version: string
    playcount: number
}