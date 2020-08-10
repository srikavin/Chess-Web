import {Identifier} from "../identifier";
import axiosInstance, {_v, endpoint} from "../_common";

export interface User {
    id: string;
    username: string;
    lastSeen: Date;
    bio: string;
    profilePicUrl: string;
}

export type AuthResponse = {
    token: string;
    userId: string;
}

function normalizeUser(user: User): User {
    user.profilePicUrl = `${endpoint}/users/${user.id}/preview`

    return user;
}

function normalizeAuth(response: any): AuthResponse {
    response.userId = response.user_id;

    return response;
}

export const UserApi = {
    async getUserById(id: UserIdentifier) {
        let req = await axiosInstance.get(_v('/users/:id', {id}));

        return normalizeUser(req.data);
    },
    async getUserByName(username: string) {
        let req = await axiosInstance.get('/users/', {params: {username}});

        return normalizeUser(req.data);
    },
    async register(username: string, password: string): Promise<AuthResponse> {
        return new Promise(async (res, rej) => {
            let req = await axiosInstance.post('/auth', {username, password, request: 'register'});

            if (req.data.error) {
                rej(req.data.error);
                return;
            }

            res(normalizeAuth(req.data));
        })
    },
    async login(username: string, password: string): Promise<AuthResponse> {
        return new Promise(async (res, rej) => {
            let req = await axiosInstance.post('/auth', {username, password, request: 'login'});

            if (req.data.error) {
                rej(req.data.error);
                return;
            }

            res(normalizeAuth(req.data));
        })
    }
}

export type UserIdentifier = Identifier;