import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import gameReducer from '../features/play_game/gameSlice';
import userProfileReducer from '../features/user_profile/userProfileSlice';
import authReducer from '../features/auth/authSlice';
import {ChessWebsocketTypes, registerType, setupWebsocket, websocketContainer} from "../data/websocket";
import {
    chessClockSync,
    chessJoinEvent,
    chessJoinEventError,
    chessMoveEvent,
    chessMoveEventError
} from "../data/resource/gameActions";

export const store = configureStore({
    reducer: {
        user_profile: userProfileReducer,
        game: gameReducer,
        auth: authReducer
    }
});

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
