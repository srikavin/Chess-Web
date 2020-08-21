import axios from "axios";

const environment = process.env.NODE_ENV;

export const endpointNoScheme = (environment === 'production' ? 'chess-glade-dev.herokuapp.com/api/v1' : 'localhost:37629/api/v1');
export const endpoint = (environment === 'production' ? 'https://' : 'http://') + endpointNoScheme;
export const websocketEndpoint = (environment === 'production' ? 'wss://' : 'ws://') + endpointNoScheme + '/games';

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