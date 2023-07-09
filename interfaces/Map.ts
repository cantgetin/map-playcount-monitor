export interface OsuMap {
    id: number
    artist: string
    title: string
    created: string
    covers: MapCovers
    beatmaps: BeatMap[]
}

export interface MapCovers {
    card: string
    cover: string
}

export interface BeatMap {
    difficulty_rating: number
    version: string
    playcount: number
}