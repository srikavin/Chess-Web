export const AuthService = {
    persistToken(token: string, user_id: string) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", user_id);
    },
    getToken() {
        return [localStorage.getItem("auth_token") || undefined, localStorage.getItem("auth_user") || undefined]
    },
    logout() {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
    }
}