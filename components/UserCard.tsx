import React from 'react';
import {User} from "@/interfaces/User";

interface UserProps {
    user: User
}

const UserCard = (props: UserProps) => {
    return (
        <div className="flex bg-zinc-900 w-full">
            <img src={props.user.avatar_url} height={200} width={200}/>
            <div className="p-2">
                <span>Logged in as:</span>
                <h1 className="text-3xl">{props.user.username}</h1>
            </div>
        </div>
    );
};

export default UserCard;