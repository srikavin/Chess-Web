import axios from "axios";

// export const endpoint = 'http://localhost:37629/api/v1'
export const endpointNoScheme = 'localhost:37629/api/v1'
// export const endpointNoScheme = 'chess-glade-dev.herokuapp.com/api/v1';
export const endpoint = 'http://' + endpointNoScheme;
export const websocketEndpoint = 'ws://' + endpointNoScheme + '/games';


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