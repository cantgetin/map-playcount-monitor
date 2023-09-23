import { OsuMap } from "@/interfaces/Map"


interface MapFilterProps {
    maps: OsuMap[]
}

const types = ['graveyard', 'loved', 'nominated', 'pending', 'ranked', 'wip']

const MapFilter = (props: MapFilterProps) => {
    return (
        <div className="bg-zinc-900 w-full rounded-lg flex flex-col gap-1 mt-auto">
            <div className="flex flex-wrap gap-2">
            {
                types.map((type) => {
                    if (props.maps.filter(o => o.status == type).length == 0) return null
                    else return (
                        <div className="bg-zinc-800 px-2 py-1 rounded-lg text-sm cursor-pointer">
                            {type} {props.maps.filter(o => o.status == type).length}
                        </div>
                    )
                }
                )
            }
            </div>
        </div>
    )
}

export default MapFilter