import axios from "axios";

export const endpointNoScheme = (process.env.NODE_ENV === 'production' ? 'chess-glade-dev.herokuapp.com/api/v1' : 'localhost:37629/api/v1');
export const endpoint = (process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + endpointNoScheme;
export const websocketEndpoint = (process.env.NODE_ENV === 'production' ? 'wss://' : 'ws://') + endpointNoScheme + '/games';

const axiosInstance = axios.create({
    baseURL: endpoint,
    timeout: 10_000
});

export function _v(url: string, vars: any): string {
    url.split('/').forEach((e) => {
        if (e.startsWith(':')) {
            url = url.replace(e, vars[e.substring(1)]);
        }
    });

    return url;
}

export default axiosInstance;