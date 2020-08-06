import {Identifier} from "./identifier";
import axiosInstance from "./_common";
import {User, UserApi} from "./resource/users";

type AuthResponse = {
    success?: false | undefined;
    error: true;
} | {
    success: true;
    error: null | undefined;
    user_id: Identifier;
    username: string;
    token: string;
}

async function setToken(token: string | null, user: User | null) {
    if (token === null || user === null) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        return;
    }

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
}


export const AuthService = {
    async login(username: string, password: string) {
        let response = await axiosInstance.post('/auth', {
            request: 'login',
            username,
            password
        });

        let data: AuthResponse = response.data;

        if (data.error || !data.success) {
            return {
                error: true,
                reason: data.error
            }
        }

        let user = await UserApi.getUserById(data.user_id);

        if (!user) {
            return {
                error: true
            }
        }

        await setToken(data.token, user)

        return {
            error: false,
            token: data.token,
            user
        }
    },
    async logout() {
        return await setToken(null, null);
    }
}