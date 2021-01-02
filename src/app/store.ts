import {Action, configureStore, getDefaultMiddleware, ThunkAction} from '@reduxjs/toolkit';
import {connectRouter, push, routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from 'history'
import gameReducer from '../features/play_game/gameSlice';
import userProfileReducer from '../features/user_profile/userProfileSlice';
import authReducer from '../features/auth/authSlice';
import {ChessWebsocketTypes, registerType, setupWebsocket, websocketContainer} from "../data/websocket";
import {
    chessClockSync,
    chessGameCreateEvent,
    chessGameCreateEventError,
    chessJoinEvent,
    chessJoinEventError,
    chessMoveEvent,
    chessMoveEventError
} from "../data/resource/gameActions";

export const history = createBrowserHistory();

export const store = configureStore({
    middleware: getDefaultMiddleware().concat(routerMiddleware(history) as any),
    reducer: {
        router: connectRouter(history) as any,
        user_profile: userProfileReducer,
        game: gameReducer,
        auth: authReducer
    }
});

console.log(store)

setupWebsocket(store, websocketContainer);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;

registerType(ChessWebsocketTypes.SERVER_PLAYER_MOVE, (data: any) => {
    if (data.error) {
        store.dispatch(chessMoveEventError(data));
        return;
    }
    store.dispatch(chessMoveEvent(data));
});

registerType(ChessWebsocketTypes.SERVER_CREATE_GAME, (data: any) => {
    if (data.error) {
        store.dispatch(chessGameCreateEventError(data));
        return;
    }
    store.dispatch(chessGameCreateEvent(data));
    store.dispatch(push(`/games/${data.game_id}`))
});

registerType(ChessWebsocketTypes.SERVER_PLAYER_JOIN, (data: any) => {
    if (data.error) {
        store.dispatch(chessJoinEventError(data));
        return;
    }
    store.dispatch(chessJoinEvent(data));
});

registerType(ChessWebsocketTypes.SERVER_CLOCK_SYNC, (data: any) => {
    if (data.clock) {
        data.clock.whiteTimeLeft = data.clock.whiteTimeDeciSeconds * 100;
        data.clock.blackTimeLeft = data.clock.blackTimeDeciSeconds * 100;
        data.clock.lastMoveTime = data.clock.lastMoveTimeEpochMillis;
        data.clock.referenceTime = Date.now();
    }
    store.dispatch(chessClockSync(data));
})
