import {createAction, EnhancedStore} from "@reduxjs/toolkit";
import {websocketEndpoint} from "./_common";
import {AuthService} from "./auth";

export const websocketDisconnect = createAction<undefined>("websocket/disconnect");
export const websocketConnect = createAction<undefined>("websocket/connect");

export enum ChessWebsocketTypes {
    CLIENT_MAKE_MOVE = "make_move",
    CLIENT_GAME_LISTEN = "listen",
    CLIENT_GAME_STOP_LISTEN = "stop_listen",
    CLIENT_JOIN_GAME = "join_game",
    CLIENT_REQUEST_CLOCK_SYNC = "request_clock_sync",
    SERVER_PLAYER_MOVE = "player_move",
    SERVER_PLAYER_JOIN = "player_join",
    SERVER_CLOCK_SYNC = "clock_sync",
    UPDATE = "update"
}

type WebsocketListener = (message: any) => void;

const listeners: Map<ChessWebsocketTypes, Array<WebsocketListener>> = new Map()
const queue: Array<string> = [];

const baseBackOffInterval = 250;
let backOffInterval = 0;

const websocket = new WebSocket(websocketEndpoint);

export const setupWebsocket = (store: EnhancedStore, container: { websocket: WebSocket }) => {
    let _websocket: WebSocket;
    if (container.websocket !== websocket || container.websocket.readyState === WebSocket.CLOSED) {
        _websocket = new WebSocket(websocketEndpoint);
        container.websocket = _websocket;
    } else {
        _websocket = websocket;
    }

    console.log('opening new socket')

    _websocket.onclose = (e) => {
        console.log(e.wasClean)
        if (!e.wasClean) {
            setTimeout(() => setupWebsocket(store, container), baseBackOffInterval + backOffInterval);
            console.log(baseBackOffInterval + backOffInterval)
            backOffInterval += 2000;
        }
        console.error(e)
        store.dispatch(websocketDisconnect())
    }

    _websocket.onopen = () => {
        backOffInterval = 0;
        store.dispatch(websocketConnect());

        queue.forEach((val) => {
            _websocket.send(val);
        })
        queue.length = 0;
    }

    _websocket.onerror = () => {
        console.log('onerror')
        // do nothing, as onclose will be called immediately afterwards
    }

    _websocket.onmessage = (e) => {
        let payload = JSON.parse(e.data);

        let arr = listeners.get(payload.type);
        if (arr === undefined) {
            console.log("unknown message type", payload);
            return;
        }

        arr.forEach((value) => value(payload));
    }

    return container;
}

const _websocketContainer = {
    websocket
};

export function registerType(type: ChessWebsocketTypes, listener: WebsocketListener) {
    let arr = listeners.get(type);

    if (arr === undefined) {
        arr = [];
    }

    listeners.set(type, arr.concat(listener));
}

export function sendWebsocketMessage(type: ChessWebsocketTypes, payload: object) {
    const [token,] = AuthService.getToken();

    const str = JSON.stringify({request: type, ...(token ? {token} : {}), ...payload})
    console.log('sending', str);


    if (websocketContainer.websocket.readyState !== websocket.OPEN) {
        queue.push(str);
        return;
    }
    websocketContainer.websocket.send(str);
}

export const websocketContainer = _websocketContainer;
