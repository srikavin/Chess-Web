import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import gameReducer from '../features/play_game/gameSlice';
import userProfileReducer from '../features/user_profile/userProfileSlice';
import authReducer from '../features/auth/authSlice';
import {ChessWebsocketTypes, registerType, setupWebsocket, websocketContainer} from "../data/websocket";
import {chessMoveEvent} from "../data/resource/gameActions";

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
    console.log(data);
    store.dispatch(chessMoveEvent(data));
});

