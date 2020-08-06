import {Identifier} from "../identifier";
import axiosInstance, {_v, endpoint} from "../_common";

export interface User {
    id: string;
    username: string;
    lastSeen: Date;
    bio: string;
    profilePicUrl: string;
}

function normalizeUser(user: User): User {
    user.profilePicUrl = `${endpoint}/users/${user.id}/preview`

    return user;
}

export const UserApi = {
    async getUserById(id: UserIdentifier) {
        let req = await axiosInstance.get(_v('/users/:id', {id}));

        return normalizeUser(req.data);
    },
    async getUserByName(username: string) {
        let req = await axiosInstance.get('/users/', {params: {username}});

        return normalizeUser(req.data);
    }
}

export type UserIdentifier = Identifier;