import React from 'react';
import {User} from "@/interfaces/User";

interface UserProps {
    user: User
}

const UserCard = (props: UserProps) => {
    return (
        <div className="flex bg-zinc-900">
            <img src={props.user.avatar_url} height={200} width={200}/>
            <div className="p-2">
                <span>Logged in as:</span>
                <h1 className="text-4xl">{props.user.username}</h1>
                <h1 className="text-2xl mt-auto text-yellow-200">{props.user.graveyard_beatmapset_count+props.user.unranked_beatmapset_count} Maps</h1>
            </div>
        </div>
    );
};

export default UserCard;